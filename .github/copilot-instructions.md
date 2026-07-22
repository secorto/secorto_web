# Copilot — Instrucciones Breves

**PUNTO DE ENTRADA:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — principios y navegación a toda la documentación

**Flujo de desarrollo visual:** [docs/architecture/DEVELOPMENT_WORKFLOW.md](../docs/architecture/DEVELOPMENT_WORKFLOW.md) — cómo Quality by Design se valida en cada paso.

**¿Necesitas hacer algo específico?** Los documentos se auto-referencian. Ej: en [TESTING_STRATEGY.md](../docs/architecture/TESTING_STRATEGY.md) encontrarás links a PAGE_OBJECTS.md y ADRs relevantes. En [CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md) referencias a testing y contenido.

## Stack & Convenciones

- Proyecto: TypeScript + Astro
- Tests: Vitest (unit) y Playwright (E2E)
- Estilo: sin punto y coma salvo necesario

## Workflow Pre-PR

1. Asegura que el código sigue [docs/CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md)
2. Ejecuta: `npm run lint` (typescript, eslint, markdownlint)
3. Ejecuta: `npm run test:unit` (cobertura 100% en código nuevo)
4. Ejecuta: `npm run test:e2e` (validar flujos de usuario)
5. Asegura que todo cumple [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)

## Errores comunes — Lee esto primero

Antes de abrir PR, revisa [docs/COMMON_AI_MISTAKES.md](../docs/COMMON_AI_MISTAKES.md).
Documenta patrones reales de errores que evitar (cualquier `any`, referencias rotas, Markdown malformateado, etc.).

## Cuando escribas ADRs

- Lee [docs/adr/010-plantilla-estandar-adr.md](../docs/adr/010-plantilla-estandar-adr.md) para estructura obligatoria
- **Mantén la decisión agnóstica a implementación concreta:**
  - Usa conceptos abstractos (no nombres de clases: p.ej. "especialización por responsabilidad", no "ContentListPage")
  - Referencias a detalles concretos van en archivos de arquitectura (docs/architecture/), no en el ADR
  - Así el ADR sigue siendo válido cuando refactoriza la implementación
- Incluye: Contexto (abstracto), Decisión (patrón abstracto), Motivación, Alternativas, Consecuencias, Referencias
