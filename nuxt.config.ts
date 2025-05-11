// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/test-utils',
    'nuxt-auth-utils'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    session: {
      cookie: {
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
      password: process.env.NUXT_SESSION_PASSWORD!,
    },
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})