import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            {
              debugName: 'personal-name-lists',
              name: (id) => {
                const list = id.match(/\/src\/data\/names\/([^/]+)\.ts$/)
                return list ? `names-${list[1]}` : null
              },
              test: /\/src\/data\/names\/[^/]+\.ts$/,
              priority: 10,
            },
            { name: 'generator-data', test: /\/src\/data\// },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
