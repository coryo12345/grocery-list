import process from "node:process";

const sw = process.env.SW === "true";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  build: {
    transpile: ["vuetify"],
  },

  runtimeConfig: {
    jwtKey: "",
    appPassword: "",
  },

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  modules: ["@vite-pwa/nuxt"],

  pwa: {
    strategies: sw ? "injectManifest" : "generateSW",
    srcDir: sw ? "service-worker" : undefined,
    filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    manifest: {
      name: "Grocery List",
      short_name: "GroceryList",
      theme_color: "#000000",
      icons: [
        {
          src: "cart-192.jpg",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "cart-512.jpg",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "cart-512.jpg",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
