import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: ['packages/extension/src/parts/Main/Main.ts'],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: ['packages/extension/test/**/*.ts'],
    rules: {
      'virtual-dom/no-inline-event-handlers': 'off',
    },
  },
])
