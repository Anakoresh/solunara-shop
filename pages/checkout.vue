<script setup>
import { ref, computed, watch } from 'vue'
import { useCart } from '@/composables/useCart'
import { useRouter } from 'vue-router'
import { cjCountries } from '@/data/cjCountries'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const countries = ref(cjCountries)
const { cart, clearCart } = useCart()
const router = useRouter()

const country = ref('')
const shippingCost = ref(null)
const shippingService = ref('')
const shippingTime = ref('')
const isLoading = ref(false)
const error = ref(null)
const agreed = ref(false)
const isPlacingOrder = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  zip: '',
  city: '',
  province: '',
  address: '',
  address2: '',
  houseNumber: ''
})

// Объект для ошибок валидации
const validationErrors = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  city: ''
})

const totalQuantity = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity, 0)
)

const productTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const shippingText = computed(() => {
  if (shippingCost.value === null) return ''
  const limit = totalQuantity.value * 25
  const extra = Math.max(0, shippingCost.value - limit)
  return extra === 0 ? 'Free Shipping' : `Shipping: $${extra.toFixed(2)}`
})

const totalPayable = computed(() => {
  const limit = totalQuantity.value * 25
  const extra = Math.max(0, (shippingCost.value || 0) - limit)
  return productTotal.value + extra
})

const selectedCountryName = computed(() => {
  const match = cjCountries.find(c => c.countryCode === country.value)
  return match?.countryName || ''
})

const determineFromWarehouse = (toCountry) => {
  if (toCountry === 'US') {
    return cart.value.every(item => {
      const cache = localStorage.getItem(`stock_${item.vid}`)
      if (!cache) return false
      try {
        const { data } = JSON.parse(cache)
        return data?.US?.total >= item.quantity
      } catch {
        return false
      }
    }) ? 'US' : 'CN'
  }
  return 'CN'
}

const fetchShipping = async () => {
  if (!country.value) return
  isLoading.value = true
  error.value = null

  const from = determineFromWarehouse(country.value)
  const products = cart.value.map(item => ({
    vid: item.vid,
    quantity: item.quantity
  }))

  try {
    const res = await fetch('/api/cj/freightCalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startCountryCode: from,
        endCountryCode: country.value,
        products
      })
    })

    const json = await res.json()
    if (!json.result || !Array.isArray(json.data)) throw new Error(json.message || 'Shipping error')

    const methods = json.data
    const limit = totalQuantity.value * 25
    let selected

    if (methods.length === 0) throw new Error('No shipping methods')

    const freeOptions = methods.filter(m => m.logisticPrice <= limit)

    selected = freeOptions.length > 0
      ? freeOptions.reduce((fastest, current) => {
          const [f] = fastest.logisticAging.split('-').map(Number)
          const [c] = current.logisticAging.split('-').map(Number)
          return c < f ? current : fastest
        })
      : methods.reduce((cheapest, current) =>
          current.logisticPrice < cheapest.logisticPrice ? current : cheapest
        )

    shippingCost.value = selected.logisticPrice
    shippingService.value = selected.logisticName
    shippingTime.value = selected.logisticAging
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

watch(country, () => {
  if (country.value) fetchShipping()
})

// Функция валидации
function validateForm() {
  let isValid = true
  validationErrors.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    city: ''
  }

  if (!form.value.name.trim()) {
    validationErrors.value.name = 'Name is required'
    isValid = false
  }

  if (!form.value.email.trim()) {
    validationErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.value.email)) {
    validationErrors.value.email = 'Email is invalid'
    isValid = false
  }

  if (!form.value.phone.trim()) {
    validationErrors.value.phone = 'Phone number is required'
    isValid = false
  } else if (!/^\+?\d{7,15}$/.test(form.value.phone)) {
    validationErrors.value.phone = 'Phone number is invalid'
    isValid = false
  }

  if (!form.value.address.trim()) {
    validationErrors.value.address = 'Address is required'
    isValid = false
  }

  if (!country.value) {
    validationErrors.value.country = 'Country is required'
    isValid = false
  }

  if (!form.value.city.trim()) {
    validationErrors.value.city = 'City is required'
    isValid = false
  }

  return isValid
}

const createOrder = async () => {
  if (isPlacingOrder.value) return
  isPlacingOrder.value = true

  if (!validateForm()) {
    error.value = 'Please fix the errors in the form.'
    return
  }

  const orderNumber = `order_${Date.now()}`
  const amount = totalPayable.value.toFixed(2)

  const payload = {
    orderNumber,
    shippingZip: form.value.zip,
    shippingCountry: selectedCountryName.value,
    shippingCountryCode: country.value,
    shippingProvince: form.value.province,
    shippingCity: form.value.city,
    shippingCounty: '',
    shippingPhone: form.value.phone,
    shippingCustomerName: form.value.name,
    shippingAddress: form.value.address,
    shippingAddress2: form.value.address2,
    taxId: '',
    remark: '',
    email: form.value.email,
    consigneeID: '',
    payType: 3,
    shopAmount: productTotal.value.toFixed(2),
    logisticName: shippingService.value,
    fromCountryCode: determineFromWarehouse(country.value),
    houseNumber: form.value.houseNumber,
    iossType: '',
    platform: 'custom',
    iossNumber: '',
    products: cart.value.map(item => ({
      vid: item.vid,
      quantity: item.quantity,
      name: item.name,
      color: item.color,
      size: item.size,
      price: item.price
    }))

  }

  try {
    await $fetch('/api/cj/createOrder', {
      method: 'POST',
      body: payload
    })

    clearCart()

    router.push({
      path: '/thank-you',
      query: {
        orderNumber,
        email: form.value.email
      }
    })
  } catch (err) {
    console.error('❌ Failed to create order', err)
    error.value = err?.data?.message || 'Something went wrong'
  } finally {
    isPlacingOrder.value = false
  }
}

