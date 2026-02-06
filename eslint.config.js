import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import tsParser from '@typescript-eslint/parser'

const sharedSettings = {
  'import/resolver': { typescript: {} },
  'import/core-modules': ['astro:content', 'astro:assets', 'astro:i18n']
}

const sharedRules = {
  'import/no-unresolved': 'error',
  'import/no-extraneous-dependencies': ['error', { devDependencies: ['cypress/**', 'tests/**', '**/*.spec.*', 'playwright.config.ts'] }]
}

export default [
  // Recomendado para .astro (deja que el plugin procese .astro)
  ...eslintPluginAstro.configs.recommended,

  // Reglas y parser para TypeScript (.ts)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd()
      }
    },
    plugins: {
      import: importPlugin
    },
    settings: sharedSettings,
    rules: sharedRules
  },

  // Reglas para .astro (sin parser TS)
  {
    files: ['**/*.astro'],
    plugins: {
      'jsx-a11y': jsxA11y,
      import: importPlugin
    },
    settings: sharedSettings,
    rules: {
      ...sharedRules,
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
    }
  },
];
