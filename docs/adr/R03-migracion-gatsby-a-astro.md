# ADR R03: Migración de Gatsby a Astro

> **Estado:** Aceptada
> **Fecha original:** 2024-05 (reconstruido retrospectivamente 2026-02)
> **Categoría:** Plataforma / SSG / Testing / i18n
> **Repositorio:** `secorto_web` (502+ commits, 2024–presente)

---

## Contexto

Después de ~2 años con Gatsby ([ADR R02](R02-migracion-jekyll-a-gatsby.md)),
el sitio enfrentaba problemas sistémicos que hacían insostenible el
mantenimiento:

### Infierno de dependencias

Gatsby 5 dependía de **~34 plugins** (`gatsby-plugin-*`,
`gatsby-transformer-*`, `gatsby-remark-*`) cada uno con su propio ciclo de
releases. Las actualizaciones de dependencias generaban conflictos
frecuentes:

- **Snyk reportaba vulnerabilidades** constantemente (9 commits de
  `snyk-bot` solo para parches de seguridad)
- Un upgrade de un plugin podía romper la compatibilidad con otros
- Los deploy previews de Netlify fallaban por dependencias rotas
- El `yarn.lock` tenía conflictos de merge recurrentes

### Builds lentos (~3 minutos)

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

### Baja frecuencia de actualizaciones

El sitio tenía pocas actualizaciones de contenido. El último post nuevo
databa de 2022. La relación esfuerzo de mantenimiento vs. contenido nuevo
era desproporcionada — se pasaba más tiempo actualizando dependencias que
escribiendo contenido.

### Limitaciones arquitectónicas

- **gatsby-node.js monolítico**: toda la lógica de generación de páginas
  en un archivo sin tipado fuerte
- **GraphQL obligatorio**: incluso para datos simples como metadatos del
  sitio, se requería una query GraphQL
- **Snapshot testing frágil**: los snapshots de Jest se rompían con
  cualquier cambio cosmético, generando falsos positivos
- **Gatsby en declive**: menor actividad del ecosistema, plugins sin
  mantener, comunidad migrando a otros frameworks

---

## Decisión

Migrar a **Astro** como generador de sitios estáticos, aprovechando su
modelo de zero-JS-by-default, Content Collections tipadas, y
enrutamiento basado en archivos.

### ¿Por qué Astro?

| Criterio | Gatsby | Astro |
|---|---|---|
| JS en cliente | React hydration completo | Zero JS por defecto |
| Datos | GraphQL obligatorio | Content Collections tipadas |
| Build speed | ~3 min (GraphQL + webpack) | ~30 s (Vite + esbuild) |
| Plugins necesarios | ~34 | ~3 (sitemap, expressive-code) |
| Tipado | Parcial (migración gradual) | TypeScript strict nativo |
| i18n | No implementado | Soporte built-in con prefixDefaultLocale |
| Dependencias | Ecosistema pesado | Ecosistema liviano |

### Fases de la migración

#### Fase 1 — Bootstrap (30 mayo 2024)

El proyecto nació siguiendo el tutorial oficial de Astro (unidades 1–5:
páginas, componentes, layouts, blog, tags, RSS) en una sola sesión. Se
creó la estructura base y se migraron los posts del blog Jekyll/Gatsby.

#### Fase 2 — Migración de contenido y secciones

Se expandieron las colecciones de contenido más allá de blog y portafolio:

| Colección | Descripción |
|---|---|
| `blog` | Posts del blog (migrados desde Jekyll/Gatsby) |
| `talk` | Charlas y conferencias |
| `work` | Experiencia laboral |
| `projects` | Proyectos personales |
| `community` | Participación en comunidades |

#### Fase 3 — Testing con Cypress (pre-i18n)

Inicialmente se adoptó **Cypress** como framework E2E, manteniendo
continuidad con Gatsby:

- Tests de accesibilidad con `cypress-axe`
- Tests funcionales básicos de navegación
- Sin tests unitarios en esta fase

Esta fue una decisión pragmática: reutilizar el conocimiento existente
de Cypress mientras se estabilizaba la nueva plataforma.

#### Fase 4 — Internacionalización (i18n)

Implementación del sistema multilingüe español/inglés — la primera vez
que el sitio soportaba más de un idioma. Documentado en detalle en
[ADR 001](001-i18n-router-framework.md):

- Router polimórfico basado en configuración
- Aliasing de rutas por idioma (`/es/charla/` ↔ `/en/talk/`)
- 3 archivos dinámicos reemplazaron ~8 archivos de página
- Reducción de duplicación del 95% al 0%

#### Fase 5 — Migración de testing (post-i18n)

La complejidad del i18n evidenció las limitaciones de Cypress y la
ausencia de tests unitarios. Documentado en
[ADR 002](002-testing-framework-migration.md):

- **Playwright** reemplazó a Cypress para E2E (multi-browser, sin límite
  de ejecuciones)
- **Vitest** se adoptó como framework unitario (165+ tests, 100% cobertura)
- Mocks de terceros para E2E determinísticos
  ([ADR 003](003-third-party-mocks.md))

### Stack final

