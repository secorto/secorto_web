# Inventario de funciones

## Propósito

Este documento es la fuente canónica para distinguir lo que ya está en la
librería agnóstica `@secorto/i18n` y lo que sigue siendo configuración propia
`apps/web`.

## Resumen rápido

La migración ya no está en fase de diseño. La librería ya incluye:

- validación de locales
- rutas por sección
- indexado de traducciones
- rutas de tags
- helpers de static paths y links de traducción

La app sigue teniendo configuración del sitio y UI específica, pero la parte
reutilizable ya está extraída.

## Capa `packages/i18n/`

La capa agnóstica ya implementada incluye:

- `core/`: `createLocales()`, `extractCleanId()`, translation links,
  standalone links
- `section/`: `createSectionRoutes()`, `createTranslationIndex()`,
  `createDetailTranslationLinks()`
- `astro/`: `getStaticPathsSections()`, `getStaticPathsEntries()` y helpers
  relacionados
- `tags/`: `createTagRoutes()`, `createSectionTagTranslationLinks()`

## Capa `apps/web/src/`

La capa app-specific incluye:

- `apps/web/src/domain/section.ts`: claves, rutas y tipos del sitio
- `apps/web/src/i18n/ui.ts`: strings y labels del producto
- adaptadores locales de compatibilidad y routing del proyecto

## Qué ya está migrado

- `createLocales()`
- `createSectionRoutes()`
- `createTranslationIndex()`
- `createTagRoutes()`
- `getStaticPathsSections()`
- `getStaticPathsEntries()`
- `createStandalonePageLinks()`
- `createDetailTranslationLinks()`
- `createSectionTagTranslationLinks()`

## Estado actual tras la purga

La limpieza ya está realizada y no quedan restos de la configuración monolítica:

- `SectionConfig` eliminado
- `sectionsConfig` eliminado
- `rootMap` eliminado
- la app queda con los datos mínimos del sitio y las rutas locales necesarias

Queda como configuración local, y solo por decisión del proyecto consumidor:

- `sectionKeys`, `SectionType`, `sectionRoutes` y `navSections`
- strings de UI y navegación
- mapas locales mínimos de routing y presentación

La extracción del paquete `@secorto/i18n` ya no conserva ninguna capa de
compatibilidad antigua ni modelos monolíticos heredados.

## Conclusión

La fuente oficial para la migración es este documento.
El archivo [migration-guide.md](./migration-guide.md) queda como redirección
corta para no duplicar información.
