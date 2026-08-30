# Implementación

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

## Ejecución

Cambios aplicados durante la implementación para reducir la complejidad
accidental y asegurar comportamiento consistente:

- `src/content.config.ts`: el schema base ya expone `draft?: boolean`, lo
  que permite que todas las colecciones acepten el campo sin cambios
  manuales en cada post.
- `src/utils/paths.ts`: se actualizó el filtrado para excluir entradas con
  `data.draft === true`. Se eliminaron casts inseguros y se usan comprobaciones
  en tiempo de ejecución sobre `Record<string, unknown>` para evitar `any`.
- `src/domain/post.ts`: los helpers de dominio (por ejemplo `getSeoDescription`)
  y la lógica de SEO/canonical/noindex se concentran aquí o se dejan inline en
  las plantillas. Se simplificó la lógica para depender únicamente de `draft`
  (frontmatter: `entry.data.draft`) y evitar inferencias desde `translation_status`.
  Se eliminaron inferencias automáticas sobre `translation_status` en el
  flujo principal (la metadata histórica puede permanecer en archivos).
- `src/pages/[locale]/[section]/[...id].astro`: la plantilla de detalle ahora
  muestra el aviso de borrador únicamente cuando `entry.data.draft` es true;
  se eliminó la lógica condicional que intentaba inferir borradores desde
  estados de traducción.
- Tipado: se añadió `draft?: boolean` en el tipo local `BaseEntryData` para
  evitar casteos y reflejar el campo en las páginas que renderizan entradas.
- Tests: las pruebas unitarias se adaptaron para usar `draft` (`entry.data.draft`) como
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
