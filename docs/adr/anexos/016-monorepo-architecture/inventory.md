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

- `apps/web/src/domain/section.ts`: configuración concreta del sitio
- `apps/web/src/i18n/ui.ts`: strings y labels del producto
- `apps/web/src/i18n/rootMap.ts`: compatibilidad local y rutas de app

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

## Qué sigue en la app

- `sectionKeys`, `SectionType`, `SectionConfig`
- `sectionsConfig`
- strings de UI y navegación
- `rootMap` como adaptador local

## Conclusión

La fuente oficial para la migración es este documento.
El archivo [migration-guide.md](./migration-guide.md) queda como redirección
corta para no duplicar información.
