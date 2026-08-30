# Implementación de lint usando eslint

## Contexto

El crecimiento del proyecto y la incorporación de refactorings para alcanzar 100 % de cobertura unitaria
revelaron problemas estructurales de calidad de código:

- Uso extendido de `any`, que anulaba las garantías de TypeScript.
- Ausencia de una configuración consolidada de ESLint.
- Inconsistencias en convenciones semánticas (imports, variables no usadas, accesibilidad).
- Código generado por herramientas con reglas distintas, dificultando mantener criterios uniformes.

Estos problemas afectaban la robustez del código, la detección temprana de errores y la confiabilidad del pipeline de CI.

> **Nota:** Las decisiones de estilo y formateo (semicolons, quotes, trailing commas, indentación, etc.)
> se documentan en **ADR 012**.
> Este ADR cubre únicamente reglas de análisis estático y calidad semántica.

## Decisión

Adoptar **ESLint (flat config)** como herramienta central de análisis estático, con reglas estrictas orientadas a:

- eliminar el uso de `any` salvo excepciones justificadas,
- detectar imports inválidos o dependencias no declaradas,
- asegurar accesibilidad en componentes `.astro`,
- evitar variables no utilizadas,
- consolidar convenciones semánticas del proyecto.

La configuración se basa en los siguientes plugins:

- `@typescript-eslint`
- `eslint-plugin-import`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-astro`

## Motivación

- Garantizar que errores de tipo y problemas semánticos se detecten en compilación, no en runtime.
- Reducir dependencias implícitas y errores silenciosos en imports.
- Alinear el ecosistema de tooling con TypeScript y Astro.
- Mantener un estándar mínimo de accesibilidad en componentes.
- Evitar que el código generado por herramientas introduzca inconsistencias semánticas.

## Reglas principales adoptadas

- `@typescript-eslint/no-explicit-any: error`
  Evita introducir nuevos `any` y obliga a definir tipos explícitos.

- `@typescript-eslint/no-unused-vars: error`
  Previene variables y parámetros no utilizados; permite ignorar nombres con `_`.

- `import/no-unresolved: error`
  Detecta imports rotos, especialmente con alias de Astro.

- `import/no-extraneous-dependencies: error`
  Garantiza que las dependencias usadas estén declaradas correctamente.

- `jsx-a11y/*`
  Reglas de accesibilidad para componentes `.astro` y JSX.

- Reglas específicas de Astro mediante `eslint-plugin-astro`.

## Consecuencias

### Positivas

- Eliminación progresiva de `any` y mayor seguridad en tiempo de compilación.
- Imports validados y menos errores silenciosos en rutas o alias.
- Accesibilidad mínima garantizada en componentes.
- CI más confiable al detectar problemas semánticos antes de ejecutar tests.
- Código generado por IA alineado mediante reglas en `.github/copilot-instructions.md`.

## Analisis detallado

Se elevó la regla `@typescript-eslint/no-explicit-any` a `error` para evitar
introducir nuevos `any` en el código fuente. El cambio ya está aplicado en
la configuración de ESLint; la idea es que el código del repositorio no
contenga nuevos `any` y que cualquier excepción sea explícita y justificada.

**Refactoring realizado / cambios inmediatos:**

Se reemplazaron muchos `any` del código fuente con tipos explícitos:

| Patrón eliminado | Reemplazo |
| --- | --- |
| `any` en parámetros | Interfaces dedicadas (`PageData`, `PostEntry`, etc.) |
| `as unknown as any` | Genéricos (`DetailPageContext<T>`) |
| `any` en retornos | Tipos de colección de Astro (`CollectionEntry<CollectionKey>`) |
| `any` en tests | Objetos tipados con interfaces de mock |

Resultado parcial: varios `any` fueron eliminados de `src/` y se
actualizó `cypress/e2e/stubs.ts` para eliminar un `eslint-disable` y
reemplazar el parámetro `win: any` por un tipo más seguro. Queda una nota
pendiente para revisar `src/env.d.ts` y retirar su `eslint-disable` una vez
que la override para `.d.ts` esté consolidada.

**Regla en `copilot-instructions.md`:**

```markdown
- **Types:** Avoid `any` type; always define custom types or interfaces
```

Esto asegura que Copilot tampoco genere código con `any`.

## Configuración actual de ESLint

```javascript
// eslint.config.js (flat config, ESLint 9)

// Plugins activos:
// - eslint-plugin-astro        → reglas para .astro
// - @typescript-eslint         → reglas para .ts
// - eslint-plugin-import       → resolución de imports
// - eslint-plugin-jsx-a11y     → accesibilidad en JSX/Astro

// Reglas clave:
{
  '@typescript-eslint/no-explicit-any': 'error',
  'no-warning-comments': ['warn', { terms: ['ts-ignore'], location: 'anywhere' }],
  '@typescript-eslint/no-unused-vars': ['error', {
    varsIgnorePattern: '^_',
    argsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_'
  }],
  'import/no-unresolved': 'error',
  'import/no-extraneous-dependencies': ['error', {
    devDependencies: ['cypress/**', 'tests/**', '**/*.spec.*',
                      'playwright.config.ts', 'vitest.config.ts']
  }],
  'indent': ['error', 2, { SwitchCase: 1 }]
}
```

### Lo que falta estructurar

La configuración actual tiene reglas funcionales pero hay áreas pendientes
de organizar (se excluyen decisiones de estilo, que se documentan en
`ADR 012`):

| Área | Estado | Nota |
| --- | --- | --- |
| `no-explicit-any` | ✅ Activa (`error`) | Elevada a `error`; monitorizar en CI y tests |
| `no-unused-vars` | ✅ Activa (`error`) | Con ignore para `_` prefixed |
| `import/no-unresolved` | ✅ Activa | Con módulos core de Astro configurados |

---

## Diagrama del estado actual

```text
┌──────────────────────────────────────────────────────────┐
│ ESLint (flat config, v9)                                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ @typescript- │  │ eslint-      │  │ eslint-plugin- │  │
│  │ eslint       │  │ plugin-      │  │ jsx-a11y       │  │
│  │              │  │ import       │  │                │  │
│  │ • no-any ⚠️  │  │ • unresolved │  │ • alt-text     │  │
│  │ • no-unused  │  │ • extraneous │  │ • anchor       │  │
│  │   vars ❌    │  │              │  │                │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
│                                                          │
│  ┌─────────────┐                                         │
│  │ eslint-     │                                         │
│  │ plugin-astro│  Reglas de estilo: ❓ pendientes        │
│  │ (recommend) │  Prettier: ❓ en evaluación             │
│  └─────────────┘  @stylistic: ❓ en evaluación           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```
