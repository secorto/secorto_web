import eslintPluginAstro from 'eslint-plugin-astro'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const sharedSettings = {
  'import/resolver': { typescript: {} },
  'import/core-modules': ['astro:content', 'astro:assets', 'astro:i18n'],
}

const sharedRules = {
  'indent': ['error', 2, { SwitchCase: 1 }],
  'no-warning-comments': [
    'warn',
    { terms: ['ts-ignore'], location: 'anywhere' }
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }
  ]
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
      '@typescript-eslint': tsPlugin
    },
    settings: sharedSettings,
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...sharedRules,
    }
  },

  // Reglas para .astro (sin parser TS)
  {
    files: ['**/*.astro'],
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    settings: sharedSettings,
    rules: {
      ...sharedRules,
    }
  },
]
