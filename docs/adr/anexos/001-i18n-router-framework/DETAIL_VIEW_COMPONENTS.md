# Arquitectura de vistas de detalle

Este documento resume la estrategia actual de renderizado para las páginas de detalle.
La intención no es describir un mapa de feature-by-feature del pasado, sino la forma
real en que hoy se resuelven los detalles de contenido en la app.

## Resumen actual

La app usa dos familias de vistas de detalle para las cinco colecciones:

- `BlogTalkPostView`: para `blog` y `talk`
- `WorkProjectCommunityView`: para `work`, `projects` y `community`

La diferencia real hoy ya no está en la ausencia de tags: todas las colecciones
comparten `tags` como campo principal del contenido. El factor diferenciador sigue
siendo el tipo de contenido y la estructura de metadatos, no la presencia o ausencia
 de tags.

## Regla de renderizado

La resolución ocurre en `DetailContent.astro` mediante un mapa por sección:

```ts
const detailComponentMap = {
  blog: BlogTalkPostView,
  talk: BlogTalkPostView,
  work: WorkProjectCommunityView,
  projects: WorkProjectCommunityView,
  community: WorkProjectCommunityView,
} as const
```

Ese wrapper hace dos cosas:

1. decide qué vista usar según la sección
2. renderiza los tags compartidos antes del contenido principal

```astro
<Tags section={section} locale={locale} tags={entry.data.tags} />
<DetailComponent locale={locale} entry={entry} Content={Content} />
```

Esto hace que la capa de UI siga siendo simple y consistente: el detalle se compone
por un shell común + una vista específica según la colección.

## Qué sigue siendo distinto por colección

### `BlogTalkPostView`

Cubre `blog` y `talk`.

Tiene un patrón editorial con:

- fecha
- imagen destacada o video
- excerpt
- contenido markdown
- galería
- slideshow para talk

### `WorkProjectCommunityView`

Cubre `work`, `projects` y `community`.

Tiene un patrón de portfolio/profesional con:

- role
- responsibilities
- rango de fechas para `work`
- website opcional
- excerpt
- contenido markdown
- galería

## La parte que cambió en la implementación actual

La diferencia más importante respecto al documento previo es que hoy todas las
colecciones ya exigen `tags` en el schema base:

```ts
const createBasePostSchema = (imageHelper: ImageFunction) => z.object({
  title: z.string(),
  tags: z.array(TagSchema).nonempty('Tags are required'),
  image: imageHelper().optional(),
  ...
})
```

Esto hace que los tags sean un eje común de contenido y no una característica solo
de blog/talk.

Por eso, el renderizado real hoy es:

- todos los detalles tienen tags
- el wrapper `DetailContent` renderiza los tags para todas las secciones
- cada subvista decide solo cómo presentar el resto del contenido

## Estructura actual

Los archivos principales son:

- `src/components/detail/DetailContent.astro`
- `src/components/detail/BlogTalkPostView.astro`
- `src/components/detail/WorkProjectCommunityView.astro`
- `src/content.config.ts`

La idea de diseño sigue siendo la misma:

- evitar duplicación de UI
- mantener dos patrones de detalle claros
- centralizar la elección por sección en un solo punto

## Conclusión

La arquitectura actual conserva la separación útil entre dos familias de detalle,
pero con una diferencia importante: los tags ya no son una excepción del blog, sino
un rasgo compartido de casi todo el contenido.

La regla que sigue siendo válida es esta:

- un detalle se resuelve por sección
- la vista base decide el tipo de layout
- el contenido específico se define dentro de cada subvista
- los tags se renderizan de forma uniforme y compartida
- ✅ **Flexible**: Fácil crear componentes específicos cuando se necesite
