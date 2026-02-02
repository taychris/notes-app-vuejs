import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfigExport from './vite.config'

const viteConfig =
  typeof viteConfigExport === 'function'
    ? viteConfigExport({ command: 'build', mode: 'test' })
    : viteConfigExport

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
