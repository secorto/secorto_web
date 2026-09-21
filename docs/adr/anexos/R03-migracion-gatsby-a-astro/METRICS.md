# R03 — Métricas del repositorio

| Métrica | Valor |
| --- | --- |
| Commits totales | 502+ |
| Período activo | 2024-05 a presente |
| Colecciones de contenido | 5 (blog, talk, work, projects, community) |
| Idiomas | 2 (es, en) |
| Tests unitarios | 165+ (100% cobertura) |
| Tests E2E | Suite completa (Chromium, Firefox, WebKit) |
| ADRs | 5 formales + 3 retrospectivos |
| CI jobs | 2 paralelos (unit + E2E) |

## Línea temporal completa del proyecto

```mermaid
timeline
    title Evolución del sitio web personal (2016–2026)

    2016-03 : Lektor (Python)
             : 2 semanas, descartado

    2016-04 : Jekyll — R01
             : Gulp + Bootstrap + Bower
             : NPM scripts + html-proofer
             : secorto.com domain
             : Minimal Mistakes + Netlify CMS (v2.0.0)
             : Mantenimiento hasta 2020

    2021-03 : Gatsby — R02
             : React 18 + Theme UI + MDX
             : Jest snapshots + Cypress a11y
             : GitHub Actions CI
             : TypeScript parcial
             : Último commit: 2023-07

    2024-05 : Astro — R03 (actual)
             : Content Collections + TypeScript strict
             : Cypress (pre-i18n)
             : i18n español/inglés (ADR 001)
             : Playwright + Vitest (ADR 002)
             : Mocks de terceros (ADR 003)
             : Linting + zero any (ADR 004)
             : 502+ commits, 165+ tests, 100% cobertura
```
