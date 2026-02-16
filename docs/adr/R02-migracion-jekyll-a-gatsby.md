# ADR R02: Migración de Jekyll a Gatsby

> **Estado:** Reemplazada → [R03](R03-migracion-gatsby-a-astro.md)
> **Fecha:** 2021-03
> **Categoría:** Plataforma / SSG / Testing / Quality
> **Repositorio:** `web2021` (111 commits, 2021–2023)
> **Fecha reconstrucción:** 2026-02

---

## Contexto

Después de ~4 años con Jekyll ([ADR R01](R01-fundacion-sitio-jekyll.md)),
el sitio enfrentaba múltiples fricciones:

### Problemas con Nokogiri

`html-proofer` — la herramienta central de validación de calidad — dependía
de **Nokogiri**, un parser XML/HTML con bindings nativos en C. Compilar
Nokogiri era un proceso frágil:

- Fallaba frecuentemente en CI (Travis CI) requiriendo
  `NOKOGIRI_USE_SYSTEM_LIBRARIES=true`
- Diferentes versiones de `libxml2`/`libxslt` en el sistema generaban
  errores crípticos
- Actualizaciones de Ruby o del SO rompían la compilación nativa
- El stack dual Ruby + Node.js multiplicaba los puntos de fallo

### Deseo de mayor estructura

Jekyll con Liquid ofrecía poca componentización:

- No había componentes reutilizables con props tipados
- La lógica de templates era difícil de testear
- No existía sistema de tipos — los errores se detectaban en runtime (build)
- El código CSS/HTML estaba acoplado al tema Minimal Mistakes (gema opaca)

### Motivación personal

- Practicar React y el ecosistema moderno de JavaScript
- Tener una base más estructurada y componentizada
- Poder escribir tests unitarios reales (no solo linters)

---

## Decisión

Migrar a **Gatsby** (v5) con React 18, Theme UI para estilos, MDX para
contenido, y Jest + Cypress como frameworks de testing.

### Stack adoptado

| Capa | Tecnología | Reemplaza a |
|---|---|---|
| SSG | Gatsby 5 | Jekyll |
| UI | React 18 | Liquid templates |
| Estilos | Theme UI 0.16 + Emotion | Sass + Minimal Mistakes |
| Contenido | MDX v5 (`.mdx` y `.md`) | Markdown + Liquid |
| Imágenes | gatsby-plugin-image + sharp | imagemin-cli |
| SVG | @svgr/webpack (componentes React) | Archivos estáticos |
| Color modes | Dark/Light via Theme UI | No existía |
| PWA | gatsby-plugin-manifest + offline | No existía |
| Tests unitarios | **Jest 29 + jsdom + Emotion serializer** | No existían |
| Tests E2E | **Cypress 12 + cypress-axe** | html-proofer |
| Linting | ESLint 8 + react-app + MDX plugin | ESLint + scss-lint + remark |
| Formatting | Prettier 3 | No existía |
| CI | **GitHub Actions** | Travis CI |
| Deploy | Netlify | Netlify (se mantuvo) |
| Dev env | DevContainer (Node 18) | Local únicamente |

### Arquitectura de la aplicación

```
src/
├── assets/          → Recursos estáticos (avatar, logo, iconos)
├── blocks/          → Contenido MDX como bloques (about.mdx)
├── components/      → Componentes React (Bio, Blog, Footer, Gallery, etc.)
├── constants.ts     → Constantes (MAIN_CONTENT_ID)
├── containers/      → Layout, SEO, PostFooter
├── context/         → SidebarContext (React Context)
├── hooks/           → use-avatar, use-site-metadata
├── pages/           → 404, blog, index, portafolio
├── templates/       → blog-template, page-template, portafolio-template
├── theme/           → Colors, typography, styles (Theme UI)
└── types/           → Declaraciones TypeScript
```

### Generación de páginas (`gatsby-node.js`)

Gatsby usaba **GraphQL** para consultar contenido y generar páginas
estáticamente. El archivo `gatsby-node.js` ejecutaba:

1. `onCreateNode`: interceptaba nodos MDX, extraía `sourceInstanceName`
   del padre y creaba campos `slug` y `collection`
2. `createPages`: dos queries GraphQL separadas (blog + portafolio),
   cada post recibía contexto con `previous` y `next` para navegación
3. `onCreateWebpackConfig`: configuraba @svgr/webpack en los 4 stages

El **cross-referencing** de posts (previous/next) requería resolver
relaciones en GraphQL durante el build, contribuyendo a tiempos de
compilación de **~3 minutos**.

### Estrategia de testing

