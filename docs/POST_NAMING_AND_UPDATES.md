# Convención para nombrar posts y hoja de ruta de actualización

Este documento define las reglas y pasos a seguir al crear, actualizar o re-publicar entradas en el blog, con especial atención a i18n (traducciones), redirecciones y metadata. Su objetivo es evitar inconsistencias en el repositorio y facilitar operaciones repetibles.

## Resumen corto
- Nombre de fichero de post: `YYYY-MM-DD-<slug>.md` (ej: `2025-12-25-por-que-uso-npm.md`).
- Si re-publicas una entrada reescrita y quieres que aparezca como nueva: crea un nuevo fichero con la fecha nueva y deja el antiguo; añade una redirección 301 desde el URL antiguo al nuevo.
- Siempre actualizar/añadir metadata relevante: `translation_status`, `translation_origin` (si es traducción), `updated` (si solo es revisión), `canonical` (solo si forzas canonical distinto).

## Convención de nombres (slugs)

- Formato: `YYYY-MM-DD-<slug>.md` para todas las entradas en `src/content/<collection>/<locale>/`.
- El `slug` debe ser en minúsculas, solo letras, números, guiones y sin extensión. Evita duplicados.
- Para traducciones, los slugs pueden y deberían usar el idioma objetivo (p. ej. `2025-12-25-why-i-use-npm.md` para inglés) y deben mapearse mediante `translation_origin`.

Racional: mantener la fecha en el nombre facilita listar por orden cronológico, mantener historial y seguir convenciones comunes en sitios estáticos.

## ¿Crear nuevo post o actualizar el existente? — Hoja de ruta

1. Evaluación inicial:
   - Si los cambios son correctivos o pequeñas ampliaciones → actualizar in-place y añadir `updated: YYYY-MM-DD` en frontmatter.
   - Si la pieza es reescrita sustancialmente (nuevo enfoque, estructura, longitud) y quieres que aparezca como nueva → crear nueva entrada con fecha actual (ver pasos abajo).

2. Si decides crear nueva entrada (re-publicar):
   - Crear archivo nuevo con fecha en el nombre: `YYYY-MM-DD-<slug>.md` y frontmatter completo (title, date, tags, excerpt, translation_status: 'original')
   - Añadir redirect 301 desde la URL antigua al nuevo slug (ver sección "Redirecciones")
   - Actualizar enlaces internos destacados para apuntar al nuevo slug
   - Si existe una versión traducida antigua y no corresponde al nuevo contenido, decide si:
     - Mantener la versión antigua y dejar la 301 (la traducción no cambia de idioma, evita redirigir hacia otro idioma), o
     - Crear/actualizar la traducción y añadir `translation_origin` apuntando a la nueva entrada

3. Si decides actualizar in-place:
   - Mantén `date` original si quieres preservar historial, y añade `updated: YYYY-MM-DD` en frontmatter
   - Si quieres que la entrada suba en listados/feeds, crea nueva entrada en su lugar (ver punto 2)

4. Documentar la decisión en el commit/PR: incluir el rationale (por qué es nueva vs actualización) para el historial del repo.

## i18n — qué tener en cuenta

- `translation_status` describe el archivo donde está escrito (por archivo): `original`, `translated`, `draft`, `pending`, `partial`.
- `translation_origin` (objeto con `locale` e `id`) must point to the source entry id (id = filename without `.md`, including date prefix if present). Ejemplo:

```yaml
translation_status: 'translated'
translation_origin:
  locale: 'es'
  id: '2025-12-25-por-que-uso-npm'
```

- Si creas una nueva entrada que sustituye a una antigua y también hay traducciones, actualiza las traducciones para que apunten a la nueva entrada (`translation_origin.id`) o crea borradores nuevos según tu workflow.

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
translation_status: 'original'
```

- Re-publicación como nueva (usar fecha actual en `date` y en filename): idem anterior, además `updated` no es necesaria porque es nueva entrada.

- Update in-place (mantener date original):

```yaml
date: 2016-06-18
updated: 2025-12-25
```

## Checklist antes de mergear/puentear

1. ¿Filename sigue convención `YYYY-MM-DD-slug.md`? (sí/no)
2. ¿Frontmatter completo: title, date, tags, excerpt, translation_status? (sí/no)
3. Si es re-publicación: ¿existe redirect 301 desde la URL antigua al nuevo slug? (sí/no)
4. Si hay traducciones: ¿translation_origin actualizado en las traducciones? (sí/no)
5. ¿Se actualizaron enlaces internos relevantes? (sí/no)
6. Ejecutar scripts: `node ./scripts/check-translation-inconsistencies.js` y `node ./scripts/list-missing-translation-status.js` (sin errores)

## Herramientas y comandos útiles

- Crear borrador de traducción: `node ./scripts/create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>`
- Marcar archivos en lote: `node ./scripts/set-translation-status.js <status> <file1> [file2 ...]`
- Auto-marcar pares traducidos: `node ./scripts/auto-mark-translated.js`
- Detectar inconsistencias: `node ./scripts/check-translation-inconsistencies.js`
- Listar archivos sin status: `node ./scripts/list-missing-translation-status.js`

## Nota para colaboradores y para automatización (Copilot / scripts)

- Si usas IA o scripts para generar posts, asegúrate de que la salida incluya frontmatter con al menos `title`, `date`, `tags`, `excerpt` y `translation_status`.
- No crear posts nuevos sin prefijo de fecha en el filename; si una herramienta lo hace, ajusta el nombre antes de commitear.

---

Mantener esta convención ayuda a evitar regresiones y facilita la gestión de contenido multilingüe en el tiempo.
