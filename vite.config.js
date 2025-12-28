import { defineConfig } from 'vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mariok3/',
  plugins: [
    svelte({
      preprocess: vitePreprocess()
    })
  ],
  ssr: {
    noExternal: ['three']
  }
})
