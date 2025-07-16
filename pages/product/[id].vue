<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabaseClient'
import { useCart } from '@/composables/useCart'

const { addToCart } = useCart()

const route = useRoute()
const id = route.params.id

const product = ref(null)
const variants = ref([])
const selectedColor = ref(null)
const selectedSize = ref(null)
const mainImage = ref(null)
const showSizeGuide = ref(false)

const stockData = ref(null)
const loadingStock = ref(false)
const errorStock = ref(null)

const showModal = ref(false)
const modalTimeout = ref(null)
const quantity = ref(1)

const onAddToCart = () => {
  const selectedVariant = variants.value.find(
    v => v.color === selectedColor.value && v.size === selectedSize.value
    )
    if (!selectedVariant) return alert('Variant not found.')
  addToCart({
    pid: product.value.id,
    vid: selectedVariant.vid,
    name: product.value.name,
    price: product.value.price,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value,
    image: mainImage.value,
  })
  showModal.value = true

  clearTimeout(modalTimeout.value)
  modalTimeout.value = setTimeout(() => {
    showModal.value = false
  }, 2000)
}

onMounted(async () => {
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .limit(1)
    .maybeSingle()

  if (productError) console.error(productError)
  product.value = productData

  if (!product.value) return

  mainImage.value = product.value.image_urls?.[0] || '/placeholder.jpg'

  const { data: fetchedVariants, error: variantError } = await supabase
    .from('variants')
    .select('*')
    .eq('pid', id)

  if (variantError) console.error(variantError)
  variants.value = fetchedVariants ?? []

  if (product.value.colors === 1 && variants.value.length > 0) {
    selectedColor.value = variants.value[0].color
  }
})

async function fetchStock(vid) {
  loadingStock.value = true
  errorStock.value = null
  stockData.value = null

  const cacheKey = `stock_${vid}`
  const cache = localStorage.getItem(cacheKey)

  if (cache) {
    try {
      const { timestamp, data } = JSON.parse(cache)
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000

      if (now - timestamp < oneDay) {
        stockData.value = data
        quantity.value = data["CN"]?.total > 0 ? 1 : 0
        loadingStock.value = false
        return
      }
    } catch (e) {
      console.warn('Ошибка чтения кэша:', e)
    }
  }

  try {
    const res = await fetch(`/api/cj/checkStockByVid?vid=${encodeURIComponent(vid)}`)
    if (!res.ok) throw new Error('CJ API fetch error')

    const json = await res.json()
    if (!json.result || !Array.isArray(json.data)) {
      throw new Error(json.message || 'Ошибка от CJ API')
    }

    // Сохраняем отдельно по складам
    const warehouses = {}
    for (const item of json.data) {
      warehouses[item.countryCode] = {
        total: item.totalInventoryNum,
        cj: item.cjInventoryNum,
        factory: item.factoryInventoryNum
      }
    }

    stockData.value = warehouses

    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: warehouses
    }))
    quantity.value = warehouses["CN"]?.total > 0 ? 1 : 0

  } catch (err) {
    errorStock.value = err.message || 'Ошибка при загрузке'
  } finally {
    loadingStock.value = false
  }
}

watch([selectedColor, selectedSize], ([color, size]) => {
  if (!color || !size) {
    stockData.value = null
    errorStock.value = null
    return
  }

  const variant = variants.value.find(v => v.color === color && v.size === size)
  if (!variant) {
    stockData.value = null
    errorStock.value = 'Variant not found'
    return
  }

  fetchStock(variant.vid)
})

const uniqueColors = computed(() =>
  [...new Set(variants.value.map(v => v.color))].sort()
)

const availableSizes = computed(() =>
  variants.value
    .filter(v => v.color === selectedColor.value)
    .map(v => v.size)
    .sort()
)

const filteredImages = computed(() => {
  if (!product.value?.image_urls) return []
  if (!selectedColor.value || product.value.colors === 1) return product.value.image_urls

  const colorSlug = selectedColor.value.toLowerCase().replace(/\s+/g, '-')

  return product.value.image_urls.filter(url => {
    const fileName = url.split('/').pop()
    const parts = fileName.split('-')
    const colorParts = parts.slice(2, parts.length - 1)
    const fileColor = colorParts.join('-')

    return fileColor === colorSlug
  })
})

function selectColor(color) {
  selectedColor.value = color
  selectedSize.value = null
  const imgs = filteredImages.value
  if (imgs.length > 0) mainImage.value = imgs[0]
}

const formattedDescription = computed(() =>
  product.value?.long_description?.replace(/\n/g, '<br>') || ''
)

const maxQuantity = computed(() => stockData.value?.["CN"]?.total || 0)

const stockWarehouses = computed(() => {
  if (!stockData.value) return []
  return Object.entries(stockData.value).map(([country, data]) => ({
    country,
    ...data
  }))
})

const canAddToCart = computed(() =>
  selectedColor.value && selectedSize.value && stockData.value?.["CN"]?.total > 0
)

