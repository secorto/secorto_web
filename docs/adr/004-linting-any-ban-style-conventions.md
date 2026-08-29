---
id: ADR-004
title: Linting, análisis estático y reglas de calidad de código
status: superseded
date: 2026-02-15
categories:
  - Tooling
  - Code Quality
  - Static Analysis
---

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

### Consideraciones

- Algunas reglas requieren excepciones justificadas (por ejemplo, en `.d.ts`).
- La configuración puede evolucionar conforme cambien las necesidades del proyecto.
- Las reglas de estilo no se incluyen aquí; se gestionan en ADR 012.

## Acciones futuras

- Revisar excepciones de `no-explicit-any` y eliminar `eslint-disable` innecesarios.
- Consolidar overrides para archivos `.d.ts`.
- Mantener este ADR como referencia histórica; las decisiones activas se trasladan a ADR 013.

## Referencias

- [ADR-012](012-formatting.md) Formateo
- [ADR-013](013-lint-rule-changes.md) Actualización eslint
