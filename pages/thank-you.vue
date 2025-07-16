<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const orderNumber = route.query.orderNumber
const email = route.query.email
const order = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const data = await $fetch(`/api/orders/${orderNumber}?email=${email}`) 
    if (!data) throw new Error('Order not found')
    order.value = data

    await $fetch('/api/orders/mark-paid', {
      method: 'POST',
      body: {
        order_number: orderNumber,
        email
      }
    })

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="thank-you-page">
    <h1>Thank you for your order!</h1>

    <div v-if="loading" class="message">Loading your order...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="order">
      <p><strong>Order Number:</strong> {{ order.order_number.replace('order_', '') }}</p>
      <p><strong>Name:</strong> {{ order.name }}</p>
      <p><strong>Email:</strong> {{ order.email }}</p>

      <div class="items-block">
        <h2>Items:</h2>
        <ul>
          <li v-for="item in order.order_items" :key="item.vid">
            {{ item.name }} ({{ item.size }} / {{ item.color }}) × {{ item.quantity }} — 
            ${{ (item.price * item.quantity).toFixed(2) }}
          </li>
        </ul>
      </div>

      <p><strong>Total:</strong> ${{ order.amount }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>

      <div class="info-box">
        <p>📩 A payment link will be sent to your email shortly.</p>
        <p>
          📦 You can track your order status in
          <NuxtLink to="/track"><strong>Track My Order</strong></NuxtLink>
          using your order number.
        </p>
        <p>❓ If you have any questions, feel free to contact us at <a href="mailto:solunarashop@gmail.com">solunarashop@gmail.com</a>.</p>
      </div>
    </div>

    <button @click="$router.push('/')">🏠 BACK TO HOME</button>
  </div>
</template>

<style scoped>
.thank-you-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Lato', sans-serif;
  color: #2f2f2f;
  background-color: #FAF9F6;
  text-align: center;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  margin-bottom: 1.5rem;
  color: #2f2f2f;
  font-weight: 600;
}

.message,
.error {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #999;
}

.items-block {
  text-align: left;
  margin: 1.5rem auto;
  background: #fff;
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.items-block h2 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: #6f6f6f;
}

.items-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.items-block li {
  margin-bottom: 0.5rem;
  color: #6f6f6f;
  font-size: 0.95rem;
}

.info-box {
  margin-top: 2rem;
  padding: 1rem;
  background: #fff7ed;
  border-left: 4px solid #dd8560;
  border-radius: 20px;
  font-size: 0.95rem;
  text-align: left;
}

.info-box p {
  margin: 0.5rem 0;
  color: #6f6f6f;
}

.info-box a {
  color: #dd8560;
  text-decoration: underline;
}

button {
  margin-top: 2rem;
  padding: 12px 24px;
  background-color: #dcc8b4;
  color: #2f2f2f;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-weight: 500;
  box-shadow: 0 6px 14px rgba(220, 200, 180, 0.7);
  font-size: 24px;
}

button:hover {
  background-color: #cfa38c;
  color: #fff;
  font-weight: 600;
}

/* Mobile */
@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  .items-block,
  .info-box {
    padding: 1rem;
  }

  button {
    font-size: 18px;
  }
}
</style>
