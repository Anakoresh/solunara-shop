<script>
import { useRoute } from 'vue-router'

export default {
  data() {
    return {
      isOpen: false,
      isShopOpen: false
    }
  },
  setup() {
    const route = useRoute()

    // Определяем активность родительского "Shop" — если путь начинается с /shop
    const isShopActive = () => route.path.startsWith('/shop')

    // Определяем активную категорию для подменю
    const activeCategory = () => {
      if (route.path === '/shop') return 'all'
      if (route.path.startsWith('/shop/dresses')) return 'dresses'
      if (route.path.startsWith('/shop/tops')) return 'tops'
      if (route.path.startsWith('/shop/bottoms')) return 'bottoms'
      if (route.path.startsWith('/shop/sets')) return 'sets'
      return null
    }

    return { isShopActive, activeCategory }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
      if (!this.isOpen) this.isShopOpen = false;
    },
    toggleShop() {
      this.isShopOpen = !this.isShopOpen;
    },
    closeMenu() {
      this.toggleMenu();
      this.isShopOpen = false;
    }
  }
}
</script>

<template>
  <div class="burger-container">
    <button class="burger-btn" @click="toggleMenu">
      <img src="/images/Menu.svg" alt="menu" />
    </button>

    <div v-if="isOpen" class="menu">
      <NuxtLink to="/" @click="toggleMenu" exact-active-class="active-link">Home</NuxtLink>

      <div class="shop-section">
        <div
          class="shop-toggle"
          @click="toggleShop"
          :class="{ 'active-link': isShopActive() }"
        >
          <span>Shop</span>
          <span class="arrow" :class="{ open: isShopOpen }">▼</span>
        </div>

        <div v-if="isShopOpen" class="shop-submenu">
          <NuxtLink
            to="/shop"
            @click="closeMenu"
            :class="{ 'active-link': activeCategory() === 'all' }"
          >All</NuxtLink>
          <NuxtLink
            to="/shop/dresses"
            @click="closeMenu"
            :class="{ 'active-link': activeCategory() === 'dresses' }"
          >Dresses</NuxtLink>
          <NuxtLink
            to="/shop/tops"
            @click="closeMenu"
            :class="{ 'active-link': activeCategory() === 'tops' }"
          >Tops</NuxtLink>
          <NuxtLink
            to="/shop/bottoms"
            @click="closeMenu"
            :class="{ 'active-link': activeCategory() === 'bottoms' }"
          >Bottoms</NuxtLink>
          <NuxtLink
            to="/shop/sets"
            @click="closeMenu"
            :class="{ 'active-link': activeCategory() === 'sets' }"
          >Sets</NuxtLink>
        </div>
      </div>

      <NuxtLink to="/track" @click="toggleMenu" exact-active-class="active-link">Track My Order</NuxtLink>
      <NuxtLink to="/faq" @click="toggleMenu" exact-active-class="active-link">FAQ</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.burger-btn {
  width: 50px;
  height: 50px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  position: relative;
}

.burger-btn img {
  width: 50px;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #FAF9F6;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 110px;
  padding-left: 40px;
  gap: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.menu a {
  text-decoration: none;
  color: #6f6f6f;
  font-size: 28px;
  font-weight: 500;
}

.shop-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shop-submenu {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  gap: 8px;
}

.shop-submenu a {
  font-size: 24px;
  font-weight: 500;
  color: #8a8a8a;
}

/* Активная ссылка */
.active-link {
  color: #B6867A !important;
}

.shop-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 28px;
  font-weight: 500;
  color: #6f6f6f;
}

.arrow {
  font-size: 16px;
  transition: transform 0.3s ease;
  color: #6f6f6f;
}

.arrow.open {
  transform: rotate(180deg);
}

@media (min-width: 768px) {
  .menu a {
    font-size: 32px;
  }

  .shop-submenu a {
    font-size: 28px;
  }

  .shop-toggle {
    font-size: 32px; 
  }
}

@media (min-width: 1024px) {
  .menu {
    width: 50vw;
    height: 100vh;
  }
}
</style>
