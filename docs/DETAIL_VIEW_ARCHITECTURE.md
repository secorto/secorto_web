# Arquitectura de Vistas de Detalle

Este documento explica la estrategia de componentes para las vistas de detalle de contenido y cómo se relacionan con los content types.

## Resumen Ejecutivo

El proyecto utiliza **2 componentes de vista de detalle** para renderizar **5 colecciones diferentes**, basándose en las características compartidas de sus schemas:

- **`BlogTalkPostView`**: Para `blog` y `talk` (contenido con tags y fechas)
- **`WorkProjectCommunityView`**: Para `work`, `projects` y `community` (contenido profesional con roles)

## Principio de Diseño

**Single Source of Truth**: `SectionConfig` en [src/domain/section.ts](../src/domain/section.ts)

## Mapeo de Colecciones a Componentes

### BlogTalkPostView

**Colecciones:** `blog`, `talk`

**Características distintivas:**

- ✅ Fechas de publicación (`date: Date`)
- ✅ Soporte para video/slides (talk)
- ✅ Orientado a contenido cronológico

### WorkProjectCommunityView

**Colecciones:** `work`, `projects`, `community`

**Características distintivas:**

- ✅ Información de rol (`role: string`)
- ✅ Responsabilidades (`responsibilities: string`)
- ✅ Enlaces a sitios web (`website?: string`)
- ✅ Periodo de trabajo (`startDate` + `endDate?`) - Renderizado con `WorkDateRange` component
- ✅ Orientado a portafolio profesional

## Tabla de Features por Componente

| Feature | BlogTalkPostView | WorkProjectCommunityView |
| --------- | ------------------ | -------------------------- |
| **Date (publicación)** | ✅ Sí | ❌ No |
| **Period (startDate-endDate)** | ❌ No | ✅ Sí |
| **Role** | ❌ No | ✅ Sí |
| **Responsibilities** | ❌ No | ✅ Sí |
| **Website link** | ❌ No | ✅ Sí |
| **Video/Slides** | ✅ Sí | ❌ No |
| **Image** | ✅ Sí | ✅ Sí |
| **Excerpt** | ✅ Sí | ✅ Sí |
| **Gallery** | ✅ Sí | ✅ Sí |
| **Markdown Content** | ✅ Sí | ✅ Sí |
| **Tags** | ✅ Sí | ✅ Sí |

## Flujo de Renderizado

1. **Ruta dinámica**: `src/pages/[locale]/[section]/[...id].astro`
2. **Determina sección**: Lee `section` param y lo mapea a `SectionConfig`
3. **Renderiza mediante un mapa de componentes** (evita largas cadenas de condicionales):

## Decisiones de Arquitectura

### ¿Por qué 2 componentes en lugar de 5?

**Reutilización justificada:**

- Blog y Talk comparten 90% de la UI (solo difieren en video/slides)
- Work, Projects y Community son prácticamente idénticos en presentación
- **Balance**: Suficiente abstracción sin sobre-ingeniería

### ¿Por qué no un componente universal?

**Separación de concerns:**

- Contenido editorial vs portafolio profesional son paradigmas UX diferentes
- Tags son fundamentales en blog/talks pero no existen en work/projects
- Mantener componentes enfocados facilita el mantenimiento

### ¿Por qué no 5 componentes específicos?

**Evita duplicación:**

- Work, Projects y Community literalmente usan los mismos campos
- Blog y Talk solo difieren en campos opcionales (video/slide)
- DRY: No repetir código HTML/CSS para UIs idénticas

## Principios rectores

- **Build-time Generation:** Generar rutas y enlaces en build (p. ej. `staticPathsBuilder`) para evitar lógica costosa en runtime
- **Domain‑First:** Encapsular helpers y tipos en el dominio (`TranslationLink`, `resolveDefaultAccessibleLink`) en lugar de distribuir lógica por snippets
- **Type‑Safety:** Usar tipos explícitos para que TypeScript valide configuraciones y reduzca errores en tiempo de compilación
- **Separation of Concerns:** Mantener builders (datos), routing y componentes (render) independientes
- **Deterministic Outputs:** Las salidas del build deben ser reproducibles y predecibles
- **Fail‑Fast / Validación temprana:** Detectar problemas de configuración o schema en build en lugar de runtime
- **Performance by Design:** Evitar construir menús o resolver enlaces en cada petición; precomputar lo necesario
- **Tests as Spec:** Los builders y transformaciones deben tener tests que sirvan como documentación ejecutable
- **Accessibility:** Las comprobaciones de accesibilidad se realizan con Playwright en la suite e2e
- **Deprecation Policy:** en este proyecto se tiende a eliminar artefactos legacy ("mochar de raíz"); documentar la eliminación en un ADR o issue y actualizar tests para evitar regresiones

## Enlaces y Extensibilidad

### Para agregar una nueva sección

1. **Define el schema** en `src/content.config.ts`
2. **Agrega la configuración** en `src/domain/section.ts`

### Uso recomendado para enlaces (ejemplo)

Evitar construir menús desde `sectionsConfig` en runtime. En su lugar, los builders deben producir `TranslationLink[]` y exponerse al CMS/layout.

Este enfoque delega la lógica de accesibilidad y fallback al dominio y mantiene las vistas simples.

### Nota sobre `sectionLoader`

`src/utils/sectionLoader.ts` es hoy un artefacto legacy que ya no se recomienda para las cargas principales; ver ADR-001 (reemplazada) y la documentación del nuevo enfoque (ADR-007).

## Archivos Relacionados

- **Config**: [src/domain/section.ts](../src/domain/section.ts) - Define configuración por sección
- **Schemas**: [`src/content.config.ts`](../src/content.config.ts) - Define estructura de datos
- **Componentes**:
  - [`src/components/BlogTalkPostView.astro`](../src/components/BlogTalkPostView.astro)
  - [`src/components/WorkProjectCommunityView.astro`](../src/components/WorkProjectCommunityView.astro)
  - [`src/components/WorkDateRange.astro`](../src/components/WorkDateRange.astro) - Renderiza periodo de fechas de trabajo (reutilizable)
  - [`src/components/ListWork.astro`](../src/components/ListWork.astro) - Usa `WorkDateRange` en el listado
- **Routing**: [`src/pages/[locale]/[section]/[...id].astro`](../src/pages/[locale]/[section]/[...id].astro)
- **Tests**: [`tests/unit/config/sections.test.ts`](../tests/unit/config/sections.test.ts)

## Mantenimiento

### Al modificar un schema

1. **Verifica** qué componente usa esa colección (consulta `sections.ts`)
2. **Actualiza** el componente correspondiente si es necesario
3. **Considera** si el cambio afecta otras colecciones que usan el mismo componente
4. **Ejecuta tests**: `npm run test:unit sections`

### Señales para refactorizar

- Si 2 colecciones del mismo componente divergen significativamente → Crear componente específico
- Si 2 componentes diferentes tienen >70% código duplicado → Fusionarlos
- Si un componente tiene demasiados condicionales por tipo → Dividirlo

## Conclusión

La arquitectura actual con 2 componentes para 5 colecciones representa el **nivel óptimo de abstracción** para este proyecto:

- ✅ **Mantenible**: Cambios globales solo tocan 1-2 archivos
- ✅ **Escalable**: Agregar secciones es trivial
- ✅ **Type-safe**: TypeScript garantiza configuración correcta
- ✅ **Predecible**: Fácil rastrear qué componente usa cada sección
- ✅ **Flexible**: Fácil crear componentes específicos cuando se necesite

---

Última actualización: Abril 2026
