# Arquitectura de Vistas de Detalle

Este documento explica la estrategia de componentes para las vistas de detalle de contenido y cómo se relacionan con los content types.

## Resumen Ejecutivo

El proyecto utiliza **2 componentes de vista de detalle** para renderizar **5 colecciones diferentes**, basándose en las características compartidas de sus schemas:

- **`BlogTalkPostView`**: Para `blog` y `talk` (contenido con tags y fechas)
- **`WorkProjectCommunityView`**: Para `work`, `projects` y `community` (contenido profesional con roles)

## Principio de Diseño

**Single Source of Truth**: `SectionConfig` en [`src/config/sections.ts`](../src/config/sections.ts) define qué componente usa cada sección mediante el campo `detailComponent`.

## Mapeo de Colecciones a Componentes

### BlogTalkPostView

**Colecciones:** `blog`, `talk`

**Características distintivas:**
- ✅ Sistema de tags (`tags: string[]`)
- ✅ Fechas de publicación (`date: Date`)
- ✅ Soporte para video/slides (talk)
- ✅ Orientado a contenido cronológico

**Schema blog:**
```typescript
{
  date: Date,
  tags?: string[],
  title: string,
  image?: ImageMetadata,
  excerpt?: string,
  gallery?: Array<{ image, alt }>
}
```

**Schema talk:**
```typescript
{
  date: Date,
  tags?: string[],
  title: string,
  image: ImageMetadata,
  excerpt?: string,
  comunidad: string,
  video?: string,
  slide: string,
  gallery?: Array<{ image, alt }>
}
```

**Configuración:**
```typescript
sectionsConfig.blog.detailComponent = 'BlogTalkPostView'
sectionsConfig.talk.detailComponent = 'BlogTalkPostView'
```

### WorkProjectCommunityView

**Colecciones:** `work`, `projects`, `community`

**Características distintivas:**
- ✅ Información de rol (`role: string`)
- ✅ Responsabilidades (`responsibilities: string`)
- ✅ Enlaces a sitios web (`website?: string`)
- ✅ Periodo de trabajo (`startDate` + `endDate?`) - Renderizado con `WorkDateRange` component
- ✅ Orientado a portafolio profesional
- ❌ Sin sistema de tags

**Schema work:**
```typescript
{
  role: string,
  responsibilities: string,
  website: string,
  startDate: Date,
  endDate?: Date,
  image: ImageMetadata,
  excerpt: string,
  gallery?: Array<{ image, alt }>
}
```

**Schema projects:**
```typescript
{
  role: string,
  responsibilities: string,
  website?: string,
  image: ImageMetadata,
  excerpt: string,
  gallery?: Array<{ image, alt }>
}
```

**Schema community:**
```typescript
{
  role: string,
  responsibilities: string,
  website?: string,
  image: ImageMetadata,
  excerpt: string,
  gallery?: Array<{ image, alt }>
}
```

**Configuración:**
```typescript
sectionsConfig.work.detailComponent = 'WorkProjectCommunityView'
sectionsConfig.project.detailComponent = 'WorkProjectCommunityView'
sectionsConfig.community.detailComponent = 'WorkProjectCommunityView'
```

## Tabla de Features por Componente

| Feature | BlogTalkPostView | WorkProjectCommunityView |
|---------|------------------|--------------------------|
| **Tags** | ✅ Sí | ❌ No |
| **Date (publicación)** | ✅ Sí | ❌ No |
| **Period (startDate-endDate)** | ❌ No | ✅ Sí (work) |
| **Role** | ❌ No | ✅ Sí |
| **Responsibilities** | ❌ No | ✅ Sí |
| **Website link** | ❌ No | ✅ Sí |
| **Video/Slides** | ✅ Sí (talk) | ❌ No |
| **Image** | ✅ Sí | ✅ Sí |
| **Excerpt** | ✅ Sí | ✅ Sí |
| **Gallery** | ✅ Sí | ✅ Sí |
| **Markdown Content** | ✅ Sí | ✅ Sí |

## Flujo de Renderizado

1. **Ruta dinámica**: `src/pages/[locale]/[section]/[...id].astro`
2. **Determina sección**: Lee `section` param y lo mapea a `SectionConfig`
3. **Lee configuración**: `config.detailComponent` indica qué componente usar
4. **Renderiza condicionalmente**:
   ```astro
   {config.detailComponent === 'BlogTalkPostView' ? (
     <BlogTalkPostView ... />
   ) : (
     <WorkProjectCommunityView ... />
   )}
   ```

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

## Extensibilidad

### Para agregar una nueva sección:

1. **Define el schema** en `src/content.config.ts`
2. **Agrega la configuración** en `src/config/sections.ts`:
   ```typescript
   newSection: {
     collection: 'newcollection',
     detailComponent: 'BlogTalkPostView' | 'WorkProjectCommunityView',
     // ... otros campos
   }
   ```
3. **Listo** - El sistema lo manejará automáticamente

### Para crear un componente de vista nuevo:

1. **Crea el componente**: `src/components/CustomView.astro`
2. **Actualiza el type**: 
   ```typescript
   detailComponent: 'BlogTalkPostView' | 'WorkProjectCommunityView' | 'CustomView'
   ```
3. **Agrega condición** en `[...id].astro`:
   ```astro
   {config.detailComponent === 'CustomView' ? (
     <CustomView ... />
   ) : config.detailComponent === 'BlogTalkPostView' ? (
     <BlogTalkPostView ... />
   ) : (
     <WorkProjectCommunityView ... />
   )}
   ```

## Archivos Relacionados

- **Config**: [`src/config/sections.ts`](../src/config/sections.ts) - Define `detailComponent` por sección
- **Schemas**: [`src/content.config.ts`](../src/content.config.ts) - Define estructura de datos
- **Componentes**: 
  - [`src/components/BlogTalkPostView.astro`](../src/components/BlogTalkPostView.astro)
  - [`src/components/WorkProjectCommunityView.astro`](../src/components/WorkProjectCommunityView.astro)
  - [`src/components/WorkDateRange.astro`](../src/components/WorkDateRange.astro) - Renderiza periodo de fechas de trabajo (reutilizable)
  - [`src/components/ListWork.astro`](../src/components/ListWork.astro) - Usa `WorkDateRange` en el listado
- **Routing**: [`src/pages/[locale]/[section]/[...id].astro`](../src/pages/[locale]/[section]/[...id].astro)
- **Tests**: [`tests/unit/config/sections.test.ts`](../tests/unit/config/sections.test.ts)

## Mantenimiento

### Al modificar un schema:

1. **Verifica** qué componente usa esa colección (consulta `sections.ts`)
2. **Actualiza** el componente correspondiente si es necesario
3. **Considera** si el cambio afecta otras colecciones que usan el mismo componente
4. **Ejecuta tests**: `npm run test:unit sections`

### Señales para refactorizar:

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

*Última actualización: Febrero 2026*