function increaseQuantity() {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div class="product-page" v-if="product">
    <div class="gallery">
      <img :src="mainImage" class="main-image" alt="Product Image" />
      <div class="thumbnails">
        <img
          v-for="(img, index) in filteredImages"
          :key="index"
          :src="img"
          @click="mainImage = img"
          :class="{ active: img === mainImage }"
        />
      </div>
    </div>

    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <p class="price">${{ product.price }}</p>
      <p class="description" v-html="formattedDescription"></p>
      <p class="material">Material: {{ product.material }}</p>

      <div class="variant-select">
        <label>Color:</label>
        <div class="colors">
          <button
            v-for="color in uniqueColors"
            :key="color"
            :class="{ active: color === selectedColor }"
            @click="selectColor(color)"
          >
            {{ color }}
          </button>
        </div>

        <label>Size:</label>
        <div class="sizes">
          <button
            v-for="size in availableSizes"
            :key="size"
            :class="{ active: size === selectedSize }"
            @click="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Size Guide -->
      <div v-if="product.size_information" class="size-chart">
        <h4 @click="showSizeGuide = !showSizeGuide">
          Size Guide
          <span v-if="!showSizeGuide">➕</span>
          <span v-else>➖</span>
        </h4>
        <div v-show="showSizeGuide">
          <div v-if="Array.isArray(product.size_information)" class="size-chart-images">
            <img
              v-for="(img, index) in product.size_information"
              :key="index"
              :src="img"
              alt="Size chart"
              class="size-chart-image"
            />
          </div>
          <div v-else-if="typeof product.size_information === 'string'" class="size-chart-images">
            <img
              :src="product.size_information"
              alt="Size chart"
              class="size-chart-image"
            />
          </div>
        </div>
      </div>

      <!-- Stock status -->
      <div class="stock-info" v-if="loadingStock">Checking availability...</div>
      <div class="stock-info error" v-if="errorStock">{{ errorStock }}</div>

      <!-- Quantity & Add to Cart -->
      <div v-if="canAddToCart" class="quantity-selector">
        <label>Quantity:</label>
        <div class="qty-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">–</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQuantity" :disabled="quantity >= maxQuantity">+</button>
        </div>
      </div>
      <button
        :disabled="!canAddToCart"
        class="add-to-cart-btn"
        @click="onAddToCart"
    >
        ADD TO CART
    </button>
    </div>
  </div>
  <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
    <div class="modal-content" @click.stop>
        <p>🎉 Added to cart!</p>
        <button @click="showModal = false">Close</button>
    </div>
    </div>

</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 24px 36px;
  border-radius: 16px;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border: 2px solid #dd8560;
  color: #2f2f2f;
}

.modal-content p {
  margin-bottom: 16px;
  font-weight: 600;
  font-family: 'Playfair', serif;
  font-size: 22px;
  color: #dd8560;
}

.modal-content button {
  padding: 6px 14px;
  background: #dd8560;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
}

.product-page {
  display: flex;
  gap: 20px;
  padding: 10px;
  background-color: #FAF9F6;
  padding-bottom: 40px;
}

.gallery {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-image {
  width: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: 20px;
}

.thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.thumbnails img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 10px;
}

.thumbnails img.active {
  border-color: #dd8560;
}

.product-details {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  font-family: 'Playfair', serif;
  font-size: 36px;
  font-weight: 500;
  color: #2f2f2f;
  margin: 0;
  text-transform: uppercase;
}

.price {
  color: #dd8560;
  font-weight: 600;
  font-size: 22px;
  margin: 0;
}

.material {
  margin: 0;
  font-style: italic;
  color: #6f6f6f;
}

.description {
  margin: 0;
  color: #6f6f6f;
  font-weight: 500;
  padding-right: 10px;
}

.variant-select {
  font-family: 'Playfair', serif;
}

.colors {
  margin-bottom: 20px;
}

.variant-select label {
  color: #2f2f2f;
}

.colors button,
.sizes button {
  margin: 10px 8px 0 0;
  padding: 8px 16px;
  border: 1px solid #6f6f6f;
  cursor: pointer;
  text-transform: capitalize;
  color: #2f2f2f;
  background-color: #FAF9F6;
  border-radius: 10px;
}

.colors button.active,
.sizes button.active {
  border: 2px solid #dd8560;
}

.size-chart {
  width: 100%;
  margin-top: 30px;
}

.size-chart h4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  font-family: 'Playfair', serif;
  font-size: 32px;
  margin: 0 0 10px;
  color: #2f2f2f;
}

.size-chart-images {
  transition: all 0.3s ease;
}

.size-chart-image {
  width: 100%;
  margin-top: 10px;
}

.stock-info {
  color: #555;
  font-size: 16px;
}

.stock-info.error {
  color: red;
}

.add-to-cart-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dcc8b4;
  color: #2f2f2f;
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: 40px;
  font-size: 28px;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #dcc8b4;
  color: #fff;
  font-weight: 600;
}

.quantity-selector {
  margin-top: 20px;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.qty-controls button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  border: 1px solid #6f6f6f;
  background-color: #fff;
  color: #2f2f2f;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.qty-controls button:hover:not(:disabled) {
  background-color: #f2f2f2;
}

.qty-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-controls span {
  font-size: 18px;
  width: 28px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .product-page {
    flex-direction: column;
  }

  .gallery, .product-details {
    width: 100%;
  }

  h1 {
    font-size: 28px;
  }

  .add-to-cart-btn {
    font-size: 24px;
  }
}
</style>
