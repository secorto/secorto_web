---
title: ADR 006 - Unificación del manejo de borradores (`draft`)
status: accepted
date: 2026-02-13
last_updated: null
categories:
  - Content
  - i18n
  - Tooling
---

## Contexto

El repositorio implica contenido multilingüe organizado por carpetas
(`src/content/<collection>/<locale>/`) y metadatos en frontmatter. Históricamente
se usó el campo `translation_status` para marcar traducciones en curso
(`draft`, `partial`, `translated`, etc.). Esto generó complejidad accidental:

- Doble fuente de verdad (`translation_status` vs. `draft`) con reglas
  distintas en plantillas y scripts.
- Necesidad de inferir estado de borrador desde `translation_status`, lo que
  introducía lógica dispersa y condiciones especiales en `paths`, `translationMetadata` y vistas.
- Riesgo de inconsistencia entre archivos antiguos y comportamiento de la web.

Mientras tanto, `draft: true` (booleano) resulta una convención simple y
clara para indicar que un archivo no debe aparecer en listados ni indexarse.

---

## Decisión

Adoptar un único campo explícito en frontmatter: `draft: true` para indicar
borradores. Cambios conceptuales:

- Esquema de contenido acepta `draft?: boolean` como campo opcional.
- Utilidades que generan listados y paths filtran por `draft === true`
  para excluir borradores.
- Lógica de visibilidad (canonical, noindex, avisos) se basa en `draft`,
  no en inferencias desde metadata histórica.
- `translation_status` puede permanecer como metadata auxiliar, pero **no**
  se usa para inferir estado de borrador.

---

## Alternativas consideradas

- Mantener `translation_status` como fuente de verdad: rechazado por
  complejidad y riesgo de inconsistencias.
- Usar ambos campos y priorizar uno sobre otro: añade ambigüedad y reglas
  de resolución que complican templates y scripts.
- No usar ningún campo explícito y determinar borradores por existencia de
  un sufijo o carpeta especial: menos conveniente para editores externos.

---

## Consecuencias

### Positivas

- Simplicidad y claridad en frontmatter (`draft: true` es explícito e
  evidente).
- Menos lógica dispersa en templates y utilidades; más fácil razonar sobre
  visibilidad y SEO.
- Comportamiento determinista: solo `draft === true` controla visibilidad.

### Negativas / Trade-offs

- Requiere migrar archivos si existieran valores de `translation_status`
  relevantes.
- `translation_status` puede permanecer como metadata obsoleta en algunos
  archivos.

---

## Referencias y detalles de implementación

Para detalles técnicos, plan de migración paso a paso, cambios en archivos
específicos y notas de implementación:
ver [anexos/006-unificacion-manejo-borradores/IMPLEMENTATION_DETAILS.md](./anexos/006-unificacion-manejo-borradores/IMPLEMENTATION_DETAILS.md)
