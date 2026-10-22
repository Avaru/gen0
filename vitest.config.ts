import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default defineConfig((env) =>
  mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        // Only UI tests opt into jsdom; generators and data need no browser setup.
        environment: 'node',
        setupFiles: ['./src/__tests__/setup.ts'],
        restoreMocks: true,
        unstubGlobals: true,
        // Keep CI's large name-data imports from competing across too many workers.
        maxWorkers: process.env.CI || process.env.VERCEL ? 2 : undefined,
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  ),
)
