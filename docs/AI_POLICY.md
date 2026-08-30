# Política de uso de asistentes IA en el desarrollo

## 1. Propósito

Establecer reglas claras, reproducibles y auditables para el uso de asistentes IA (Copilot y similares)
dentro del proyecto **secorto**, garantizando calidad, seguridad y alineación arquitectónica.

## 2. Alcance

Esta política aplica a:

- Contribuidores internos y externos.
- Código, documentación, tests y refactorings.
- Uso de IA en PRs, ADRs y contenido del sitio.

## 3. Principios

- **IA acelera, no decide**: las decisiones arquitectónicas se documentan en ADRs y no dependen de IA.
- **Quality by Design**: toda sugerencia de IA debe pasar por validaciones automáticas y revisión humana.
- **Reproducibilidad**: el resultado final no debe depender de variaciones del modelo de IA.
- **Seguridad**: nunca enviar secretos, tokens, `.env` ni datos sensibles a asistentes IA.
- **Trazabilidad**: PRs deben indicar cuándo IA fue usada en partes sustanciales.

## 4. Usos permitidos

- Generación de tests iniciales (Vitest, Playwright).
- Refactorings de tipos y sugerencias de interfaces.
- Redacción de documentación (ADRs, guías, migraciones).
- Aceleración de boilerplate y tareas repetitivas.
- Exploración de alternativas arquitectónicas (siempre validadas por humanos).

## 5. Usos prohibidos

- Generar código sin revisión humana.
- Aceptar sugerencias que violen ADRs.
- Introducir dependencias sin validar licencias.
- Generar contenido sin pasar linters.
- Enviar secretos o datos sensibles.
- Aceptar sugerencias que introduzcan `any`, tipos inseguros o estructuras no validadas.

## 6. Guardrails obligatorios

- Todo código generado por IA debe pasar:
  - `eslint`
  - `tsc`
  - `markdownlint`
  - Tests relevantes
- PRs deben indicar explícitamente si IA generó partes sustanciales.
- Revisores deben validar:
  - Alineación con ADRs.
  - Ausencia de antipatrones (ver `COMMON_AI_MISTAKES.md`).
  - Consistencia con arquitectura modular del proyecto.

## 7. Riesgos y mitigaciones

- **Violación de ADRs** → Validación manual + linters.
- **Confianza excesiva** → Documentar antipatrones + revisión obligatoria.
- **Licencias no conformes** → Validar dependencias con `npm audit`.
- **Filtración de secretos** → Nunca incluir `.env` en workspace de IA.
- **Documentación inconsistente** → Validar con plantilla estándar de ADR.

## 8. Checklist para contribuidores

Antes de enviar un PR:

- ¿La IA generó parte del código? → Indicarlo.
- ¿Cumple ADRs?
- ¿Cumple linters?
- ¿Cumple tests?
- ¿Evita antipatrones?
- ¿No incluye secretos?
- ¿Documentaste decisiones relevantes?

## 9. Documentos relacionados

- [ADR‑005](./adr/005-ia-development-integration.md) — Integración de IA en el flujo de desarrollo.
- [COMMON_AI_MISTAKES.md](./COMMON_AI_MISTAKES.md).
- [.github/copilot-instructions.md](../.github/copilot-instructions.md).
- [DEVELOPMENT_WORKFLOW.md](./architecture/DEVELOPMENT_WORKFLOW.md).
- [ARCHITECTURE.md](./ARCHITECTURE.md).
- [CONTRIBUTING.md](./CONTRIBUTING.md).
