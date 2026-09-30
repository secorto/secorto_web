---
title: SEO Structure — Anexo a ADR 007
description: Cómo se materializa la separación de dominio e i18n en componentes SEO
---

ADR 007 establece que la **identidad del contenido debe estar separada del idioma**.

Esta es su materialización en la capa de presentación (componentes SEO).

## Estructura de Componentes

La renderización de SEO refleja la estructura de ADR 007: **tres niveles de páginas → tres responsabilidades SEO distintas**

| Nivel | Casos de uso | Componente | og:type | Alternates |
| --- | --- | --- | --- | --- |
| **Estáticas/Listados** | home, about, tags, [section] index | `PageSEO` | `website` | ✅ Sí (hreflang) |
| **Contenido** | blog post, talk detail, project detail | `EntrySEO` | Dinámico por sección | ✅ Sí (hreflang) |
| **Errores** | 404, 5xx, error pages | `ErrorSEO` | `website` | ❌ No (sin hreflang) |

**Punto clave**: Cada tipo tiene responsabilidades distintas. No son intercambiables.

## Componentes SEO

### PageSEO

**Uso**: Páginas de contenido estático/listados

- **Cuándo usarlo**: home, about, tags index, [section] index, filtros, standalone pages
- **og:type**: Siempre `"website"`
- **Props**: title, description, url, links, image (opcional), noindex
- **Especial**: Renderiza `Alternates` para hreflang multiidioma
- **Renderiza**:
  - `<meta name="description">` + canonical
  - `<meta name="robots">` noindex (si aplica)
  - Open Graph tags (og:type, title, description, url, image)
  - Twitter Card tags
  - `<Alternates>` (hreflang links)

### EntrySEO

**Uso**: Detail pages de contenido editable

- **Cuándo usarlo**: blog post detail, talk detail, project detail, work detail, community detail
- **og:type**: Dinámico según sección
  - `"article"` → blog, talk
  - `"website"` → work, projects, community
- **Props**: title, description, url, links, image, section, noindex
- **Especial**: Renderiza `Alternates` para hreflang multiidioma
- **Renderiza**:
  - `<meta name="description">` + canonical
  - `<meta name="robots">` noindex (si aplica)
  - Open Graph tags (og:type dinámico, title, description, url, image)
  - Twitter Card tags
  - `<Alternates>` (hreflang links)

### ErrorSEO

**Uso**: Páginas de error

- **Cuándo usarlo**: 404, 5xx, error pages (renderizado por `ErrorLayout`)
- **og:type**: Siempre `"website"`
- **Props**: title, description, url (NO incluye links)
- **Diferencia**: NO renderiza `Alternates` porque:
  - Páginas de error pueden no existir en todos los idiomas
  - No tiene sentido ofrecer links a traducción
- **Siempre renderiza**: `<meta name="robots" content="noindex" />`
- **Renderiza**:
  - `<meta name="description">` + canonical
  - `<meta name="robots" content="noindex" />` (sin condición)
  - Open Graph tags (og:type, title, description, url)
  - Twitter Card tags
  - **Sin Alternates**

### Alternates (Componente Interno)

**Responsabilidad única**: Renderizar hreflang links

- **Usado por**: PageSEO, EntrySEO (internamente)
- **Nunca usado por**: ErrorSEO, ninguna otra página
- **Función**: Generar `<link rel="alternate" hreflang="xx" href="..." />`

## Matriz de Decisión: ¿Cuál componente usar?

- ¿Es una página de error (404, 5xx)? → Usa **ErrorSEO**
- ¿Es un artículo/contenido editable (blog post, talk, proyecto)? → Usa **EntrySEO**
- ¿Es estática/listado (home, tags index, about)? → Usa **PageSEO**

## Alineación con ADR 007

| Aspecto | ADR 007 | SEO Implementa |
| --- | --- | --- |
| Identidad del contenido | Canónica por sección | EntrySEO sabe `section` → decide `og:type`; PageSEO es genérico; ErrorSEO es para excepciones |
| Multiidioma | Locale es atributo estructural | Alternates renderiza hreflang en PageSEO/EntrySEO; ErrorSEO sin alternates |
| Separación | Dominio, routing, traducción distintos | Componentes SEO reciben props ya resueltos, sin lógica de routing |
| Metadatos SEO | Responsibility del layout | **seo-head slot es la fuente única de verdad** en BaseLayout |

## Implementación en SEO

- **Cada componente SEO es responsable de sus propios metadatos**:
  - `PageSEO`: description, canonical, og:type="website", Twitter Card, Alternates
  - `EntrySEO`: description, canonical, og:type dinámico, Twitter Card, Alternates
  - `ErrorSEO`: description, canonical, og:type="website", noindex siempre, Twitter Card, SIN Alternates
  
- **BaseLayout renderiza**: `<slot name="seo-head" />` como **fuente única de verdad** para SEO
  - No hay fallbacks ni duplicación de metadatos
  - Cada página/layout debe elegir explícitamente su componente SEO (PageSEO, EntrySEO o ErrorSEO)

- **Patrón obligatorio**: Todo layout debe validar que `seo-head` slot está presente
  - Esto previene que se olvide renderizar metadatos

## Ubicación en Código

**Componentes**:

- `apps/web/src/components/seo/PageSEO.astro` — Listados/estáticas
- `apps/web/src/components/seo/EntrySEO.astro` — Detail pages
- `apps/web/src/components/seo/ErrorSEO.astro` — Páginas de error
- `apps/web/src/components/seo/Alternates.astro` — Hreflang interno

**Dónde se usan**:

- `PageSEO`:
  - `tags.astro` (tags index)
  - `[section]/index.astro` (section list)
  - `[section]/[tag].astro` (filter by tag)
  
- `EntrySEO`:
  - `[locale]/[section]/[...id].astro` (detail pages)
  
- `ErrorSEO`:
  - `ErrorLayout.astro` (error pages)