#### Jest — Tests unitarios con snapshot testing

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': '<rootDir>/jest-preprocess.js' },
  moduleNameMapper: {
    '.+\\.(css|style)$': 'identity-obj-proxy',
    '.+\\.(jpg|png|gif|svg)$': '<rootDir>/__mocks__/file-mock.js'
  },
  snapshotSerializers: ['@emotion/jest/serializer']
}
```

- **Snapshot testing**: verificaba que los componentes renderizaran
  consistentemente (SEO, layouts)
- `react-test-renderer` para renderizado sin DOM
- `identity-obj-proxy` para mockear CSS modules
- Mock completo de Gatsby (`__mocks__/gatsby.js`): `useStaticQuery`,
  `graphql`, `Link`, `navigate`, `StaticImage`
- `@emotion/jest/serializer` para snapshots legibles de estilos Emotion

#### Cypress — Tests E2E de accesibilidad

```javascript
// cypress/e2e/accessibility.cy.js
// Tests de a11y con axe-core en modo oscuro y claro
```

- `cypress-axe` + `axe-core` para auditoría de accesibilidad
- `@testing-library/cypress` para queries semánticas
- Solo un spec file: accesibilidad en ambos color modes
- No se usó Cypress Cloud (evitando el límite de 500 ejecuciones/mes
  que luego motivaría el [ADR 002](002-testing-framework-migration.md))

#### Pipeline CI (GitHub Actions)

```yaml
# .github/workflows/tests.yml
name: Jest
on: push
jobs:
  test:
    steps:
      - yarn install --frozen-lockfile
      - yarn lint          # ESLint (JS, JSX, MD, MDX)
      - yarn test:unit     # Jest
```

Solo lint + unit tests en CI. E2E se ejecutaba localmente o via Netlify
deploy previews.

### Contenido migrado

- **17 posts de blog** (mismos que Jekyll, convertidos de `.md` a MDX)
- **3 entradas de portafolio** (pybaq, perficient, scot3004)
- **Timeline profesional** (`content/timeline.yml`)
- Se mantuvo un solo idioma (español)

---

## Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| **Next.js** | Orientado a apps dinámicas con SSR; el sitio es 100% estático |
| **Hugo** | Go templates menos expresivos que JSX; sin ecosistema npm nativo |
| **Eleventy** | Más simple pero sin el ecosistema de componentes React |
| **Mantener Jekyll** | Nokogiri y la falta de componentización eran bloqueos |

---

## Consecuencias

### Positivas

- **Componentes React** permitieron estructura modular y reutilizable
- **Theme UI** proporcionó dark mode, sistema de diseño tipado y
  estilos consistentes
- **Jest con snapshots** introdujo tests unitarios por primera vez en
  el proyecto — verificación automática de regresiones visuales
- **Cypress + axe-core** automatizó auditorías de accesibilidad
- **TypeScript parcial** (migración gradual) mejoró la confiabilidad
- **DevContainer** estandarizó el entorno de desarrollo
- **MDX** permitió React dentro del Markdown (componentes interactivos)
- Se eliminó la dependencia de Ruby y Nokogiri completamente

### Negativas

- **Dependencias inestables**: las actualizaciones de Gatsby y sus ~34
  plugins generaban conflictos frecuentes que retrasaban deploys. Snyk
  reportó múltiples vulnerabilidades (9 commits de snyk-bot)
- **Builds de ~3 minutos**: el cross-referencing de posts via GraphQL
  y la generación de imágenes con sharp alargaban el pipeline
- **GraphQL overhead**: consultas complejas para datos que podrían ser
  simples archivos de configuración
- **Pocas actualizaciones de contenido**: el proyecto tenía baja
  frecuencia de cambios, lo que hacía el overhead de Gatsby desproporcionado
- **gatsby-node.js monolítico**: toda la lógica de generación en un solo
  archivo sin tipado
- **Snapshot testing frágil**: los snapshots se rompían con cambios
  cosméticos, generando falsos positivos
- **Webpack opaco**: la configuración de webpack estaba abstraída por
  Gatsby, dificultando optimizaciones

### Métricas del repositorio

| Métrica | Valor |
|---|---|
| Commits totales | 111 |
| Período activo | 2021-03 a 2023-07 (~2 años 4 meses) |
| Tags de versión | Ninguno |
| Versión final | 4.2.0 (package.json) |
| CI | GitHub Actions (lint + unit tests) |
| Deploy | Netlify |
| Último commit | 2023-07-20 (upgrade dependencias) |

---

## Referencias

- Repositorio: `web2021/`
- [ADR R01 — Jekyll](R01-fundacion-sitio-jekyll.md) (decisión reemplazada)
- [Gatsby](https://www.gatsbyjs.com/)
- [Theme UI](https://theme-ui.com/)
- [Jest Snapshot Testing](https://jestjs.io/docs/snapshot-testing)
- [cypress-axe](https://github.com/component-driven/cypress-axe)
