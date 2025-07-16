<template>
  <div class="home">
    <section class="hero-section">
      <div class="image-block">
        <img src="/images/hero.webp" alt="Hero" />
        <div class="overlay-text mobile-only">
          <h1>Discover Your<br />Feminine Style</h1>
          <button @click="$router.push('/shop')">SHOP NOW</button>
        </div>
      </div>

      <div class="content-block desktop-only">
        <div class="hero-text">
          <h1>Discover Your<br />Feminine Style</h1>
          <button @click="$router.push('/shop')">SHOP NOW</button>
        </div>

        <section class="preview-products" v-if="randomProducts.length">
          <h2>OUR PICKS</h2>
          <div class="preview-grid">
            <SimpleCard
              v-for="product in randomProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>
      </div>
    </section>

    <section class="preview-products mobile-only" v-if="randomProducts.length">
      <h2>Our Picks</h2>
      <div class="preview-grid">
        <SimpleCard
          v-for="product in randomProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabaseClient'
import SimpleCard from '@/components/SimpleCard.vue'

const randomProducts = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('products').select('*')
  if (!error && Array.isArray(data)) {
    const prepared = data.map(p => ({
      ...p,
      id: p.id.toString(),
      image_urls:
        typeof p.image_urls === 'string' ? JSON.parse(p.image_urls) : p.image_urls,
    }))
    randomProducts.value = [...prepared].sort(() => 0.5 - Math.random()).slice(0, 3)
  }
})
</script>

<style scoped>
.home {
  font-family: 'Playfair', serif;
  color: #2f2f2f;
  background-color: #faf9f6;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  font-weight: 500;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
}

.image-block {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgb(0 0 0 / 0.1);
}

.image-block img {
  width: 100%;
  height: 90vh;
  object-fit: cover;
  object-position: top;
  transition: transform 0.5s ease;
  border-radius: 20px;
}

.image-block:hover img {
  transform: scale(1.05);
}

.overlay-text {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #2f2f2f;
  text-shadow: 1px 1px 4px rgba(255 255 255 / 0.85);
  width: 70%;
}

.overlay-text h1 {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.1;
}

.overlay-text button {
  background-color: #dcc8b4;
  color: #2f2f2f;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  padding: 20px 40px;
  border: none;
  cursor: pointer;
  border-radius: 40px;
  box-shadow: 0 6px 14px rgba(220, 200, 180, 0.7);
  transition: background-color 0.3s ease;
}

.overlay-text button:hover {
  background-color: #cfa38c;
  color: #fff;
  font-weight: 600;
}

.content-block {
  display: none;
}

.preview-products {
  margin-top: 20px;
}

.preview-products h2 {
  font-family: 'Playfair', serif;
  font-weight: 600;
  font-size: 24px;
  text-align: center;
  color: #2f2f2f;
  text-transform: uppercase;
  margin-bottom: 24px;
  letter-spacing: 1.2px;
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* === Desktop styles === */
@media (min-width: 1024px) {
  .hero-section {
    flex-direction: row;
    gap: 40px;
  }

  .image-block {
    width: 45%;
    height: auto;
  }

  .image-block img {
    height: 100%;
  }

  .content-block {
    width: 55%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content-block .hero-text h1 {
    font-size: 64px;
    font-weight: 500;
    margin-bottom: 30px;
  }

  .content-block .hero-text button {
    font-size: 32px;
    font-weight: 500;
    color: #2f2f2f;
    padding: 18px 48px;
    border-radius: 40px;
    transition: background-color 0.3s ease;
    background-color: #dcc8b4;
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(220, 200, 180, 0.7);
  }

  .content-block .hero-text button:hover {
    background-color: #cfa38c;
    color: #fff;
    font-weight: 600;
  }

  .mobile-only {
    display: none;
  }

  .preview-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
}

/* Tablet view */
@media (min-width: 768px) {
  .overlay-text h1 {
    font-size: 64px;
  }

  .overlay-text button {
    font-size: 40px;
  }

  .preview-products h2 {
    font-size: 32px;
    text-align: left;
  }

  .preview-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
