# Flujo de traducción (resumen)

Usa `draft: true` en el frontmatter para marcar traducciones en progreso; las plantillas y listados del sitio respetan este flag para mostrar banners y `noindex` cuando corresponda.

Organización y reglas mínimas

- Carpeta por idioma: `src/content/<collection>/<locale>/`
- Para la mayoría de casos no necesitas metadata adicional: si el fichero traducido mantiene el mismo `id`/slug que el original, no añadas nada más
- Solo cuando el slug/id difiera entre origen y destino (por ejemplo `why-npm` vs `por-que-npm`) añade `postId` en la traducción para apuntar al identificador canónico del original (nombre de fichero sin `.md`, incluir prefijo de fecha si aplica)

Ejemplo (usar `postId` solo si es necesario):

```yaml
title: "Mi traducción"
date: 2025-12-26
draft: true
# postId: '2025-12-25-por-que-uso-npm'  # opcional, solo si slug difiere
```

Comportamiento del sitio

- Traducciones con `draft: true` muestran un banner y se sirven con `noindex` hasta que se publique
- Controla la etiqueta `canonical` cuando una traducción pasa a ser la versión principal

Detección y consistencia

- Ejecuta checks automáticos para detectar `postId` que apunten a identificadores inexistentes o traducciones publicadas que aún tengan `draft: true`
- No es necesario migrar metadata legacy inmediatamente; las entradas históricas pueden convivir hasta una migración planificada

Notas finales

- Mantén la guía simple: `draft` para estado, `postId` solo para desambiguar slugs. Evita campos redundantes en contenido nuevo.

