# ADR 004: Linting, tipo `any` y convenciones de estilo

> **Estado:** Aceptada (parcialmente — la sección de formateo está en evaluación)
> **Fecha:** 2026-02-15
> **Categoría:** Tooling / Calidad de código / Estilo

---

## Contexto

A medida que el proyecto creció y se hicieron múltiples refactorings para
alcanzar 100 % de cobertura unitaria, se detectaron problemas recurrentes de
calidad de código:

1. **Uso extendido de `any`:** muchas funciones y variables usaban `any`,
   lo que anulaba las ventajas de TypeScript. Los errores de tipo solo se
   descubrían en runtime o en tests E2E lentos, no en tiempo de compilación.
2. **Falta de linter configurado:** no había un ESLint estructurado; cada
   archivo seguía convenciones diferentes.
3. **Inconsistencia en estilo:** algunos archivos usaban `;`, otros no;
   la indentación variaba entre archivos.
4. **Código generado por herramientas con estilo diferente:** Playwright
   codegen genera código con `;` (semicolons), pero la convención del
   proyecto es omitirlos.

### Perfil del desarrollador

El mantenedor principal viene de **Python**, donde:

- No existen los `;` al final de sentencia
- La legibilidad sin ruido sintáctico es un valor
- El formateo lo resuelve una sola herramienta (`black` / `ruff format`)

En el entorno laboral se usa `;` por convención de equipo. En este proyecto
personal, la preferencia es **omitir semicolons** para mantener el código
más limpio y cercano al estilo natural del autor.

---

## Decisiones tomadas

### 1. Prohibir `any` — `@typescript-eslint/no-explicit-any: error`

Se elevó la regla `@typescript-eslint/no-explicit-any` a `error` para evitar
introducir nuevos `any` en el código fuente. El cambio ya está aplicado en
la configuración de ESLint; la idea es que el código del repositorio no
contenga nuevos `any` y que cualquier excepción sea explícita y justificada.

**Refactoring realizado / cambios inmediatos:**

Se reemplazaron muchos `any` del código fuente con tipos explícitos:

| Patrón eliminado | Reemplazo |
|---|---|
| `any` en parámetros | Interfaces dedicadas (`PageData`, `EntryWithSlug`, etc.) |
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

### 2. Omitir semicolons — convención sin enforcement automático

**Decisión:** omitir `;` al final de sentencias en todo el código del
proyecto.

**Estado actual:** la convención está documentada en `copilot-instructions.md`
pero **no está enforceada por ESLint ni por un formateador automático**. Esto
es intencional mientras se evalúan las opciones (ver sección de formateo
abajo).

**Excepción conocida:** el código generado por `npx playwright codegen`
incluye `;` automáticamente. El flujo de trabajo esperado es:

1. Generar código con `playwright codegen`
2. Copiar al test
3. Eliminar `;` manualmente o con un futuro autofix

### 3. Indentación a 2 espacios — enforceada

```javascript
'indent': ['error', 2, { SwitchCase: 1 }]
```

Esta regla sí está enforceada a nivel `error` y se aplica con `--fix`.

---

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
de organizar:

| Área | Estado | Nota |
|---|---|---|
| `no-explicit-any` | ✅ Activa (`error`) | Elevada a `error`; monitorizar en CI y tests |
| `no-unused-vars` | ✅ Activa (`error`) | Con ignore para `_` prefixed |
| `import/no-unresolved` | ✅ Activa | Con módulos core de Astro configurados |
| `indent` | ✅ Activa (2 espacios) | Enforceada |
| Semicolons | ❌ Sin regla | Convención manual; pendiente de evaluación |
| Trailing commas | ❌ Sin regla | Pendiente |
| Quotes (single/double) | ❌ Sin regla | Pendiente |
| Max line length | ❌ Sin regla | Pendiente |
| Reglas para `.astro` frontmatter | ⚠️ Parcial | Solo `jsx-a11y`, no estilo |

---

## Decisión pendiente: formateo automático

### Opciones en evaluación

#### A. Prettier

- ✅ Estándar de facto en proyectos JS/TS
- ✅ Opinionado: pocas decisiones que tomar
- ✅ Integración con ESLint vía `eslint-config-prettier`
- ❌ Requiere `eslint-config-prettier` para desactivar reglas conflictivas
- ❌ Otro binario más en el toolchain
- ❌ Formato de `.astro` tiene soporte limitado (plugin `prettier-plugin-astro`)

