# Maintenance Checklist

Lista de verificación para cambios que afectan la arquitectura de secciones, routing o builders.

Antes de mergear cambios que afecten `sections`, builders o views:

1. Actualizar `src/domain/sections.ts` si cambia la configuración de una sección
2. Ejecutar/actualizar los builders relevantes (p. ej. `staticPathsBuilder`) y verificar que `getStaticPaths` sigue generando las rutas esperadas
3. Ejecutar tests unitarios y de integración (`npm run test:unit`, `npm run test:e2e` si aplica)
4. Verificar que las entradas de contenido siguen concordando con `src/content.config.ts`
5. Actualizar `ARCHITECTURE_DIAGRAM.md` si el flujo cambia de forma significativa
6. Documentar cambios deprecados en un ADR o issue (incluir razón y fecha de eliminación)
7. Revisar Playwright e2e para accesibilidad y comportamiento de widgets (si el cambio afecta UI crítica)

Pasos rápidos para añadir una nueva sección:

- Añadir entry en `src/domain/sections.ts` con `collection`, `routes` y `detailComponent`
- Asegurar que `src/content.config.ts` contiene el schema para la colección nueva
- Ejecutar builder de paths y revisar rutas generadas
- Añadir test unitario en `tests/unit/config/sections.test.ts` si procede
