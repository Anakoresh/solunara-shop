<template>
  <div>
     <header class="header">
      <BurgerMenu />

      <h1 class="logo">Solunara</h1>

      <div class="cart">
        <router-link to="/cart" class="cart-link">
          <img src="/public/images/shopping bag.svg" alt="cart" />
          <span v-if="totalItems > 0" class="cart-count">{{ totalItems }}</span>
        </router-link>
      </div>
    </header>

    <div class="main-content">
      <NuxtPage />
    </div>

    <footer class="footer">
      <img class="line" src="/images/footer.png" alt="line" />

      <div class="contact-icons">
        <a href="https://pin.it/4Agv50MHo" target="_blank" rel="noopener">
          <img src="/images/Pinterest.png" alt="pinterest" />
        </a>
        <a href="https://www.instagram.com/solunarashop?igsh=MXNiaXZyZXd4bWRmdQ%3D%3D&utm_source=qr" target="_blank" rel="noopener">
          <img src="/images/Instagram.png" alt="instagram" />
        </a>
        <a href="https://www.tiktok.com/@solunara.shop?_t=ZS-8y4Ol1cJ6ll&_r=1" target="_blank" rel="noopener">
          <img src="/images/TikTok.png" alt="tiktok" />
        </a>
      </div>

      <p>
        <mark>Email: </mark>
        <a href="mailto:solunarashop@gmail.com">solunarashop@gmail.com</a>
      </p>

      <div class="footer-links">
        <NuxtLink to="/terms">Terms of Purchase</NuxtLink>
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
      </div>

      <img class="line" src="/images/footer.png" alt="line" />
    </footer>

  </div>
</template>

<script>
import BurgerMenu from '~/components/BurgerMenu.vue'
import { useCart } from '@/composables/useCart'

export default {
  components: {
    BurgerMenu
  },
  setup() {
    const { totalItems } = useCart()
    return { totalItems }
  }
}
</script>

<style scoped>

body {
  background-color: #FAF9F6;
}

.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 90px;
  background-color: #FAF9F6;
}

.burger img, .cart img, 
.contact-icons img {
  height: 50px;
  width: 50px;
}

.logo {
  font-size: 36px;
  font-weight: 500;
  color: #6f6f6f;
  margin: 0;
}

.cart {
  display: flex;
  gap: 5px;
}

.cart-count {
  color: #2f2f2f;
  text-decoration: none;
  font-family: 'Lato', sans-serif;
  font-size: 16px;
}

footer {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    align-items: center;
    gap: 20px;
    background-color: #FAF9F6;
}

a {
    text-decoration: none;
    color: #6f6f6f;
}

.contact-icons {
    display: flex;
    gap: 40px;
}

footer p {
    color: #6f6f6f;
    font-size: 24px;
    margin: 0;
}

footer mark {
    color: #2f2f2f;
    background: none;
}

.line {
    width: 100%;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  font-size: 16px;
  color: #6f6f6f;
}

.footer-links a {
  color: #6f6f6f;
  text-decoration: underline;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #b6867a;
}

@media (min-width: 768px) {
  header {
    height: 80px;
    padding: 20px;
  }

  .logo {
    font-size: 44px;
  }

  .cart-count {
    font-size: 20px;
  }

  footer p {
    font-size: 32px;
  }

  .line {
    height: 20px;
  }
}

@media (min-width: 1024px) {
    header {
        height: 100px;
    }
}

</style>