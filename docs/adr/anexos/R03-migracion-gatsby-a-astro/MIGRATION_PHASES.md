# R03 — Fases de la migración a Astro

## Fase 1 — Bootstrap (30 mayo 2024)

El proyecto nació siguiendo el tutorial oficial de Astro (unidades 1–5:
páginas, componentes, layouts, blog, tags, RSS) en una sola sesión. Se
creó la estructura base y se migraron los posts del blog Jekyll/Gatsby.

## Fase 2 — Migración de contenido y secciones

Se expandieron las colecciones de contenido más allá de blog y portafolio:

| Colección | Descripción |
| --- | --- |
| `blog` | Posts del blog (migrados desde Jekyll/Gatsby) |
| `talk` | Charlas y conferencias |
| `work` | Experiencia laboral |
| `projects` | Proyectos personales |
| `community` | Participación en comunidades |

## Fase 3 — Testing con Cypress (pre-i18n)

Inicialmente se adoptó **Cypress** como framework E2E, manteniendo
continuidad con Gatsby:

- Tests de accesibilidad con `cypress-axe`
- Tests funcionales básicos de navegación
- Sin tests unitarios en esta fase

Esta fue una decisión pragmática: reutilizar el conocimiento existente
de Cypress mientras se estabilizaba la nueva plataforma.

## Fase 4 — Internacionalización (i18n)

Implementación del sistema multilingüe español/inglés — la primera vez
que el sitio soportaba más de un idioma. Documentado en detalle en
[ADR 001](../001-i18n-router-framework.md):

- Router polimórfico basado en configuración
- Aliasing de rutas por idioma (`/es/charla/` ↔ `/en/talk/`)
- 3 archivos dinámicos reemplazaron ~8 archivos de página
- Reducción de duplicación del 95% al 0%

## Fase 5 — Migración de testing (post-i18n)

La complejidad del i18n evidenció las limitaciones de Cypress y la
ausencia de tests unitarios. Documentado en
[ADR 002](../002-dynamic-testing-architecture.md):

- **Playwright** reemplazó a Cypress para E2E (multi-browser, sin límite
  de ejecuciones)
- **Vitest** se adoptó como framework unitario (165+ tests, 100% cobertura)
- Mocks de terceros para E2E determinísticos
  ([ADR 003](../003-third-party-mocks.md))
