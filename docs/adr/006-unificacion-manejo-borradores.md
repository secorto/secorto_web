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

## Implementación (observaciones)

Cambios aplicados durante la implementación para reducir la complejidad
accidental y asegurar comportamiento consistente:

- `src/content.config.ts`: el schema base ya expone `draft?: boolean`, lo
  que permite que todas las colecciones acepten el campo sin cambios
  manuales en cada post.
- `src/utils/paths.ts`: se actualizó el filtrado para excluir entradas con
  `data.draft === true`. Se eliminaron casts inseguros y se usan comprobaciones
  en tiempo de ejecución sobre `Record<string, unknown>` para evitar `any`.
- `src/utils/translationMetadata.ts`: la función `getCanonicalMetadata` se
  simplificó para depender únicamente de `entryDraft` (campo explícito).
  Se eliminaron inferencias automáticas sobre `translation_status` en el
  flujo principal (la metadata histórica puede permanecer en archivos).
- `src/pages/[locale]/[section]/[...id].astro`: la plantilla de detalle ahora
  muestra el aviso de borrador únicamente cuando `entryData.draft` es true;
  se eliminó la lógica condicional que intentaba inferir borradores desde
  estados de traducción.
- Tipado: se añadió `draft?: boolean` en el tipo local `BaseEntryData` para
  evitar casteos y reflejar el campo en las páginas que renderizan entradas.
- Tests: las pruebas unitarias se adaptaron para usar `entryDraft` como
  fuente de verdad y se eliminó la dependencia en el helper de compatibilidad
  (o se reescribieron para cubrir la nueva interfaz). La suite local pasa
  completamente tras los cambios.

Notas importantes:
- Se priorizó eliminar compatibilidad retro en el runtime para evitar
  lógica dispersa y ambigua. Si se necesita, se puede crear un script de
  migración que proponga `draft: true` en archivos con
  `translation_status: 'draft'` (modo preview recomendado antes de aplicar).
- Eliminamos `any` y casts inseguros en puntos críticos (`paths.ts`,
  plantillas) para mejorar la seguridad de tipos y la mantenibilidad.
- Resultado: comportamiento determinista — solo `draft: true` controla la
  visibilidad y SEO (noindex/canonical) en la web.


---

Decisión tomada por: autor del repositorio (Sergio Orozco) tras revisión del
historial y necesidad de reducir complejidad accidental.
