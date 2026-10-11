import { execFileSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

function appVersion() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA
  if (commit) return commit.slice(0, 7)
  try {
    return execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], {
      cwd: fileURLToPath(new URL('.', import.meta.url)),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion()),
  },
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
