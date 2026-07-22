---
title: ADR 005: Integración de asistentes IA en el proceso de desarrollo
status: accepted
date: 2026-01
last_updated: 2026-07
categories:
  - Architecture
  - Development Process
  - Quality Assurance
---

## Contexto

Durante la fase de evaluación se validó que asistentes IA (Copilot y similares) aceleran el desarrollo en áreas clave:

- Generación de tests iniciales y plantillas (Vitest, Playwright)
- Refactorings de tipos (sugerencias para interfaces y genéricos)
- Redacción de documentos (ADR, migración, guides)
- Aceleración de tareas repetitivas (boilerplate, imports)

El proyecto ahora necesita **sistematizar cómo se integran asistentes IA** como parte del flujo de desarrollo. Esto implica:

- Definir guardrails y antipatrones documentados
- Establecer validaciones explícitas en cada fase (QbD)
- Clarificar principios de uso para contribuidores
- Asegurar que sugerencias de IA se alineen con arquitectura

---

## Decisión

Adoptar asistentes IA como herramientas integradas en el flujo de desarrollo, siguiendo principios de **Quality by Design**:

1. **IA como acelerador validado:** usarla en tareas donde agregue valor demostrado
2. **Guardrails explícitos:** documentar antipatrones, riesgos de seguridad, y validaciones necesarias
3. **Arquitectura agnóstica:** decisiones de arquitectura **no dependen de IA**; IA las acelera
4. **Review obligatorio:** sugerencias de IA siempre requieren review humano y validación por linters/tests
5. **Documentación de decisiones:** ADRs y guías de uso integradas en el onboarding

---

## Alternativas

- **A. No integrar IA formalmente:** mantener uso ad-hoc, sin guardrails documentados
- **B. Integrar IA con guardrails explícitos** (decisión elegida)
- **C. Permitir IA sin validación:** confiar en sugerencias sin review adicional

---

## Criterios de decisión

- **Claridad arquitectónica:** ¿se puede explicar sin referencias a IA?
- **Calidad garantizada:** ¿hay validaciones en cada fase (tests, linting, ADRs)?
- **Documentación:** ¿está clara la política de uso para nuevos contribuidores?
- **Seguridad:** ¿se evitan riesgos (injección de secretos, código no seguro)?
- **Reproducibilidad:** ¿los resultados no dependen de cambios en IA?

---

## Pros y contras

### B. Integrar IA con guardrails explícitos (decisión elegida)

**Pros:**

- Acelera tareas validadas sin sacrificar calidad
- Documentación de antipatrones beneficia a todo el equipo
- Claridad para contribuidores sobre qué es y qué no es "desarrollo IA-first"
- IA como herramienta, no como decisor arquitectónico

**Contras:**

- Requiere documentación adicional y mantenimiento
- Review de código más riguroso
- Riesgo de confianza excesiva si no se comunican bien los guardrails

### A. No integrar IA formalmente

**Pros:**

- Evita complejidad adicional en onboarding
- Todos sabemos que el código viene de humanos

**Contras:**

- Uso ad-hoc y inconsistente
- Antipatrones repetidos entre contribuidores
- Se pierde valor demostrado en tests y documentación
- Difícil auditar qué fue generado por IA vs manual

### C. Permitir IA sin validación

**Pros:**

- Máxima velocidad en tareas repetitivas
- Sin overhead de review

**Contras:**

- Riesgo alto de código inseguro, con licencias no conformes, o que no cumple ADRs
- Imposible revertir si IA "alucina" algo arquitectónico
- Violación de Quality by Design

---

## Motivación

La evaluación inicial validó que IA acelera tareas específicas. Sin embargo, **sin guardrails documentados**:

- Cada contribuidor termina usando IA de forma distinta
- No hay referencias claras sobre qué es y qué no es "IA-first"
- Antipatrones se repiten (por ejemplo: `any` types, sugerencias no testeadas)
- Difícil explicar a nuevos contribuidores la política de uso

Con esta decisión:

- Se formaliza que IA es parte del flujo, pero **subordinada a Quality by Design**
- Se documentan antipatrones ([COMMON_AI_MISTAKES.md](../COMMON_AI_MISTAKES.md)) para evitarlos
- Se clarifica en [copilot-instructions.md](../../.github/copilot-instructions.md) qué esperar de IA
- Se integra en [DEVELOPMENT_WORKFLOW.md](../architecture/DEVELOPMENT_WORKFLOW.md) los puntos de validación

---

## Riesgos y mitigaciones

### Riesgo: IA sugiere código que viola ADRs

- **Mitigación:** Enfatizar ADRs clave en
  [copilot-instructions.md](../../.github/copilot-instructions.md). Validar con
  linters y tests (Quality by Design).

### Riesgo: Contribuidores confían excesivamente en sugerencias

- **Mitigación:** Documentar errores frecuentes en
  [COMMON_AI_MISTAKES.md](../COMMON_AI_MISTAKES.md). Requerir review humano
  obligatorio.

### Riesgo: Código generado por IA con licencias no conformes

- **Mitigación:** Mantener escaneo de dependencias (`npm audit`). Incluir contexto sobre FOSS licenses en copilot-instructions.

### Riesgo: Secretos filtrados a proveedores de IA

- **Mitigación:** Documentar políticas en [CONTENT_POLICY.md](../CONTENT_POLICY.md).
  No incluir `.env` en workspace de IA. Usar `.gitignore` para archivos locales.

### Riesgo: IA genera documentación incompleta o inconsistente

- **Mitigación:** Revisar ADRs según [plantilla estándar](./010-plantilla-estandar-adr.md). Validar Markdown con linters.

---

## Consecuencias

**Positivas:**

- Consistencia en cómo se usa IA entre contribuidores
- Documentación clara reduce fricción en onboarding
- Quality by Design se fortalece con validaciones explícitas
- Trazabilidad de decisiones (ADRs documenten si IA fue factor)

**Negativas:**

- Requiere mantenimiento activo de copilot-instructions y COMMON_AI_MISTAKES
- Review de código puede ser más riguroso (tiempo adicional)
- Educación de contribuidores sobre política de IA

---

## Acciones propuestas

- [x] Documentar guardrails en [copilot-instructions.md](../../.github/copilot-instructions.md)
- [x] Crear [COMMON_AI_MISTAKES.md](../COMMON_AI_MISTAKES.md) con antipatrones
- [x] Integrar IA en [DEVELOPMENT_WORKFLOW.md](./architecture/DEVELOPMENT_WORKFLOW.md)
- [ ] Actualizar onboarding con política de IA
- [ ] Revisar este ADR en 3 meses; ajustar guardrails según aprendizajes
- [ ] Si se adoptan herramientas de IA nuevas, referenciar este ADR en decisiones

---

## Referencias

- [COMMON_AI_MISTAKES.md](../COMMON_AI_MISTAKES.md) — antipatrones documentados
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) — guías de uso integradas
- [DEVELOPMENT_WORKFLOW.md](../architecture/DEVELOPMENT_WORKFLOW.md) — QbD con validaciones explícitas
- [ARCHITECTURE.md](../ARCHITECTURE.md) — principios del proyecto
- [CONTRIBUTING.md](../CONTRIBUTING.md) — guía para contribuidores
- ADR 004 — linting y validación automática
- ADR 002 — testing framework migration
