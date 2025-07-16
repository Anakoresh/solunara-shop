<script setup>
import { useCart } from '@/composables/useCart'
const { cart, totalItems, removeFromCart } = useCart()

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isCheckingOut = ref(false)
const router = useRouter()

async function handleCheckout() {
  if (isCheckingOut.value) return 
  isCheckingOut.value = true

  try {
    for (const item of cart.value) {
      const variantRes = await fetch(`/api/cj/checkStockByVid?vid=${encodeURIComponent(item.vid)}`)
      const res = await variantRes.json()

      if (!res?.data || !Array.isArray(res.data)) {
        alert("Oops! We couldn’t check the stock right now. Please wait a moment and try again.")
        isCheckingOut.value = false
        return
      }

      const warehouses = {}
      for (const entry of res.data) {
        warehouses[entry.countryCode] = {
          total: entry.totalInventoryNum,
          cj: entry.cjInventoryNum,
          factory: entry.factoryInventoryNum
        }
      }

      const cnAvailable = warehouses["CN"]?.total || 0

      if (cnAvailable < item.quantity) {
        alert(`Sorry, not enough stock for ${item.name}`)
        isCheckingOut.value = false
        return
      }

      localStorage.setItem(`stock_${item.vid}`, JSON.stringify({
        timestamp: Date.now(),
        data: warehouses
      }))
    }

    router.push('/checkout')
  } catch (e) {
    console.error(e)
    alert('Something went wrong. Please try again.')
  } finally {
    isCheckingOut.value = false
  }
}

</script>

<template>
  <div class="cart-page" v-if="cart.length > 0">
    <h1>YOUR CART <mark>({{ totalItems }} items)</mark></h1>

    <div class="cart-list">
      <div class="cart-item" v-for="(item, i) in cart" :key="i">
        <img :src="item.image" alt="product" class="product-image" />
        <div class="info">
          <h3>{{ item.name }}</h3>
          <p><strong>Color:</strong> {{ item.color }}</p>
          <p><strong>Size:</strong> {{ item.size }}</p>
          <p><strong>Quantity:</strong> {{ item.quantity }}</p>
          <p><strong>Price:</strong> ${{ item.price.toFixed(2) }}</p>
          <p><strong>Total:</strong> ${{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
        <button class="remove-btn" @click="removeFromCart(i)">❌</button>
      </div>
    </div>

    <div class="cart-summary">
      <h2>Total: ${{ cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) }}</h2>
      <button
        class="checkout-button"
        @click="handleCheckout"
        :disabled="isCheckingOut"
      >
        {{ isCheckingOut ? 'Checking stock...' : 'PROCEED TO CHECKOUT' }}
      </button>
    </div>
  </div>

  <div v-else class="empty-cart">
    <h2>Your cart is empty</h2>
    <router-link to="/shop" class="back-to-shop">GO BACK TO SHOP</router-link>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 20px;
  font-family: 'Playfair', serif;
  font-weight: 500;
  background-color: #faf9f6;
  min-height: calc(100vh - 110px);
  color: #2f2f2f;
}

h1 {
  font-size: 36px;
  margin-bottom: 30px;
  color: #2f2f2f;
}

h1 mark {
  color: #6f6f6f;
  background: none;
  font-weight: 500;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  background: white;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  position: relative;
  border-radius: 20px;
}

.product-image {
  width: 100px;
  height: auto;
  border-radius: 6px;
  margin-right: 20px;
  object-fit: cover;
}

.info {
  flex: 1;
  font-family: 'Lato', sans-serif;
}

.info h3 {
  margin-top: 0;
  font-size: 24px;
  font-family: 'Playfair', serif;
  color: #2f2f2f;
}

.info p {
  color: #6f6f6f;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #dd8560;
  cursor: pointer;
}

.cart-summary {
  text-align: end;
  margin-top: 40px;
}

.cart-summary h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.checkout-button {
  padding: 14px 24px;
  font-size: 18px;
  background-color: #dcc8b4;
  color: #2f2f2f;
  border: none;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  border-radius: 40px;
}

.checkout-button:hover {
  background-color: #cfa38c;
  color: #fff;
  font-weight: 600;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  color: #6f6f6f;
}

.back-to-shop {
  margin-top: 20px;
  display: inline-block;
  padding: 12px 20px;
  background-color: #dcc8b4;
  color: #2f2f2f;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  border-radius: 40px;
}

.back-to-shop:hover {
  background-color: #cfa38c;
  font-weight: 600;
  color: #fff;
}

/* 📱 Mobile */
@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  .cart-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .product-image {
    margin-bottom: 12px;
    margin-right: 0;
  }

  .info h3 {
    font-size: 18px;
  }

  .remove-btn {
    top: 8px;
    right: 8px;
  }

  .cart-summary {
    text-align: center;
  }
}

</style>
