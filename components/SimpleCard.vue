<template>
  <NuxtLink :to="`/product/${product.id}`" class="simple-product-card">
    <div
      class="product-img"
      :style="{ backgroundImage: product.image_urls?.[0] ? `url(${product.image_urls[0]})` : 'none' }"
    ></div>
    <button class="view-product">VIEW</button>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  product: Object
})
</script>

<style scoped>
.simple-product-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  align-items: center;
}

.product-img {
  width: 100%;
  height: 50vh;
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 20px;
}

.view-product {
  padding: 10px 20px;
  background-color: #dcc8b4;
  color: #2f2f2f;
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: 40px;
  transition: background-color 0.3s;
  width: 100%;
}

.view-product:hover {
  background-color: #cfa38c;
  color: white;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .view-product {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .simple-product-card {
    width: 50%;
    margin: 0 auto;
  }

  .product-img {
    height: 40vh;
  }
}
</style>