| Capa | Tecnología | Reemplaza a |
|---|---|---|
| SSG | Astro 5 | Gatsby 5 |
| Lenguaje | TypeScript (strict, zero `any`) | TypeScript parcial |
| Contenido | Content Collections + Markdown | MDX + GraphQL |
| Estilos | CSS nativo + variables | Theme UI + Emotion |
| Imágenes | Astro Image (built-in) | gatsby-plugin-image + sharp |
| Code blocks | astro-expressive-code | No existía |
| Comentarios | Giscus | No existía |
| Galería | PhotoSwipe 5 | PhotoSwipe 5 (se mantuvo) |
| Tests unitarios | **Vitest 4** (165+ tests) | Jest 29 (snapshots) |
| Tests E2E | **Playwright 1.58** (3 browsers) | Cypress 12 (1 spec) |
| Linting | ESLint 9 (flat config) | ESLint 8 |
| CI | GitHub Actions (2 jobs paralelos) | GitHub Actions (1 job) |
| Deploy | Netlify | Netlify (se mantuvo) |
| i18n | Built-in Astro + router custom | No existía |

### Estrategia de calidad — evolución completa

```
Jekyll (2016)    → Linters + html-proofer (validación estática)
Gatsby (2021)    → Jest snapshots + Cypress a11y (tests básicos)
Astro pre-i18n   → Cypress E2E (continuidad)
Astro post-i18n  → Playwright E2E + Vitest unitarios (cobertura completa)
```

---

## Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| **Next.js** | SSR/ISR innecesario para sitio estático; mayor complejidad |
| **Eleventy** | Sin tipado nativo, sin Content Collections |
| **SvelteKit** | Curva de aprendizaje de Svelte, ecosistema menos maduro para blogs |
| **Mantener Gatsby** | Dependencias insostenibles, builds lentos, ecosistema en declive |
| **Volver a Jekyll** | Los problemas originales (Nokogiri, falta de tipos) persistían |

---

## Consecuencias

### Positivas

- **Builds ~6× más rápidos**: de ~3 min a ~30 s gracias a Vite/esbuild
- **Zero JavaScript por defecto**: el sitio es HTML/CSS puro excepto donde
  se necesita interactividad (Giscus, PhotoSwipe, theme toggle)
- **Content Collections tipadas**: schema Zod con validación en build-time,
  incluyendo estados de traducción y changelog estructurado
- **TypeScript strict sin `any`**: confiabilidad completa del sistema de tipos
- **i18n nativo**: primer soporte multilingüe en la historia del proyecto
- **Testing maduro**: de 0 tests unitarios a 165+ con 100% de cobertura;
  de 1 spec E2E a suite completa multi-browser
- **Dependencias mínimas**: ~3 integraciones Astro vs ~34 plugins Gatsby
- **ADRs formales**: primera vez que se documentan decisiones arquitectónicas
- **Escalabilidad O(1)**: agregar una sección nueva requiere solo una
  entrada en `sections.ts`

### Negativas

- **Cypress legacy pendiente**: la migración de Cypress no está completa;
  la configuración y dependencia aún existen en el proyecto
- **Sin React**: se perdieron los componentes React existentes (reescritos
  como componentes Astro)
- **Curva de aprendizaje**: Astro tiene convenciones propias (frontmatter
  script, slots, directivas `client:*`)
- **Ecosystem más joven**: menos plugins de terceros que Gatsby/Next.js

### Métricas del repositorio

| Métrica | Valor |
|---|---|
| Commits totales | 502+ |
| Período activo | 2024-05 a presente |
| Colecciones de contenido | 5 (blog, talk, work, projects, community) |
| Idiomas | 2 (es, en) |
| Tests unitarios | 165+ (100% cobertura) |
| Tests E2E | Suite completa (Chromium, Firefox, WebKit) |
| ADRs | 5 formales + 3 retrospectivos |
| CI jobs | 2 paralelos (unit + E2E) |

---

## Línea temporal completa del proyecto

```
2016-03  ┌─ Lektor (Python) — 2 semanas, descartado
2016-04  ├─ Jekyll — R01
         │  ├─ Gulp + Bootstrap + Bower
         │  ├─ NPM scripts + html-proofer
         │  ├─ secorto.com domain
         │  ├─ Minimal Mistakes + Netlify CMS (v2.0.0)
         │  └─ Mantenimiento hasta 2020
2021-03  ├─ Gatsby — R02
         │  ├─ React 18 + Theme UI + MDX
         │  ├─ Jest snapshots + Cypress a11y
         │  ├─ GitHub Actions CI
         │  ├─ TypeScript parcial
         │  └─ Último commit: 2023-07
2024-05  └─ Astro — R03 (actual)
            ├─ Content Collections + TypeScript strict
            ├─ Cypress (pre-i18n)
            ├─ i18n español/inglés — ADR 001
            ├─ Playwright + Vitest — ADR 002
            ├─ Mocks de terceros — ADR 003
            ├─ Linting + zero any — ADR 004
            └─ 502+ commits, 165+ tests, 100% cobertura
```

---

## Referencias

- Repositorio actual: `secorto_web/`
- Repositorio Gatsby: `web2021/`
- Repositorio Jekyll: `secorto.com_jekyll/`
- [ADR R01 — Jekyll](R01-fundacion-sitio-jekyll.md)
- [ADR R02 — Gatsby](R02-migracion-jekyll-a-gatsby.md)
- [ADR 001 — i18n y router polimórfico](001-i18n-router-framework.md)
- [ADR 002 — Migración Cypress → Playwright + Vitest](002-testing-framework-migration.md)
- [Astro](https://astro.build/)
