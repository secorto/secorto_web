# R03 — Stack final

| Capa | Tecnología | Reemplaza a |
| --- | --- | --- |
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

## Estrategia de calidad — evolución completa

```text
Jekyll (2016)    → Linters + html-proofer (validación estática)
Gatsby (2021)    → Jest snapshots + Cypress a11y (tests básicos)
Astro pre-i18n   → Cypress E2E (continuidad)
Astro post-i18n  → Playwright E2E + Vitest unitarios (cobertura completa)
```
