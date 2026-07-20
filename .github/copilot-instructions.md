# Copilot — Instrucciones Breves

**PUNTO DE ENTRADA:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — principios, navegación a toda la documentación

## Stack & Convenciones

- Proyecto: TypeScript + Astro
- Tests: Vitest (unit) y Playwright (E2E)
- Estilo: sin punto y coma salvo necesario; evitar `any`

## Workflow Pre-PR

1. Asegura que el código sigue [docs/CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md)
2. Ejecuta: `npm run lint` (typescript, eslint, markdownlint)
3. Ejecuta: `npm run test:unit` (cobertura 100% en código nuevo)
4. Ejecuta: `npm run test:e2e` (validar flujos de usuario)
5. Asegura que todo cumple [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)

## Cuando escribas ADRs

- Lee [docs/adr/010-plantilla-estandar-adr.md](../docs/adr/010-plantilla-estandar-adr.md) para estructura obligatoria
- **Mantén la decisión agnóstica a implementación concreta:**
  - Usa conceptos abstractos (no nombres de clases: p.ej. "especialización por responsabilidad", no "ContentListPage")
  - Referencias a detalles concretos van en archivos de arquitectura (docs/architecture/), no en el ADR
  - Así el ADR sigue siendo válido cuando refactoriza la implementación
- Incluye: Contexto (abstracto), Decisión (patrón abstracto), Motivación, Alternativas, Consecuencias, Referencias
