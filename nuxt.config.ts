// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: [
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    '@vite-pwa/nuxt'
  ],

  pwa: {
    manifest: {
      name: "Gazette",
      theme_color: "#6750a4",
      description: "A mobile app client for Europresse.",
      icons: [
        {
          src: "/icon.png",
          sizes: "1024x1024",
          type: "image/png"
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['konsta'],
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
      "Playfair Display": [400, 500, 600, 700, 800],
    }
  },

  piniaPersistedstate: {
    storage: 'localStorage',
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
