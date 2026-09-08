# Migration Guide

Este documento queda como referencia corta y no como fuente canónica.

La fuente definitiva de la migración es [inventory.md](./inventory.md).

## Qué dejamos como canónico

- [inventory.md](./inventory.md) describe el estado real del repo,
  la arquitectura actual y la separación entre librería agnóstica y app-specific.
- Este archivo solo sirve de acceso directo para recordar que la verdad
  del estado actual está en el inventario.

## Resumen corto

- La librería `@secorto/i18n` ya incluye validación de locales,
  rutas por sección, indexado de traducciones y rutas de tags.
- La app `apps/web` sigue dejando su configuración concreta y UI.
- La limpieza pendiente no es volver a diseñar la migración, sino reducir
  el acoplamiento residual en la capa app.

## Documento canónico

- [inventory.md](./inventory.md)
