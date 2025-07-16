<script setup>
import { ref } from 'vue'

const email = ref('')
const rawOrderNumber = ref('')
const order = ref(null)
const error = ref(null)
const loading = ref(false)

const trackOrder = async () => {
  error.value = null
  order.value = null

  if (!email.value.trim() || !rawOrderNumber.value.trim()) {
    error.value = 'Please enter your email and order number.'
    return
  }

  loading.value = true
  try {
    const fullOrderNumber = `order_${rawOrderNumber.value.trim()}`
    const data = await $fetch(`/api/orders/${fullOrderNumber}?email=${email.value.trim().toLowerCase()}`)

    if (data?.error) {
      error.value = 'Order not found. Please check your details.'
    } else {
      order.value = data
    }
  } catch (e) {
    error.value = 'Something went wrong. Try again later.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="track-page">
    <h1>Track Your Order</h1>

    <form @submit.prevent="trackOrder">
      <label>Email:</label>
      <input v-model="email" type="email" placeholder="you@example.com" required />

      <label>Order Number:</label>
      <input v-model="rawOrderNumber" type="text" placeholder="e.g. 1752576162778" required />

      <button type="submit">Track</button>
    </form>

    <div v-if="loading" class="loading">🔄 Checking your order...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="order" class="order-info">
      <h2>Order Info</h2>
      <p><strong>Order #:</strong> {{ order.order_number.replace('order_', '') }}</p>
      <p><strong>Name:</strong> {{ order.name }}</p>
      <p><strong>Email:</strong> {{ order.email }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <p><strong>Total:</strong> ${{ order.amount }}</p>

      <h3>Items:</h3>
      <ul>
        <li v-for="item in order.order_items" :key="item.vid">
          {{ item.name }} ({{ item.size }} / {{ item.color }}) × {{ item.quantity }} — ${{ (item.price * item.quantity).toFixed(2) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.track-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Lato', sans-serif;
  color: #2f2f2f;
  background: #faf9f6;
}

h1 {
  font-family: 'Playfair Display', serif;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 12px;
  font-size: 16px;
  background-color: #dd8560;
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 600;
  border-radius: 6px;
}

button:hover {
  background-color: #c66a4e;
}

.loading {
  margin-top: 1rem;
  color: #666;
  text-align: center;
}

.error {
  margin-top: 1rem;
  color: red;
  text-align: center;
}

.order-info {
  margin-top: 2rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.06);
}

.order-info h2 {
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.2rem;
}
</style>
