# R02 — Evolución técnica de Gatsby

## Stack adoptado

| Capa | Tecnología | Reemplaza a |
| --- | --- | --- |
| SSG | Gatsby 5 | Jekyll |
| UI | React 18 | Liquid templates |
| Estilos | Theme UI 0.16 + Emotion | Sass + Minimal Mistakes |
| Contenido | MDX v5 (`.mdx` y `.md`) | Markdown + Liquid |
| Imágenes | gatsby-plugin-image + sharp | imagemin-cli |
| SVG | @svgr/webpack (componentes React) | Archivos estáticos |
| Color modes | Dark/Light via Theme UI | No existía |
| PWA | gatsby-plugin-manifest + offline | No existía |
| Tests unitarios | Jest 29 + jsdom + Emotion serializer | No existían |
| Tests E2E | Cypress 12 + cypress-axe | html-proofer |
| Linting | ESLint 8 + react-app + MDX plugin | ESLint + scss-lint + remark |
| Formatting | Prettier 3 | No existía |
| CI | GitHub Actions | Travis CI |
| Deploy | Netlify | Netlify (se mantuvo) |
| Dev env | DevContainer (Node 18) | Local únicamente |

## Arquitectura de la aplicación

```text
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

## Generación de páginas (`gatsby-node.js`)

Gatsby usaba **GraphQL** para consultar contenido y generar páginas
estáticamente. El archivo `gatsby-node.js` ejecutaba:

1. **onCreateNode**: interceptaba nodos MDX, extraía `sourceInstanceName`
   del padre y creaba campos `slug` y `collection`
2. **createPages**: dos queries GraphQL separadas (blog + portafolio),
   cada post recibía contexto con `previous` y `next` para navegación
3. **onCreateWebpackConfig**: configuraba @svgr/webpack en los 4 stages

El **cross-referencing** de posts (previous/next) requería resolver
relaciones en GraphQL durante el build, contribuyendo a tiempos de
compilación de **~3 minutos**.

## Estrategia de testing

### Jest — Tests unitarios con snapshot testing

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

### Cypress — Tests E2E de accesibilidad

```javascript
// cypress/e2e/accessibility.cy.js
// Tests de a11y con axe-core en modo oscuro y claro
```

- `cypress-axe` + `axe-core` para auditoría de accesibilidad
- `@testing-library/cypress` para queries semánticas
- Solo un spec file: accesibilidad en ambos color modes
- No se usó Cypress Cloud (evitando el límite de 500 ejecuciones/mes
  que luego motivaría el [ADR 002](../002-dynamic-testing-architecture.md))

### Pipeline CI (GitHub Actions)

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
