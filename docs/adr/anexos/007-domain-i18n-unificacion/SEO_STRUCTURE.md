---
title: SEO Structure — Anexo a ADR 007
description: Cómo se materializa la separación de dominio e i18n en componentes SEO
---

ADR 007 establece que la **identidad del contenido debe estar separada del idioma**.

Esta es su materialización en la capa de presentación (componentes SEO).

## Estructura de Componentes

La renderización de SEO refleja la estructura de ADR 007:

**Dos niveles de páginas → Dos responsabilidades SEO:**

1. **Páginas estáticas/listados** (home, about, tags, filtros)
   - Componente: **PageSEO** → og:type siempre "website"

2. **Páginas de contenido** (blog, talks, work, etc.)
   - Componente: **EntrySEO** → og:type dinámico según sección

**Patrón**: Ambas delegan hreflang a **Alternates** (componente interno)

## Componentes SEO

### PageSEO

- **Uso**: Páginas estáticas (home, about, índices, filtros)
- **og:type**: Siempre `"website"`
- **Props**: title, description, url, links, image (opcional), noindex
- **Renderiza**: Alternates (hreflang + noindex) + OG tags

### EntrySEO

- **Uso**: Detail pages de cualquier sección
- **og:type**: Dinámico
  - `"article"` para blog, talk
  - `"website"` para work, projects, community
- **Props**: title, description, url, links, image, section, noindex
- **Renderiza**: Alternates (hreflang + noindex) + OG tags dinámicos

### Alternates (Interno)

- **Uso**: Renderiza dentro de PageSEO o EntrySEO (no directamente en páginas)
- **Responsabilidad**: hreflang multiidioma + noindex

## Alineación con ADR 007

| Aspecto | ADR 007 | SEO Implementa |
| --- | --- | --- |
| Identidad del contenido | Canónica por sección | EntrySEO sabe qué `section` es → decide `og:type` |
| Multiidioma | Locale es atributo estructural | Alternates renderiza hreflang centralizadamente |
| Separación | Dominio, routing, traducción distintos | PageSEO/EntrySEO reciben props ya resueltos, sin lógica de routing |

## Implementación en SEO

- **PageSEO única**: Todas las páginas estáticas son `og:type: "website"`
- **og:type dinámico en EntrySEO**: Según sección (article para blog/talk, website para otros)
- **Alternates interna**: Centraliza hreflang sin duplicación
- **SiteLayout limpio**: No renderiza OG tags predeterminados (responsabilidad exclusiva de PageSEO/EntrySEO)

## Ubicación en Código

**Componentes**:

- `apps/web/src/components/seo/PageSEO.astro`
- `apps/web/src/components/seo/EntrySEO.astro`
- `apps/web/src/components/seo/Alternates.astro`

**Usadas en**:

- Layouts: `HomeLayout`, `StandalonePageLayout`
- Páginas: `tags.astro`, `[section]/index.astro`, `[section]/[tag].astro`, `[locale]/[section]/[...id].astro`
