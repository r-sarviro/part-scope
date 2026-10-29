import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // CSS-токены подключаются через @import, JS public API не нужен
    files: ['./src/shared/styles/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },
  {
    ignores: ['./src/test/**'],
  },
])
