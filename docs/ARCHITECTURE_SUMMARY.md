# Architecture Summary

Breve resumen del diseño global del sitio `secorto_web` — referencia ejecutiva para desarrolladores.

Principales ideas:

- Single Source of Truth: la configuración de secciones vive en `src/domain/sections.ts` y debe ser la única fuente de verdad para alias, componentes y flags de sección
- Build-time Generation: rutas y enlaces se generan en build mediante builders (p. ej. `staticPathsBuilder`) para evitar trabajo en runtime
- Domain‑First: tipos y helpers de dominio (`TranslationLink`, `resolveDefaultAccessibleLink`) encapsulan la lógica reutilizable
- Separation of Concerns: builders (datos), routing y componentes (render) están separados
- Type‑Safety: usar tipos explícitos y evitar `any`

![El diagrama refleja los objetos de dominio usados en la solución (SectionConfig, TranslationLink, Entry, EntryCategory) y cómo los builders (staticPathsBuilder) producen rutas y enlaces precomputados que alimentan la selección de componente en tiempo de render (mediante componentMap / entry.category).](diagrams/ARCHITECTURE_DIAGRAM.svg)

Componentes clave (resumen):

- `SectionConfig` (`src/domain/sections.ts`) — registro central de secciones y alias
- `TranslationLink` (`src/domain/translationLink.ts`) — tipos y helpers para enlaces traducidos y accesibles
- `staticPathsBuilder` (`src/utils/staticPathsBuilder.ts`) — builder que precomputa rutas y `TranslationLink[]`
- `componentMap` / `entry.category` — la lógica que mapea una entrada a su vista (`post` → `BlogTalkPostView`, `experience` → `WorkProjectCommunityView`)

Decisiones operativas importantes:

- Tags: la implementación actual trata `tags` como datos en las entradas; la visibilidad en UI debe provenir del builder/contexto o del propio entry (`entry.tags?.length > 0`).
- Deprecation: el repositorio tiende a eliminar artefactos legacy en lugar de mantenerlos; documentar en ADR cuando se haga la eliminación.

Dónde mirar en el código:

- Configuración: [src/domain/sections.ts](../src/domain/section.ts)
- Schemas: [src/content.config.ts](../src/content.config.ts)
- Builders: [src/utils/staticPathsBuilder.ts](../src/utils/staticPathsBuilder.ts)
- Vistas: [src/components/BlogTalkPostView.astro](../src/components/BlogTalkPostView.astro)

Última actualización: Abril 2026
