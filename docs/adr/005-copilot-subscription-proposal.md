# ADR 005: Evaluación de suscripción a GitHub Copilot

> **Estado:** Propuesta
> **Fecha:** 2026-01
> **Categoría:** Herramientas / Productividad / Ética

---

## Contexto

El desarrollo de `secorto_web` se aceleró notablemente en el último mes,
con la ayuda de asistentes IA (Copilot y similares). La pregunta ahora es si
contratar GitHub Copilot (suscripción pagada) compensa para trabajo personal
y/o profesional.

Las áreas donde Copilot aportó valor en este repo:

- Generación de tests iniciales y plantillas (Vitest, Playwright)
- Refactorings de tipos (sugerencias para interfaces y genéricos)
- Redacción de documentos (ADR, migración, guides)
- Aceleración de tareas repetitivas (boilerplate, imports)

---

## Alternativas

- **A. Suscribirse a Copilot (individual/empresa)**
- **B. Seguir usando la versión gratuita / trial (si aplica)**
- **C. Usar alternativas de código abierto o gratuitas (Tabnine OSS, local LLMs)**
- **D. No pagar: seguir con Copilot en modo limitado/experimentos**

---

## Criterios de decisión

- **Productividad / ROI:** horas ahorradas en tareas repetitivas vs coste mensual
- **Privacidad / seguridad:** telemetría, envío de snippets, código propietario
- **Integración con flujo de trabajo:** GitHub, VSCode, CLI
- **Soporte y features:** context window, multi-file suggestions, tests
- **Costo:** individual vs plan de equipo

---

## Pros y contras

### A. Suscribirse a Copilot
- Pros:
  - Aumento de productividad (ej.: épica de unit tests completada más rápido)
  - Integración nativa en VSCode/GitHub
  - Suggestions más precisas que alternativas gratuitas
- Contras:
  - Coste recurrente (individual ≈ precio de mercado, equipo mayor)
  - Consideraciones de privacidad si el código es sensible
  - Dependencia de un servicio externo

### C. Alternativas (local/OSS)
- Pros:
  - Control total sobre datos si se usa un modelo local
  - Sin coste recurrente (si se gestiona internamente)
- Contras:
  - Setup y mantenimiento (infra -> coste oculto)
  - Calidad de suggestions variable

---

## Estimación básica de ROI (ejemplo)

- Suposición: Copilot ahorra 1–2 horas por semana en tareas repetitivas/boilerplate
- Coste Copilot (ej. $10/mes) → 4 semanas × 1.5 h = 6 h/mes ahorradas
- Precio por hora relevante (tu tiempo): si valoras tu tiempo en > $2/h, Copilot se paga solo

> Nota: estos números son ilustrativos — ajustar según tu valoración personal.

---

## Riesgos y mitigaciones

- **Riesgo:** Copilot sugiere código inseguro o con licencias no conformes
  - Mitigación: habilitar revisión humana obligatoria, linters y scanner de licencias
- **Riesgo:** fuga de snippets sensibles
  - Mitigación: no incluir secretos en el workspace, usar .gitignore para archivos locales

### Nota sobre repositorios públicos y Copilot Code Review

- Este repositorio es público: las sugerencias de Copilot están entrenadas
  con código público y, si se habilita, la funcionalidad de "Copilot Code
  Review" puede analizar PRs y proponer cambios automáticamente. Antes de
  habilitar cualquier bot automatizado en repositorios públicos, evaluar:
  - Si quieres recibir sugerencias automáticas en cada PR (ruido vs ayuda)
  - Políticas de revisión: las sugerencias deben ser revisadas por humanos
  - Privacidad: en repositorios públicos no hay riesgo de enviar código
    privado, pero sí conviene evitar exponer secretos en commits

---

## Recomendación (propuesta)

1. Empezar con **suscripción individual por 1–2 meses** y medir impacto:
   - Trazar métricas de productividad (horas estimadas ahorradas) y calidad
   - Evaluar si la suscripción mejora significativamente el ritmo de entrega
2. Si se opta por continuar, documentar políticas de uso (qué no se debe
   compartir con Copilot) y mantener revisión de código obligatoria
3. Considerar alternativas locales si la privacidad es crítica

---

## Acciones propuestas

- [ ] Probar suscripción Copilot por 30 días
- [ ] Medir 4–8 semanas de productividad y compararlas con la línea base
- [ ] Documentar política de uso y privacidad
- [ ] Revisar la decisión en 2 meses y marcar ADR como **Aceptada** o **Rechazada**
 - [ ] Evaluar habilitar `Copilot Code Review` en modo opt-in y documentar la
   política de revisión para sugerencias automáticas

---

## Referencias

- GitHub Copilot docs
- Comparativa de asistentes: Copilot vs Tabnine vs local LLMs
- ADRs previos: ADR 004 (linting), ADR 002 (testing migration)
