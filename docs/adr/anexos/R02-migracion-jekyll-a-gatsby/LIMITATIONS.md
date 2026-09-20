# R02 — Problemas identificados en Gatsby

## Infierno de dependencias

Gatsby 5 dependía de **~34 plugins** (`gatsby-plugin-*`,
`gatsby-transformer-*`, `gatsby-remark-*`) cada uno con su propio ciclo de
releases. Las actualizaciones de dependencias generaban conflictos
frecuentes:

- **Snyk reportaba vulnerabilidades** constantemente (9 commits de
  `snyk-bot` solo para parches de seguridad)
- Un upgrade de un plugin podía romper la compatibilidad con otros
- Los deploy previews de Netlify fallaban por dependencias rotas
- El `yarn.lock` tenía conflictos de merge recurrentes

## Builds lentos (~3 minutos)

El pipeline de build tardaba aproximadamente **3 minutos** debido a:

1. **Cross-referencing de posts**: `gatsby-node.js` ejecutaba queries
   GraphQL separadas para blog y portafolio, resolviendo `previous`/`next`
   para cada post
2. **Procesamiento de imágenes**: `sharp` + `gatsby-plugin-image` generaba
   múltiples resoluciones de cada imagen
3. **Webpack bundling**: 4 stages de webpack (develop, develop-html,
   build-html, build-javascript) con configuración custom para SVG
4. **GraphQL schema inference**: Gatsby infería el schema de GraphQL de
   todo el contenido en cada build

## Baja frecuencia de actualizaciones

El sitio tenía pocas actualizaciones de contenido. El último post nuevo
databa de 2022. La relación esfuerzo de mantenimiento vs. contenido nuevo
era desproporcionada — se pasaba más tiempo actualizando dependencias que
escribiendo contenido.

## Limitaciones arquitectónicas

- **gatsby-node.js monolítico**: toda la lógica de generación de páginas
  en un archivo sin tipado fuerte
- **GraphQL obligatorio**: incluso para datos simples como metadatos del
  sitio, se requería una query GraphQL
- **Snapshot testing frágil**: los snapshots de Jest se rompían con
  cualquier cambio cosmético, generando falsos positivos
- **Gatsby en declive**: menor actividad del ecosistema, plugins sin
  mantener, comunidad migrando a otros frameworks
