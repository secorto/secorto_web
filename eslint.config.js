import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const sharedSettings = {
  'import/resolver': { typescript: {} },
  'import/core-modules': ['astro:content', 'astro:assets', 'astro:i18n']
}

const sharedRules = {
  'import/no-unresolved': 'error',
  'import/no-extraneous-dependencies': ['error', { devDependencies: ['cypress/**', 'tests/**', '**/*.spec.*', 'playwright.config.ts', 'vitest.config.ts'] }],
  'indent': ['error', 2, { SwitchCase: 1 }]
}

export default [
  // Ignore generated artifacts like coverage/dist/public
  {
    ignores: ['coverage/**', 'dist/**', 'public/**', '.astro/**.d.ts']
  },

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
      import: importPlugin,
      '@typescript-eslint': tsPlugin
    },
    settings: sharedSettings,
    rules: {
      ...sharedRules,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
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
