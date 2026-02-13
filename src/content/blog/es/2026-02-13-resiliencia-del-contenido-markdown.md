---
title: "Por qué el contenido en Markdown sobrevivió tres reescrituras"
date: 2026-02-13
summary: "Cómo mantener contenido portable: frontmatter, convenciones y estrategias para que tus posts vivan más allá del framework."
draft: true
tags: [markdown, content, jamstack, portability]
lang: es
---

## Introducción

Una de las sorpresas más agradables al revisar la historia del sitio fue
ver que los posts en Markdown prácticamente no necesitaron reescrituras
complejas: el contenido sobrevivió a Jekyll, Gatsby y Astro.

## Por qué Markdown es tan resistente

- **Texto plano**: no depende de serializadores binarios ni formatos
  propietarios.
- **Frontmatter estándar**: `title`, `date`, `tags`, `summary`, `draft` son
  suficientes para reconstruir páginas en casi cualquier SSG.
- **Separación de contenido y presentación**: las plantillas cambian,
  pero el cuerpo del post permanece.

## Convenciones que facilitaban la migración

- **Slugs predictibles**: `YYYY-MM-DD-slug.md` facilita el mapping
- **Metadatos estandarizados**: evitar campos específicos del framework
  (por ejemplo `layout: minimal-mistakes`) y preferir campos semánticos
- **Assets relativos**: `img/` y `resources/` con rutas relativas

## Estrategias prácticas al migrar

1. **Exportar todo el contenido a un directorio común** (ej. `content/`)
2. **Normalizar frontmatter** con un script Node (convertir campos
   obsoletos y validar schema con Zod)
3. **Generar un `redirects` map** si cambian slugs
4. **Mantener backups** y tags de commits claros

## Ejemplo: script de normalización (pseudocódigo)

```js
// read file
// parse frontmatter
// map old fields -> new fields
// validate with zod
// write to new location
```

## Conclusión

Para proyectos con contenido importante, invertir en convenciones de
frontmatter y scripts de normalización te ahorra semanas en migraciones.
Markdown no es la panacea, pero es la opción práctica y económica para
mantener contenido vivo.

---

> Draft: puedo generar el script de normalización que use `gray-matter` +
> `zod` si quieres un ejemplo ejecutable.
