# Architecture Decision Records (ADR)

Registro de decisiones arquitectónicas del proyecto **secorto\_web**.

Cada ADR documenta una decisión significativa: el contexto, las alternativas
evaluadas, la decisión tomada y sus consecuencias. Seguimos una versión
simplificada del [formato de Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Índice

| # | Título | Estado | Fecha |
|---|--------|--------|-------|
| [001](001-i18n-router-framework.md) | Framework i18n y router polimórfico de secciones | Aceptada | 2025-06 |
| [002](002-testing-framework-migration.md) | Migración de Cypress a Playwright + Vitest | Aceptada | 2025-07 |
| [003](003-third-party-mocks.md) | Mocks de servicios de terceros en tests E2E | Aceptada | 2025-07 |

## Convenciones

- Numeración secuencial: `NNN-titulo-breve.md`
- Estados posibles: **Propuesta**, **Aceptada**, **Reemplazada**, **Retirada**
- Idioma: español (consistente con el `defaultLocale` del proyecto)
- Los ADR no se eliminan; si una decisión se revierte se marca como
  **Reemplazada** con referencia al ADR que la sustituye