#### B. ESLint Stylistic (`@stylistic/eslint-plugin`)

- ✅ Un solo tool (ESLint) para lint + formato
- ✅ Reglas granulares: se puede activar solo `semi`, `quotes`, etc.
- ✅ No necesita un segundo tool ni config de desactivación
- ❌ Más reglas que configurar manualmente
- ❌ Menos adoption que Prettier en la comunidad

#### C. Mantener convención manual (status quo)

- ✅ Sin overhead de configuración
- ✅ Copilot respeta las instrucciones de `copilot-instructions.md`
- ❌ No previene inconsistencias en contribuciones manuales
- ❌ `playwright codegen` genera código con estilo diferente

### Estado

**En pausa.** No se ha tomado una decisión final sobre formateo automático.
Los tradeoffs se evaluarán cuando:

- Se complete la eliminación de Cypress (simplifica el scope de configs)
- Se tenga claro si se quiere Prettier o solo ESLint Stylistic
- Se definan las reglas exactas de estilo

Por ahora, la convención se mantiene vía `copilot-instructions.md` y
revisión manual.

---

## Diagrama del estado actual

```
┌──────────────────────────────────────────────────────────┐
│ ESLint (flat config, v9)                                 │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ @typescript- │  │ eslint-      │  │ eslint-plugin- │  │
│  │ eslint       │  │ plugin-      │  │ jsx-a11y       │  │
│  │              │  │ import       │  │                │  │
│  │ • no-any ⚠️  │  │ • unresolved │  │ • alt-text     │  │
│  │ • no-unused  │  │ • extraneous │  │ • anchor       │  │
│  │   vars ❌    │  │              │  │                │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
│                                                          │
│  ┌─────────────┐                                         │
│  │ eslint-     │                                         │
│  │ plugin-astro│  Reglas de estilo: ❓ pendientes        │
│  │ (recommend) │  Prettier: ❓ en evaluación             │
│  └─────────────┘  @stylistic: ❓ en evaluación           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Consecuencias

### Positivas

- **Cero `any` en producción:** TypeScript detecta errores en compilación
  que antes solo aparecían en runtime.
- **Imports validados:** `import/no-unresolved` previene imports rotos,
  especialmente con los alias de Astro (`@config/*`, `@utils/*`).
- **Accesibilidad validada:** `jsx-a11y` detecta problemas de accesibilidad
  en componentes `.astro`.
- **Copilot alineado:** las instrucciones en `.github/copilot-instructions.md`
  mantienen el código generado por IA consistente con las convenciones.

### Deuda técnica conocida

- Semicolons: convención manual sin enforcement automático. El código
  generado por `playwright codegen` necesita limpieza manual.
- Reglas de estilo (quotes, trailing commas, etc.) sin definir.
- Decisión Prettier vs Stylistic pendiente.
 - `no-explicit-any` ahora es `error`; revisar fallos en CI y agregar
   excepciones justificadas si aparecen casos legítimos.
- Configuración de ESLint podría consolidarse mejor (algunas reglas
  sueltas).

---

## Acciones futuras (cuando se retome)

1. [ ] Decidir entre Prettier y ESLint Stylistic
2. [ ] Definir regla de semicolons (`semi: ['error', 'never']` o vía Prettier)
3. [ ] Definir regla de quotes (`quotes: ['error', 'single']` o similar)
4. [ ] Verificar CI y/o agregar excepciones justificadas para `no-explicit-any`
5. [ ] Revisar y eliminar `eslint-disable` restantes (ej. `src/env.d.ts`) y
  confirmar que las overrides en ESLint para `.d.ts` permiten quitar
  la mayoría de disables inline
6. [ ] Evaluar si agregar `@stylistic/eslint-plugin` o `prettier` a CI
7. [ ] Documentar la resolución final en este ADR (cambiar estado a **Aceptada**)

---

## Referencias

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [typescript-eslint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
- [ESLint Stylistic](https://eslint.style/)
- [Prettier vs ESLint](https://prettier.io/docs/en/comparison.html)
- [copilot-instructions.md](../../.github/copilot-instructions.md)
