<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { supabase } from '@/utils/supabaseClient'
import ProductCard from '@/components/ProductCard.vue'

const products = ref([])
const search = ref('')
const sortOption = ref('newest')
const currentPage = ref(1)

// 🔁 Адаптивное количество товаров в строке
const itemsPerRow = ref(4)

function updateItemsPerRow() {
  const width = window.innerWidth
  if (width < 768) {
    itemsPerRow.value = 2
  } else if (width < 1024) {
    itemsPerRow.value = 3
  } else {
    itemsPerRow.value = 4
  }
}

onMounted(() => {
  updateItemsPerRow()
  window.addEventListener('resize', updateItemsPerRow)
  fetchProducts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerRow)
})

const itemsPerPage = computed(() => itemsPerRow.value * 5)

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true) // ← фильтруем активные товары

  if (error) {
    console.error('Ошибка загрузки товаров:', error.message)
  } else {
    products.value = data.map(p => ({
      ...p,
      id: p.id.toString(),
      added_at: new Date(p.added_at),
      image_urls: typeof p.image_urls === 'string' ? JSON.parse(p.image_urls) : p.image_urls
    }))
  }
}

const filteredSortedProducts = computed(() => {
  let result = [...products.value]

  if (search.value) {
    result = result.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  switch (sortOption.value) {
    case 'oldest':
      result.sort((a, b) => a.added_at - b.added_at)
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    default:
      result.sort((a, b) => b.added_at - a.added_at)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredSortedProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredSortedProducts.value.slice(start, start + itemsPerPage.value)
})

watch([search, sortOption], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="shop-container">
    <div class="controls">
      <input v-model="search" placeholder="Search by name..." />
      <select v-model="sortOption">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
      </select>
    </div>

    <h2>ALL PRODUCTS</h2>
    <div class="products-grid">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">← PREVIOUS</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">NEXT →</button>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  background-color: #FAF9F6;
  font-family: 'Playfair', serif;
  color: #2f2f2f;
  padding: 20px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.controls input,
.controls select {
  padding: 10px;
  font-size: 18px;
  font-family: 'Lato', sans-serif;
  border: 1px solid #ccc;
  border-radius: 10px;
  flex: 1;
  min-width: 150px;
  color: #2f2f2f;
}

.controls select option {
  font-size: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
}

.products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

.products-grid > * {
  width: calc((100% - 20px) / 2);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  font-family: 'Lato', sans-serif;
}

.pagination button {
  background-color: #dcc8b4;
  color: #2f2f2f;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.pagination button:hover {
  background-color: #cfa38c;
  color: #fff;
}

.pagination button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  h2 {
    font-size: 32px;
  }

  .products-grid > * {
    width: calc((100% - 40px) / 3);
  }

  .pagination button {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .controls input,
  .controls select  {
    font-size: 24px;
  }

  .controls select option {
    font-size: 24px;
  }

  .products-grid > * {
    width: calc((100% - 60px) / 4);
  }
}
</style>
