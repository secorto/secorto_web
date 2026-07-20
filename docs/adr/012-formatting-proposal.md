---
title: ADR 012 - Formateo y herramienta de estilo propuesta
status: proposed
date: 2026-05-21
categories:
  - Tooling
  - Style
---

## Contexto

El proyecto ha crecido con inconsistencias en formateo de código (espacios,
comillas, trailing commas, indentación). Esto genera fricción en reviews y
retrasa PRs por cambios estéticos que podrían automatizarse.

**Problema central:** mantener reglas de estilo de forma manual es propenso a
inconsistencias y consume tiempo en reviews que debería enfocarse en lógica.

---

## Opciones evaluadas

- **Usar herramienta de formateo opinionada:** establece reglas
  centralizadas, reduciendo fricción en reviews y automatizando decisiones
  estéticas.
- **Usar linter extensible:** mayor granularidad pero requiere más configuración
  manual para cada regla.
- **Mantener convención manual:** baja fricción inicial, pero propenso a
  inconsistencias y ruido en reviews.

## Decisión

Adoptar una **estrategia centralizada de formateo** que:

1. **Delega decisiones estéticas a una herramienta automatizada** (semicolons,
   comillas, trailing commas, indentación).
2. **Mantiene linter independiente** para reglas semánticas (imports, typing,
   patterns específicos del proyecto).
3. **Establece convenciones claras** documentadas en guías de proyecto.
4. **Automatiza correcciones** en CI y localmente para evitar fricción.

### Características clave de la propuesta

- Formateo opinionado y centralizado.
- Compatibilidad con múltiples lenguajes (TypeScript, Astro, Markdown, etc.).
- Autofix automático en CI y local.
- Configuración mínima para reducir bikeshedding.
- Documentación clara de excepciones (p. ej. código generado).

---

## Convenciones propuestas

### Omisión de semicolons — preferencia del proyecto

Se propone **omitir `;` al final de sentencias** como convención de estilo
del proyecto. Beneficios:

- Reduce "ruido sintáctico" y mejora legibilidad.
- Compatible con convenciones de lenguajes modernos.
- Puede aplicarse automáticamente por la herramienta de formateo elegida.

### Indentación y espaciado

Se propone **indentación consistente** (p. ej. 2 espacios) enforceable en
linter y formateo automático.

---

## Alternativas consideradas

- **Dos herramientas separadas (formateo + linting):** adoptada como la más
  flexible; requiere integración clara.
- **Una sola herramienta (linter con formateo integrado):** más simple pero
  menos granularidad.
- **Convención manual:** rechazado por alto costo en maintenance y reviews.

---

## Consecuencias

### Positivas

- Reducción de ruido en PRs relacionado con formato.
- Consistencia automática en todos los archivos.
- Menor carga cognitiva en reviews (enfoque en lógica, no en estilo).
- Facilita onboarding: nuevos colaboradores heredan estilo automáticamente.

### Consideraciones

- Pequeño incremento en dependencias dev.
- Curva de aprendizaje inicial para desarrolladores acostumbrados a otros
  estilos.
- Necesidad de documentación clara de excepciones.

---

## Plan de implementación

1. Seleccionar y configurar herramientas elegidas.
2. Aplicar formateo automático a toda la codebase.
3. Integrar en CI para validación y autofix.
4. Documentar convenciones en guías del proyecto.
5. Marcar ADR como `accepted` una vez completada la implementación.

## Referencias y detalles operativos

Para configuración específica de herramientas, scripts de CI y ejemplos:
ver documentación de proyecto y archivos de configuración.
