# ADR 004 — Configuración de ESLint y Refactoring de `any`

Documento técnico consolidado con configuración específica, tabla de
refactoings y estado actual de herramientas.

## Tabla de Contenidos

- [Refactoring de `any`](#refactoring-de-any)
- [Configuración de ESLint](#configuración-de-eslint)
- [Plugins y Reglas](#plugins-y-reglas)
- [Instrucciones de Copilot](#instrucciones-de-copilot)

---

## Refactoring de `any`

### Patrones Eliminados

| Patrón eliminado | Reemplazo | Ejemplo |
| --- | --- | --- |
| `any` en parámetros | Interfaces dedicadas | `function getData(data: PageData)` en lugar de `(data: any)` |
| `as unknown as any` | Genéricos | `DetailPageContext<T>` en lugar de `as unknown as any` |
| `any` en retornos | Tipos de colección | `CollectionEntry<CollectionKey>` en lugar de retornar `any` |
| `any` en tests | Objetos tipados | Interfaces de mock con tipos explícitos |

### Estado de Refactoring

- **Completado en `src/`:** múltiples archivos eliminaron `any` y usaron tipos
  explícitos
- **`cypress/e2e/stubs.ts`:** actualizado para eliminar `eslint-disable` y
  reemplazar `win: any` con tipo más seguro
- **Pendiente en `src/env.d.ts`:** revisar override de ESLint para `.d.ts` y
  considerar remover `eslint-disable` inline

---

## Configuración de ESLint

### ESLint Flat Config (v9)

```javascript
// eslint.config.js

import astroConfig from 'eslint-plugin-astro/configs/recommended'
import typescriptConfig from '@typescript-eslint/eslint-plugin/configs/recommended'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'

export default [
  {
    files: ['**/*.{js,ts,astro}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser'
    },
    plugins: {
      '@typescript-eslint': typescriptConfig,
      'import': importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'astro': astroConfig
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'cypress/**',
            'tests/**',
            '**/*.spec.*',
            'playwright.config.ts',
            'vitest.config.ts'
          ]
        }
      ],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'no-warning-comments': [
        'warn',
        { terms: ['ts-ignore'], location: 'anywhere' }
      ]
    }
  },
  astroConfig,
  {
    files: ['**/*.astro'],
    rules: astroConfig.rules
  }
]
```

### Reglas Clave

| Regla | Nivel | Propósito |
| --- | --- | --- |
| `@typescript-eslint/no-explicit-any` | error | Prohibir `any` explícitamente |
| `@typescript-eslint/no-unused-vars` | error | Detectar variables sin usar (permite `_` prefixed) |
| `import/no-unresolved` | error | Validar imports resueltos correctamente |
| `import/no-extraneous-dependencies` | error | Prevenir imports de dev deps en producción |
| `indent` | error | 2 espacios, ajustados para switch cases |
| `no-warning-comments` | warn | Detectar `ts-ignore` en código |

---

## Plugins y Reglas

### Plugins Activos

```text
ESLint (flat config, v9)

┌─────────────────────────────────────┐
│ @typescript-eslint                  │
│ - no-explicit-any ✅ (error)        │
│ - no-unused-vars ✅ (error)         │
│ - strict: disabled (tipos implícit) │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ eslint-plugin-import                │
│ - no-unresolved ✅ (error)          │
│ - no-extraneous-dependencies ✅     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ eslint-plugin-jsx-a11y              │
│ - alt-text ✅ (error)               │
│ - anchor-has-content ✅ (error)     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ eslint-plugin-astro                 │
│ - astro/no-set-html-directive ✅    │
│ - astro/no-unused-define-vars ✅    │
└─────────────────────────────────────┘
```

### Estado de Reglas

| Área | Estado | Nota |
| --- | --- | --- |
| `no-explicit-any` | ✅ Activa | Elevada a `error`; revisar excepciones |
| `no-unused-vars` | ✅ Activa | Con `_` prefix pattern para ignorar |
| `import/no-unresolved` | ✅ Activa | Alias de Astro configurados |
| Reglas de estilo | ❓ Pendientes | Trasladadas a ADR 012 |
| Prettier | ❓ En evaluación | Complemento a ESLint |

---

## Instrucciones de Copilot

Configuración en `.github/copilot-instructions.md` para asegurar consistencia:

```markdown
### Code Quality

- **Types:** Avoid `any` type; always define custom types or interfaces.
- **Variables:** Remove unused variables; use `_` prefix for intentional ignores.
- **Imports:** Use absolute paths with Astro aliases (`@config/*`, `@utils/*`).
- **Style:** No semicolons; 2-space indentation; trailing commas in objects/arrays.
```

Esto asegura que código generado por Copilot siga las convenciones del proyecto.

---

## Acciones Futuras

1. [ ] Verificar CI y agregar excepciones justificadas si `no-explicit-any`
       reporta fallos legítimos
2. [ ] Revisar `src/env.d.ts` y considerar remover `eslint-disable` inline
3. [ ] Implementar validación de imports adicional si es necesario
4. [ ] Migrar a reglas de estilo definidas (ver ADR 012)

---

## Referencias

- [ESLint Documentation](https://eslint.org/)
- [typescript-eslint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
- [ESLint Plugin Import](https://github.com/import-js/eslint-plugin-import)
- [ESLint Plugin JSX A11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [ESLint Plugin Astro](https://github.com/ota-meshi/eslint-plugin-astro)
- [ADR 013: Actualización a ESLint 10](../../013-lint-rule-changes.md)
- [ADR 012: Formato y convenciones](../../012-formatting-proposal.md)
