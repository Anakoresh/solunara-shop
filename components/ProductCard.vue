<template>
  <NuxtLink :to="`/product/${String(product.id)}`" class="product-card">
    <div
      class="product-img"
      :style="{ backgroundImage: product.image_urls?.[0] ? `url(${product.image_urls[0]})` : 'none' }"
    ></div>
    <h3>{{ product.name }}</h3>
    <p class="product-description">{{ product.description }}</p>
    <div class="product-info">
      <p class="price">${{ product.price }}</p>
      <p class="colors">{{ product.colors }} color{{ product.colors > 1 ? 's' : '' }}</p>
    </div>
    <button class="view-product">VIEW PRODUCT</button>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  product: Object
})

const product = props.product // ⬅️ Теперь можно использовать product

console.log('✅ ProductCard получил:', product)
</script>

<style scoped>
h3,
p {
  margin: 0;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
}

.product-img {
  width: 100%;
  height: 45vh;
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 20px;
}

h3 {
  color: #2f2f2f;
  font-family: 'Playfair', serif;
  font-size: 18px;
  font-weight: 500;
}

.product-description {
  color: #6f6f6f;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Lato', sans-serif;
  height: 55px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-family: 'Lato', sans-serif;
}

.price {
  color: #dd8560;
  font-size: 18px;
}

.colors {
  color: #6f6f6f;
  font-size: 16px;
}

button {
  padding: 10px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  background-color: #dcc8b4;
  color: #2f2f2f;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  border-radius: 40px;
}

.view-product:hover {
  background-color: #cfa38c;
  font-weight: 600;
  color: #fff;
}

@media (min-width: 768px) {
  .product-img {
    height: 50vh;
  }

  h3 {
    font-size: 28px;
  }

  .product-description,
  .price {
    font-size: 24px;
  }

  .colors,
  button {
    font-size: 20px;
  }
}

@media (min-width: 1240px) {
  .product-img {
    height: 70vh;
  }
}
</style>
