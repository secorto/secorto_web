# Architecture Decision Records (ADR)

Registro de decisiones arquitectónicas del proyecto **secorto\_web**.

Cada ADR documenta una decisión significativa: el contexto, las alternativas
evaluadas, la decisión tomada y sus consecuencias. Seguimos una versión
simplificada del [formato de Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Índice

### ADRs retrospectivos

Decisiones reconstruidas a partir del historial git de los repositorios
anteriores (`secorto.com_jekyll`, `web2021`). Documentan la evolución
completa del proyecto a través de tres reescrituras en diferentes frameworks.

| # | Título | Estado | Fecha original |
|---|--------|--------|----------------|
| [R01](R01-fundacion-sitio-jekyll.md) | Fundación del sitio personal con Jekyll | Reemplazada → R02 | 2016-04 |
| [R02](R02-migracion-jekyll-a-gatsby.md) | Migración de Jekyll a Gatsby | Reemplazada → R03 | 2021-03 |
| [R03](R03-migracion-gatsby-a-astro.md) | Migración de Gatsby a Astro | Aceptada | 2024-05 |

### ADRs del proyecto actual

| # | Título | Estado | Fecha |
|---|--------|--------|-------|
| [001](001-i18n-router-framework.md) | Framework i18n y router polimórfico de secciones | Aceptada | 2025-06 |
| [002](002-testing-framework-migration.md) | Migración de Cypress a Playwright + Vitest | Aceptada | 2025-07 |
| [003](003-third-party-mocks.md) | Mocks de servicios de terceros en tests E2E | Aceptada | 2025-07 |
| [004](004-linting-any-ban-style-conventions.md) | Linting, prohibición de `any` y convenciones de estilo | Parcial | 2025-07 |
| [005](005-copilot-subscription-proposal.md) | Propuesta: suscripción a GitHub Copilot | Propuesta | 2025-07 |

## Convenciones

- Numeración secuencial: `NNN-titulo-breve.md`
- **ADRs retrospectivos**: prefijo `R` + número (`R01`, `R02`, …) para
  decisiones reconstruidas a partir del historial git de repositorios
  anteriores. Se ubican antes de la serie `001+`
- Estados posibles: **Propuesta**, **Aceptada**, **Reemplazada**, **Retirada**
- Idioma: español (consistente con el `defaultLocale` del proyecto)
- Los ADR no se eliminan; si una decisión se revierte se marca como
  **Reemplazada** con referencia al ADR que la sustituye
