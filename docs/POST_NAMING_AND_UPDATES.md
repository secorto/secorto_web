# Convención para nombrar posts y hoja de ruta de actualización

Este documento define las reglas y pasos a seguir al crear, actualizar o re-publicar entradas en el blog, con especial atención a i18n (traducciones), redirecciones y metadata. Su objetivo es evitar inconsistencias en el repositorio y facilitar operaciones repetibles.

## Resumen corto
- Nombre de fichero de post: `YYYY-MM-DD-<slug>.md` (ej: `2025-12-25-por-que-uso-npm.md`).
- Si re-publicas una entrada reescrita y quieres que aparezca como nueva: crea un nuevo fichero con la fecha nueva y deja el antiguo; añade una redirección 301 desde el URL antiguo al nuevo.
- Siempre actualizar/añadir metadata relevante: `updated` (si solo es revisión). Usa `draft: true` para marcar borradores. Para enlaces entre traducciones y originales, usa `postId` en frontmatter cuando corresponda (ver sección i18n).

## Convención de nombres (slug de fichero)

- Formato: `YYYY-MM-DD-<slug>.md` para todas las entradas en `src/content/<collection>/<locale>/`.
- El `slug` debe ser en minúsculas, solo letras, números, guiones y sin extensión. Evita duplicados.
- Para traducciones, los slugs pueden y deberían usar el idioma objetivo (p. ej. `2025-12-25-why-i-use-npm.md` para inglés). Para mapear traducciones a su original, preferimos `postId` en frontmatter.

Racional: mantener la fecha en el nombre facilita listar por orden cronológico, mantener historial y seguir convenciones comunes en sitios estáticos.

## ¿Crear nuevo post o actualizar el existente? — Hoja de ruta

1. Evaluación inicial:
- Si los cambios son correctivos o pequeñas ampliaciones → actualizar in-place y añadir `updated: YYYY-MM-DD` en frontmatter.
- Si la pieza es reescrita sustancialmente (nuevo enfoque, estructura, longitud) y quieres que aparezca como nueva → crear nueva entrada con fecha actual (ver pasos abajo).

2. Si decides crear nueva entrada (re-publicar):
- Crear archivo nuevo con fecha en el nombre: `YYYY-MM-DD-<slug>.md` y frontmatter mínimo (title, date, tags, excerpt). Metadata histórica no es necesaria en contenido nuevo.
- Añadir redirect 301 desde la URL antigua al nuevo slug (ver sección "Redirecciones")
- Actualizar enlaces internos destacados para apuntar al nuevo slug
- Si existe una versión traducida antigua y no corresponde al nuevo contenido, decide si:
- Mantener la versión antigua y dejar la 301 (la traducción no cambia de idioma, evita redirigir hacia otro idioma), o
- Crear/actualizar la traducción y usar `postId` en la traducción para apuntar al identificador canónico de la nueva entrada (o crear borradores nuevos según tu workflow)

3. Si decides actualizar in-place:
- Mantén `date` original si quieres preservar historial, y añade `updated: YYYY-MM-DD` en frontmatter
- Si quieres que la entrada suba en listados/feeds, crea nueva entrada en su lugar (ver punto 2)

4. Documentar la decisión en el commit/PR: incluir el rationale (por qué es nueva vs actualización) para el historial del repo.

## i18n — qué tener en cuenta

- Nota: los casos legacy relacionados con traducciones están documentados en el ADR correspondiente; usa `postId` para enlazar traducciones con su original solo cuando sea necesario, y sigue usando `draft: true` para marcar borradores.

- Si un frontmatter contiene `postId`, este debe referirse al identificador canónico del original (por ejemplo el nombre de fichero sin `.md`, con prefijo de fecha si aplica). Usa `postId` principalmente cuando el slug difiere entre idiomas (por ejemplo `why-npm` vs `por-que-npm`):

```yaml
postId: '2025-12-25-por-que-uso-npm'
```

- Para compatibilidad histórica, si encuentras campos legacy en entradas antiguas, no es obligatorio migrarlas de inmediato; puedes actualizar traducciones nuevas para usar `postId` o dejar las entradas históricas tal cual hasta una migración planificada.

- Si creas una nueva entrada que sustituye a una antigua y también hay traducciones, actualiza las traducciones para que apunten al `postId` de la nueva entrada sólo cuando sea necesario (si los slugs no coinciden) o crea borradores nuevos según tu workflow.

## Redirecciones (Netlify / hosting)

- Añadir la regla 301 en `netlify.toml` o `_redirects`:

```toml
[[redirects]]
from = "/es/blog/2016-06-18-por-que-uso-npm"
to = "/es/blog/2025-12-25-por-que-uso-npm"
status = 301
```

- No redirijas antiguas URLs en un idioma hacia contenido en otro idioma mediante 301 directo: mejor mantener la misma ruta lingüística o actualizar traducciones para apunten al nuevo original.

## Frontmatter recomendado (plantillas)

- Original (nuevo post):

```yaml
title: "Mi título"
date: 2025-12-25
tags: ['dev']
excerpt: "Resumen corto"
# (Nota: metadata histórica no necesaria en nuevo contenido)
```

- Re-publicación como nueva (usar fecha actual en `date` y en filename): idem anterior, además `updated` no es necesaria porque es nueva entrada.

- Update in-place (mantener date original):

```yaml
date: 2016-06-18
updated: 2025-12-25
```

## Checklist antes de mergear/puentear

1. ¿Filename sigue convención `YYYY-MM-DD-slug.md`? (sí/no)
2. ¿Frontmatter completo: title, date, tags, excerpt? (sí/no)
3. Si es re-publicación: ¿existe redirect 301 desde la URL antigua al nuevo slug? (sí/no)
4. Si hay traducciones: ¿usar `postId` solo para desambiguar slugs cuando sea necesario? (sí/no)
5. ¿Se actualizaron enlaces internos relevantes? (sí/no)
6. Ejecutar comprobaciones de metadata y consistencia (localmente o con tus herramientas preferidas)

## change_log

Hemos optado por `change_log` como forma canónica de registrar hitos en el frontmatter. Es un array opcional con entradas estructuradas (`date`, `author`, `summary`, `type`, `locale`, `details`).

### Formato de ejemplo de `change_log`

```yaml
change_log:
  - date: 2025-12-26
    author: 'Sergio'
    summary: 'Reworked examples and clarified pnpm vs yarn'
    type: 'rewrite'
updated: 2025-12-26
```

### Nota para colaboradores y automatización

Si usas IA o herramientas para generar posts, asegúrate de que la salida incluya frontmatter con al menos `title`, `date`, `tags`, `excerpt`.

No crear posts nuevos sin prefijo de fecha en el filename; si una herramienta lo hace, ajusta el nombre antes de commitear.

---

Mantener esta convención ayuda a evitar regresiones y facilita la gestión de contenido multilingüe en el tiempo.
