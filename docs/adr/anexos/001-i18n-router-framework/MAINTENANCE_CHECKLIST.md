# Checklist de Mantenimiento — Secciones (resumen)

Breve guía práctica para agregar, verificar y desplegar secciones usando el router dinámico actual.

## Antes de añadir una sección

- Añade la colección mínima en `src/content/<seccion>/<locale>/` con un markdown de ejemplo
- Crea/actualiza la entrada en `src/config/sections.ts` con: `collection`, `translationKey`, `routes` y `listComponent` si aplica
- Añade las traducciones en `src/i18n/ui.ts` para las claves usadas por `translationKey`

## Verificación rápida (local)

- Ejecuta `npm run build` y corrige errores de compilación
- Ejecuta `npm run preview` y visita la ruta: `/es/<ruta>` y `/en/<ruta>`
- Comprueba que las páginas de listados y los items individuales cargan

## Si algo falla

- ¿No aparece la sección? Verifica `sections.ts`, `src/content/` y que existen posts
- ¿Faltan traducciones? Añade las claves en `src/i18n/ui.ts` para ambos idiomas
- ¿Componente inexistente? Reutiliza `ListPost`/`ListWork` o crea el componente y registra la rama mínima en `SectionRenderer.astro`

## Pre-deploy mínimo

- `npm run build` — sin errores
- `npm run preview` — check visual básico en rutas principales
- Genera sitemap y verifica que las nuevas rutas estén incluidas

## Pautas de mantenimiento (rápidas)

- Mantén `sections.ts` como fuente de la verdad para rutas y componentes
- Evita duplicar rutas entre secciones; usa slugs únicos por idioma
- Prefiere reutilizar `listComponent` existente antes que crear uno nuevo

## Referencias

- Configuración de secciones: `src/config/sections.ts`
- Traducciones UI: `src/i18n/ui.ts`
- Renderizado de sección: `src/components/SectionRenderer.astro`

**Última actualización**: 2026-04-23
**Mantenedor**: Scot
