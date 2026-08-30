---
id: ADR-005
title: Integración de asistentes IA en el proceso de desarrollo
status: accepted
date: 2026-01
last_updated: 2026-08
categories:
  - Architecture
  - Development Process
  - Quality Assurance
---

## Contexto

El proyecto validó que asistentes IA (Copilot y similares) aceleran tareas específicas del flujo de desarrollo
(tests iniciales, refactorings de tipos, documentación y boilerplate).
Sin embargo, su uso ad‑hoc generaba inconsistencias y riesgos de calidad.

Se requiere una **decisión arquitectónica estable** sobre cómo se integran estas herramientas,
separada de las políticas operativas que evolucionan con el tiempo.

## Decisión

Integrar asistentes IA como herramientas de apoyo en el desarrollo, bajo los siguientes principios:

- IA **acelera**, pero **no define arquitectura**.
- Toda sugerencia generada por IA requiere **validación humana** y **Quality by Design** (linters, tests, revisión).
- Las reglas operativas, guardrails y antipatrones se documentan fuera del ADR, en:
  **`docs/AI_POLICY.md`**.

## Alternativas consideradas

- Uso ad‑hoc sin integración formal.
- Integración con guardrails explícitos (**elegida**).
- Uso sin validación humana.

## Consecuencias

### Positivas

- Aceleración controlada del desarrollo.
- Consistencia en el uso de IA.
- Riesgos mitigados mediante política externa.

### A considerar

- Requiere mantenimiento de la política.
- Revisión más estricta en PRs.

### Contras (Trade-offs)

- El coste principal es la disciplina de revisión y la necesidad de mantener la política vigente.

## Referencias

- [AI_POLICY.md](../AI_POLICY.md) — política operativa de IA.
- [COMMON_AI_MISTAKES.md](../COMMON_AI_MISTAKES.md)
- [copilot-instructions.md](../../.github/copilot-instructions.md)
- [DEVELOPMENT_WORKFLOW.md](../architecture/DEVELOPMENT_WORKFLOW.md)
