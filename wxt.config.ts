import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: 'Yatta',
    description: 'やったー！',
    version: '1.0.0',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
