# R03 — Problemas identificados en Gatsby

## Infierno de dependencias

Gatsby 5 dependía de **~34 plugins** cada uno con su propio ciclo de releases.
Las actualizaciones generaban conflictos frecuentes:

- **Snyk reportaba vulnerabilidades** constantemente
- Un upgrade de un plugin podía romper la compatibilidad con otros
- Los deploy previews de Netlify fallaban por dependencias rotas

## Builds lentos (~3 minutos)

El pipeline de build tardaba aproximadamente **3 minutos** debido a:

1. **Cross-referencing de posts**: queries GraphQL separadas para blog y
   portafolio
2. **Procesamiento de imágenes**: `sharp` + `gatsby-plugin-image` generaba
   múltiples resoluciones
3. **Webpack bundling**: 4 stages de webpack con configuración custom
4. **GraphQL schema inference**: inferencia del schema en cada build

## Baja frecuencia de actualizaciones

El sitio tenía pocas actualizaciones de contenido. El último post nuevo
databa de 2022. La relación esfuerzo de mantenimiento vs. contenido nuevo
era desproporcionada.

## Limitaciones arquitectónicas

- **gatsby-node.js monolítico**: toda la lógica en un archivo sin tipado
- **GraphQL obligatorio**: incluso para datos simples
- **Snapshot testing frágil**: roturas por cambios cosméticos
- **Gatsby en declive**: menor actividad del ecosistema, comunidad migrando
