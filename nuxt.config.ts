export default defineNuxtConfig({
  modules: ['nuxt-simple-sitemap'],

  sitemap: {
    siteUrl: 'https://solunara-shop.vercel.app',
    // routes можно не указывать, он сам сгенерирует по страницам из /pages
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&display=swap'
        }
      ]
    }
  },

  css: ['@/assets/css/global.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000
  }
})
