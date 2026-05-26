# Convención para nombrar posts y hoja de ruta de actualización

## Estructura de archivos

Todo el contenido reside en (`/src/content`)

Las colecciones se agrupan por idioma `/src/content/<collection>/<locale>/`

Los nombres de archivos deben estar en minúsculas, sólo letras, números y guiones.

Según el tipo de colección el nombre de archivo puede tener un prefijo por fecha

| Colección | Estructura | Ejemplo |
| --- | --- | --- |
| blog | `YYYY-MM-DD-<slug>.md` | 2026-04-23-como-uso-linux-hoy.md |
| talk | `YYYY-MM-DD-<slug>.md` | 2017-01-30-test-unitarios.md |
| work | `<slug>.md` | coruniamericana.md |
| projects | `<slug>.md` | scot3004.md |
| community | `<slug>.md` | jamstack.md |

## Reglas generales

- Para las colecciones con fecha prefijada usa `YYYY-MM-DD-<slug>.md`.
  El `slug` debe estar en minúsculas, sólo letras, números y guiones.
- Para las colecciones con nombre directo usa `<slug>.md` (sin fecha). Mantén el `slug` estable y legible.
- Usa los campos existentes en el frontmatter, no añadir campos ad-hoc en frontmatter.
- Usa `draft: true` en el frontmatter para marcar traducciones en progreso;
  las plantillas y listados del sitio respetan este flag para mostrar banners y `noindex` cuando corresponda.
- No usar `postId` en frontmatter ni en objetos de contenido; el proyecto valida que no exista `postId`.
- Para enlazar traducciones utiliza `translationKey`, que es el identificador canónico del mensaje (nombre estable y semántico, independiente del nombre de fichero).
- `translationKey` debe referenciar la unidad de traducción y no el recurso; no incluir `postId`.
- Todo el contenido markdown debe ser revisado de forma estática (markdownlint)

## Actualizar contenido en entrada existente

Guía de acciones y criterios a seguir cuando se quiere actualizar una entrada:
decidir entre actualizar in-place o re-publicar según la colección y la magnitud del cambio.

- Para `talk`: son registros de presentaciones públicas;
  no se re-publican con nueva fecha. Actualiza in-place y documenta la revisión en el PR.
- Para `work`, `projects` y `community`: trata como contenido de perfil/portafolio y actualiza in-place.
- Para `blog` tienes 2 alternativas
  - ¿Es un cambio menor o correctivo? → actualizar in-place y documentar en el PR.
  - ¿Es una reescritura sustancial o quieres que el contenido aparezca como nuevo? → crear nueva entrada con fecha actual.

## Crear nueva entrada (re-publicar)

- Crear archivo nuevo con fecha en el nombre: `YYYY-MM-DD-<slug>.md` y frontmatter mínimo (title, date, tags, excerpt).
- Añadir redirect 301 desde la URL antigua al nuevo slug.
- Actualizar enlaces internos relevantes.
- Si hay traducciones antiguas,
  decide si mantenerlas, crear redirecciones lingüísticas apropiadas o actualizar traducciones y enlazarlas mediante `translationKey`.

## Actualizar in-place

Actualiza el contenido según las correcciones que necesites y considera adicionar un change_log en los siguientes casos

| Tipo | Cambio |
| --- | --- |
| typo | correcciones ortográficas o de puntuación que no cambian el significado ni metadatos. Úsalo solo cuando quieras mantener trazabilidad pública de correcciones menores |
| minor | cambios de contenido que mejoran claridad o corrigen errores puntuales (datos menores, enlaces rotos no críticos, ajustes en ejemplos) sin alterar la intención o estructura principal |
| translation | cambios relacionados con la versión traducida de una entrada |
| meta | cambios en frontmatter o metadatos (tags, canonical, `draft`, redirect, etc.) |
| rewrite | reescritura del post |

Ejemplo:

```yaml
change_log:
  - date: 2025-12-26
    author: 'Nombre'
    summary: 'Breve resumen público del cambio'
    type: 'typo|minor|rewrite|translation|meta'
    details: 'Opcional: enlace al PR o comentario'
```

## Redirecciones

Si un contenido es eliminado lo ideal es que la entrada que se deja de servir se redirija a algún sitio.

Añadir la regla 301 en `netlify.toml` o `_redirects`:

  ```toml
  [[redirects]]
  from = "/es/blog/2016-06-18-por-que-uso-npm"
  to = "/es/blog/2025-12-25-por-que-uso-npm"
  status = 301
  ```

No redirijas antiguas URLs en un idioma hacia contenido en otro idioma mediante 301 directo

## Añadir campos nuevos en el frontmatter

Todo campo agregado debe ser documentado y las plantillas actualizadas. En el caso de renombrar
campos, estos deben pasar por un proceso de ADR porque es un cambio mayor y breaking.

### Reglas de ordenamiento

- Primero: `priority` (entero opcional, por defecto tratado como `0`) — orden descendente (mayor primero).
- Segundo: fecha en orden descendente (más recientes primero).
  Se intenta primero con el campo `date` y, si no existe, con `startDate`.
- Entradas sin la fecha correspondiente se consideran de menor precedencia que las que sí la tienen.
- Empate final: `cleanId` (slug limpio) en orden alfabético ascendente para determinismo.

Nota: estas reglas son las aplicadas por la utilidad `sortByPriority` usada en generación de listados y rutas.