onMounted(() => {
  const timer = setTimeout(() => {
    router.push('/cart')
  }, 20 * 60 * 1000)

  onBeforeUnmount(() => clearTimeout(timer))
})

</script>

<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <div class="form">
      <label>
        Country:
        <Multiselect
          v-model="country"
          :options="countries.map(c => ({ label: c.countryName, value: c.countryCode }))"
          placeholder="Start typing country name..."
          searchable
        />
        <span class="error" v-if="validationErrors.country">{{ validationErrors.country }}</span>
      </label>

      <label>
        Name:
        <input v-model="form.name" />
        <span class="error" v-if="validationErrors.name">{{ validationErrors.name }}</span>
      </label>

      <label>
        Email:
        <input v-model="form.email" />
        <span class="error" v-if="validationErrors.email">{{ validationErrors.email }}</span>
      </label>

      <label>
        Phone:
        <input v-model="form.phone" />
        <span class="error" v-if="validationErrors.phone">{{ validationErrors.phone }}</span>
      </label>

      <label>
        ZIP Code:
        <input v-model="form.zip" />
      </label>

      <label>
        Province / State:
        <input v-model="form.province" />
      </label>

      <label>
        City:
        <input v-model="form.city" />
        <span class="error" v-if="validationErrors.city">{{ validationErrors.city }}</span>
      </label>

      <label>
        Address:
        <input v-model="form.address" />
        <span class="error" v-if="validationErrors.address">{{ validationErrors.address }}</span>
      </label>

      <label>
        Address 2:
        <input v-model="form.address2" />
      </label>

      <label>
        House Number:
        <input v-model="form.houseNumber" />
      </label>
    </div>

    <div v-if="shippingCost !== null" class="shipping-info">
      <p class="highlight">{{ shippingText }}</p>
      <p class="gray-text">Delivery in {{ shippingTime }} days</p>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <h2>Order Summary</h2>
    <ul>
      <li v-for="item in cart" :key="item.vid">
        {{ item.name }} ({{ item.color }} / {{ item.size }}) × {{ item.quantity }} — <br>$
        {{ (item.price * item.quantity).toFixed(2) }}
      </li>
    </ul>

    <p>Subtotal: ${{ productTotal.toFixed(2) }}</p>
    <p>{{ shippingText }}</p>
    <hr />
    <p><strong>Total:</strong> ${{ totalPayable.toFixed(2) }}</p>

    <label style="display: flex; align-items: center; gap: 10px; margin-top: 20px;" class="agreement">
      <input type="checkbox" v-model="agreed" />
      I agree to the <a href="/terms" target="_blank" style="color: #b6867a; text-decoration: underline;">Terms of Purchase</a>
    </label>

    <button
      class="place-btn"
      @click="createOrder"
      :disabled="isLoading || isPlacingOrder || !shippingCost || !agreed"
    >
      {{ isPlacingOrder ? 'Processing Order...' : 'CONFIRM & CREATE ORDER' }}
    </button>


    <p class="small-note">
      ⚠️ For international orders, please note:
      <br>- You may need to pay customs duties or taxes upon delivery (DDU terms).
      <br>- Some shipping methods are not trackable in all countries.
      <br>- We do not accept disputes in such cases.
    </p>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
  margin-left: 6px;
}

.checkout-page {
  font-family: 'Lato', sans-serif;
  background-color: #FAF9F6;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  color: #2f2f2f;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  margin-bottom: 1.5rem;
}

h2 {
  color: #6f6f6f;
}

.form label {
  display: block;
  margin: 10px 0;
  font-size: 24px;
}

.form input {
  min-height: 30px;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 20px;
  color: #2f2f2f;
  background-color: #FAF9F6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.place-btn {
  background-color: #DCC8B4;
  color: #2f2f2f;
  border: none;
  padding: 0.8rem 1.2rem;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  border-radius: 40px;
  width: 100%;
  font-weight: 500;
  font-size: 24px;
}

.place-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.place-btn:hover:not(:disabled) {
  background-color: #cfa38c;
  color: #fff;
  font-weight: 600;
}

.shipping-info {
  margin-top: 1rem;
}

.highlight {
  color: #B6867A;
  font-weight: bold;
}

.gray-text {
  color: #6f6f6f;
}

.error {
  color: red;
  margin-top: 1rem;
}

p {
  font-size: 24px;
}

li {
  font-size: 20px;
  color: #6f6f6f;
}

.small-note {
  font-size: 16px;
  color: #6f6f6f;
}

.agreement {
  font-size: 20px;
}

.agreement input {
  width: 30px;
  height: 30px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  .form label {
    font-size: 20px;
  }

  .form input {
    font-size: 18px;
  }

  .place-btn {
    font-size: 18px;
  }

  p {
    font-size: 20px;
  }

  li {
    font-size: 18px;
  }

  .small-note {
    font-size: 14px;
  }

  .agreement {
    font-size: 18px;
  }
}
</style>
