---
id: ADR-R02
title: Migración de Jekyll a Gatsby
status: replaced
date: 2021-03
last_updated: 2026-09-20
categories:
  - Platform
  - SSG
  - Testing
  - Quality
repository: web2021
commits: 111
start_year: 2021
end_year: 2023
reconstruction_date: 2026-02
replaced_by: R03-migracion-gatsby-a-astro.md
---

## Contexto

Después de ~4 años con Jekyll ([ADR R01](R01-fundacion-sitio-jekyll.md)),
el sitio enfrentaba fricciones sistémicas que hacían el mantenimiento insostenible.

El problema central era que **html-proofer**, la herramienta de validación,
dependía de **Nokogiri** (parser XML/HTML con bindings nativos en C). Compilar
Nokogiri era frágil: fallaba frecuentemente en CI, generaba errores crípticos
con diferentes versiones de libxml2/libxslt, y multiplicaba los puntos de fallo
del stack dual Ruby + Node.js.

Adicionalmente, Jekyll con Liquid ofrecía poca componentización — sin tipos,
sin componentes reutilizables, sin testing unitario real.

---

## Decisión

Migrar a **Gatsby** (v5) con React 18, Theme UI, MDX y Jest + Cypress.

La estrategia de calidad evolucionaría de linters puros a tests unitarios
(Jest snapshots) + E2E (Cypress axe-core), eliminando la dependencia de
Nokogiri y ganando componentización tipada.

---

## Consecuencias

### Positivas

- **Componentes React** permitieron estructura modular y reutilizable.
- **Jest con snapshots** introdujo tests unitarios por primera vez en el proyecto.
- **Cypress + axe-core** automatizó auditorías de accesibilidad.
- **TypeScript parcial** mejoró la confiabilidad del código.
- **Theme UI** proporcionó dark mode y sistema de diseño tipado.
- Se eliminó la dependencia de Ruby y Nokogiri completamente.

### Negativas

- **Dependencias inestables:** las actualizaciones de Gatsby y sus ~34 plugins
  generaban conflictos frecuentes. Snyk reportó múltiples vulnerabilidades.
- **Builds de ~3 minutos:** el cross-referencing de posts via GraphQL y la
  generación de imágenes con sharp alargaban el pipeline significativamente.
- **GraphQL overhead:** consultas complejas para datos que podrían ser simples.
- **gatsby-node.js monolítico:** toda la lógica en un archivo sin tipado fuerte.
- **Snapshot testing frágil:** los snapshots se rompían con cambios cosméticos.

### A considerar

- Necesidad de mantener actualizado el ecosistema de plugins.
- Requerimiento de competencia en React y GraphQL.
- Impacto de cambios de versión de dependencias.

### Limitaciones

- Ecosistema de Gatsby altamente acoplado a sus ~34 plugins.
- Overhead de GraphQL innecesario para datos simples.
- Builds lentos limitaban iteración rápida en desarrollo.

### Alternativas Rechazadas

#### Next.js

Orientado a apps dinámicas con SSR; el sitio es 100% estático.

#### Hugo

Go templates menos expresivos que JSX; sin ecosistema npm nativo.

#### Eleventy

Más simple pero sin el ecosistema de componentes React.

#### Mantener Jekyll

Nokogiri y la falta de componentización eran bloqueos.

---

## Referencias

- Repositorio: `web2021/`
- [ADR R01 — Jekyll](R01-fundacion-sitio-jekyll.md)
- [ADR R03 — Migración a Astro](R03-migracion-gatsby-a-astro.md)
- [Gatsby](https://www.gatsbyjs.com/)
- [Theme UI](https://theme-ui.com/)

## Anexos

- [TECHNICAL_STACK.md](anexos/R02-migracion-jekyll-a-gatsby/TECHNICAL_STACK.md) — Stack completo y arquitectura
- [JEKYLL_PROBLEMS.md](anexos/R02-migracion-jekyll-a-gatsby/JEKYLL_PROBLEMS.md) — Problemas en Jekyll que motivaron la migración
- [LIMITATIONS.md](anexos/R02-migracion-jekyll-a-gatsby/LIMITATIONS.md) — Limitaciones y problemas identificados en Gatsby
- [METRICS.md](anexos/R02-migracion-jekyll-a-gatsby/METRICS.md) — Métricas del repositorio
