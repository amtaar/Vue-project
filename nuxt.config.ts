
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css",
    "~/node_modules/devextreme/dist/css/dx.light.css",
  ],
  modules: ["nuxt-icon", "@pinia/nuxt", "nuxt-primevue"],
  primevue: {
    unstyled: true,
    importPT: {
      from:"~/presets/lara/",
    },
  },
  plugins: [
    { src: "~/plugins/axios" },
    { src: "~/plugins/filesave" },
    { src: "~/plugins/vue-tailwind-datepicker" },
    // { src: "~/plugins/jwt-decode", mode: "client" },
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
