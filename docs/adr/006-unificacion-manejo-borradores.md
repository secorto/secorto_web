# ADR 006: Unificación del manejo de borradores (`draft`)

> **Estado:** Aceptada
> **Fecha:** 2026-02-13
> **Categoría:** Contenido / i18n / Tooling

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
borradores. Cambios concretos:

- El esquema de contenido (`src/content.config.ts`) incluirá `draft?: boolean`.
- Las funciones que generan listados y paths (`src/utils/paths.ts`) solo
  filtrarán por `data.draft === true` para excluir borradores.
- La lógica de canonical/noindex y avisos se basará en `draft` (p. ej.
  `getCanonicalMetadata` recibirá `entryDraft` explícito).
- `translation_status` podrá permanecer como metadata histórica/auxiliar,
  pero ya no se usará para inferir el estado de borrador.

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
  visibilidad y SEO (noindex/canonical).
- Proceso de migración sencillo: transformar `translation_status: 'draft'`
  a `draft: true` en los casos necesarios.

### Negativas / Trade-offs

- Requiere convertir algunos archivos antiguos si existieran valores de
  `translation_status` relevantes (script de migración recomendado).
- `translation_status` permanece en los archivos como metadata potencialmente
  obsoleta; conviene limpiar a futuro.

---

## Plan de migración

1. Actualizar el schema (`src/content.config.ts`) para aceptar `draft?: boolean`.
2. Actualizar utilidades y plantillas para usar `draft` (ya aplicado en el
   código base actual).
3. Ejecutar un script que identifique archivos con `translation_status: 'draft'`
   y proponga (o aplique con turno manual) `draft: true`.
4. Actualizar la documentación (`docs/TRANSLATION_WORKFLOW.md`) para reflejar
   la nueva convención.

---

## Referencias

- `src/content.config.ts` — campo `draft` añadido al schema base
- `src/utils/paths.ts` — filtrado por `draft`
- `src/utils/translationMetadata.ts` — `getCanonicalMetadata(entryDraft: boolean)`
- `docs/TRANSLATION_WORKFLOW.md` — guía actualizada


---

Decisión tomada por: autor del repositorio (Sergio Orozco) tras revisión del
historial y necesidad de reducir complejidad accidental.
