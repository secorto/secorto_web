---
id: ADR-R03
title: Migración de Gatsby a Astro
status: accepted
date: 2024-05
categories:
  - Platform
  - SSG
  - Testing
  - i18n
repository: secorto_web
commits: 502
start_year: 2024
reconstruction_date: 2026-02
last_updated: 2026-09-20
---

## Contexto

Después de ~2 años con Gatsby ([ADR R02](R02-migracion-jekyll-a-gatsby.md)),
el sitio enfrentaba problemas sistémicos que hacían insostenible el mantenimiento:

- **Infierno de dependencias:** Gatsby dependía de ~34 plugins, cada uno con su
  propio ciclo de releases. Las actualizaciones generaban conflictos frecuentes,
  y Snyk reportaba vulnerabilidades constantemente.
- **Builds lentos (~3 minutos):** due to cross-referencing de posts via GraphQL,
  procesamiento de imágenes con sharp, y 4 stages de webpack.
- **Baja frecuencia de actualizaciones:** el proyecto tenía poco contenido nuevo,
  haciendo el overhead de Gatsby desproporcionado.
- **Limitaciones arquitectónicas:** `gatsby-node.js` monolítico, GraphQL
  obligatorio incluso para datos simples, snapshot testing frágil.

---

## Decisión

Migrar a **Astro** como generador de sitios estáticos, aprovechando:

- **Zero JavaScript por defecto** — menos código cliente, mejor performance.
- **Content Collections tipadas** — schema Zod con validación en build-time.
- **Enrutamiento basado en archivos** — simplificación radical vs. GraphQL.
- **Soporte built-in para i18n** — base para multilenguaje.
- **Ecosystem ligero** — ~3 integraciones Astro vs. ~34 plugins Gatsby.

La estrategia de calidad evolucionaría de tests frágiles a arquitectura de
testing dinámica (Playwright E2E + Vitest unitarios, documentados en ADR 002).

---

## Alternativas consideradas

| Alternativa | Razón de descarte |
| --- | --- |
| **Next.js** | SSR/ISR innecesario para sitio 100% estático; mayor complejidad |
| **Eleventy** | Sin tipado nativo, sin Content Collections |
| **SvelteKit** | Curva de aprendizaje de Svelte; ecosistema menos maduro para blogs |
| **Mantener Gatsby** | Dependencias insostenibles, builds lentos, ecosistema en declive |
| **Volver a Jekyll** | Los problemas originales (Nokogiri, falta de tipos) persistían |

---

## Consecuencias

### Positivas

- **Builds ~6× más rápidos:** de ~3 minutos a ~30 segundos con Vite/esbuild.
- **Zero JavaScript por defecto:** sitio 100% HTML/CSS excepto donde hay interactividad.
- **Content Collections tipadas:** schema Zod, validación en build-time.
- **TypeScript strict sin `any`:** confiabilidad completa del sistema de tipos.
- **i18n nativo:** primer soporte multilingüe en la historia del proyecto.
- **Testing maduro:** de 0 tests unitarios a 165+ con 100% cobertura.
- **Dependencias mínimas:** ~3 integraciones vs. ~34 plugins en Gatsby.
- **Escalabilidad O(1):** agregar sección nueva requiere entrada en `sections.ts`.

### Negativas

- **Cypress legacy:** la configuración y dependencia aún existen (sin usar).
- **Sin React:** componentes React reescritos como componentes Astro.
- **Curva de aprendizaje:** Astro tiene convenciones propias (frontmatter script, slots).
- **Ecosistema más joven:** menos plugins de terceros que Gatsby/Next.js.

---

## Referencias

- Repositorio actual: `secorto_web/`
- Repositorio Gatsby: `web2021/`
- Repositorio Jekyll: `secorto.com_jekyll/`
- [ADR R01 — Jekyll](R01-fundacion-sitio-jekyll.md)
- [ADR R02 — Gatsby](R02-migracion-jekyll-a-gatsby.md)
- [ADR 001 — i18n y router polimórfico](001-i18n-router-framework.md)
- [ADR 002 — Arquitectura de testing dinámica](002-dynamic-testing-architecture.md)
- [ADR 003 — Mocks de terceros](003-third-party-mocks.md)
- [Astro](https://astro.build/)

## Anexos

- [GATSBY_LIMITATIONS.md](anexos/R03-migracion-gatsby-a-astro/GATSBY_LIMITATIONS.md) — Problemas en Gatsby que motivaron
  la migración
- [MIGRATION_PHASES.md](anexos/R03-migracion-gatsby-a-astro/MIGRATION_PHASES.md) — Fases de la migración
- [STACK_FINAL.md](anexos/R03-migracion-gatsby-a-astro/STACK_FINAL.md) — Stack final y evolución de testing
- [METRICS.md](anexos/R03-migracion-gatsby-a-astro/METRICS.md) — Métricas y línea temporal completa
