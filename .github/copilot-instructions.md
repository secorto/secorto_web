# Copilot — Instrucciones Breves

**PUNTO DE ENTRADA:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — principios y navegación a toda la documentación

**Flujo de desarrollo visual:**
[docs/architecture/DEVELOPMENT_WORKFLOW.md](../docs/architecture/DEVELOPMENT_WORKFLOW.md) —
cómo Quality by Design se valida en cada paso.

**¿Necesitas hacer algo específico?**
Los documentos se auto-referencian. Ej: en
[TESTING_STRATEGY.md](../docs/architecture/TESTING_STRATEGY.md) encontrarás links a
PAGE_OBJECTS.md y ADRs relevantes. En [CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md)
referencias a testing y contenido.

## Stack & Convenciones

- Proyecto: TypeScript + Astro
- Tests: Vitest (unit) y Playwright (E2E)
- Estilo: sin punto y coma salvo necesario

## Workflow Pre-PR

**Ver checklist completo:** [docs/architecture/DEVELOPMENT_WORKFLOW.md](../docs/architecture/DEVELOPMENT_WORKFLOW.md#-checklist-antes-de-pr)

En resumen, antes de proponer PR:

1. Asegura que el código sigue [docs/CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md)
2. Asegura que todo cumple [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
3. Ejecuta el pipeline de validación (comandos en DEVELOPMENT_WORKFLOW.md)
4. Si IA generó código, revisa [docs/COMMON_AI_MISTAKES.md](../docs/COMMON_AI_MISTAKES.md) para evitar antipatrones

## Errores comunes — Lee esto primero

Antes de abrir PR, revisa [docs/COMMON_AI_MISTAKES.md](../docs/COMMON_AI_MISTAKES.md).
Documenta patrones reales de errores que evitar (cualquier `any`, referencias rotas, Markdown malformateado, etc.).

## Cuando escribas ADRs

- Usa [docs/adr/TEMPLATE.md](../docs/adr/TEMPLATE.md) como plantilla canónica
- **Mantén la decisión agnóstica a implementación concreta:**
  - Usa conceptos abstractos (no nombres de clases: p.ej. "especialización por responsabilidad", no "ContentListPage")
  - Referencias a detalles concretos van en archivos de arquitectura (docs/architecture/) o anexos técnicos, no en el ADR
  - Así el ADR sigue siendo válido cuando refactoriza la implementación
- Requiere frontmatter YAML con metadatos mínimos: `id`, `title`, `status`, `date`, `last_updated`, `categories`
- Estructura recomendada: Contexto, Objetivo, Decisión, Motivación, Implementación, Consecuencias, Referencias, Anexos
- En Consecuencias usa un único formato: Positivas, A considerar, Contras (Trade-offs), Alternativas Rechazadas
