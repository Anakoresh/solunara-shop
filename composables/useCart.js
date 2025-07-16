import { ref, computed, watch } from 'vue'

const cart = ref([])

if (typeof window !== 'undefined') {
  const storedCart = localStorage.getItem('solunara_cart')
  cart.value = storedCart ? JSON.parse(storedCart) : []

  watch(cart, (newCart) => {
    localStorage.setItem('solunara_cart', JSON.stringify(newCart))
  }, { deep: true })
}

export function useCart() {
  const totalItems = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  function addToCart(item) {
    const existing = cart.value.find(i => i.vid === item.vid)

    if (existing) {
      existing.quantity += item.quantity
    } else {
      cart.value.push({ ...item })
    }
  }

  function removeFromCart(index) {
    cart.value.splice(index, 1)
  }

  // Добавляем clearCart
  function clearCart() {
    cart.value = []
  }

  return { cart, totalItems, addToCart, removeFromCart, clearCart }
}
