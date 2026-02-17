# Flujo de traducción

> Nota: recomendamos usar un campo booleano explícito `draft: true` en el frontmatter para marcar borradores (incluidas traducciones en progreso). La detección de borrador en plantillas y listados se basa en `draft`.

Este proyecto usa un flujo de traducción pragmático:

- El contenido se organiza por idioma en `src/content/<collection>/<locale>/`.
- Si quieres comenzar una traducción pero mantenerla como borrador, crea el archivo en la carpeta del idioma destino y añade `draft: true` en el frontmatter y `translation_origin` apuntando al original.

Herramienta rápida (desde la raíz del proyecto):

```
node ./scripts/create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>
```

Ejemplo:

```
node ./scripts/create-translation-draft.js talk es 2018-09-17-patrones-automatizacion-pruebas en
```

Esto copiará el archivo original a `src/content/talk/en/2018-09-17-patrones-automatizacion-pruebas.md` y lo marcará como borrador de traducción.

Comportamiento de la interfaz
- Las traducciones marcadas con `draft: true` muestran un banner y se marcan como `noindex`.
- La etiqueta `canonical` apunta al original (si `translation_origin` está presente).

 Cuando completes la traducción, elimina `draft: true` (o cámbialo a `false`).

 Esto hará que desaparezcan los banners/noindex y la página en el idioma destino se convierta en la versión activa y canónica (si no sobreescribes `canonical`).

Rationale — por qué este enfoque
---------------------------------

Este flujo busca equilibrio entre dos necesidades frecuentes en proyectos personales y pequeños blogs:

- Minimizar fricción: publicar contenido no debe obligarte a traducirlo inmediatamente. Crear y mantener traducciones es costoso en tiempo.
- Mantener buenas prácticas SEO: evitar que borradores o traducciones incompletas sean indexadas o compitan con el original.

En vez de forzar una decisión binaria (traducir ahora / no traducir nunca), el enfoque permite expresar el estado (draft/partial/pending) con el mínimo overhead: una copia de archivo por idioma y un par de campos opcionales en el frontmatter.

Ventajas
--------

- Transparencia: desde el propio repo y desde la UI ves qué posts están en proceso de traducción.
- Baja fricción: crear un borrador es una acción simple (helper script) y no bloquea la publicación original.
- Seguridad SEO: los borradores se marcan `noindex` y la canonical apunta al original, evitando contenido duplicado o indexación prematura.
- Evolutivo: si en el futuro necesitas un flujo editorial más complejo (colaboradores, asignaciones, deadlines), ya hay metadata para evolucionarlo.

Costes / trade-offs
-------------------

- Añade un pequeño campo adicional en frontmatter por post en caso de borrador.
- Requiere recordar usar el helper o crear la copia manualmente cuando empiezas una traducción (aunque el helper reduce la fricción).
 - Existe el riesgo de desincronización entre la metadata y el contenido real si no se actualiza cuando la traducción termina — mitigable con checks en build o con simples inspecciones periódicas.

Cuándo usarlo
--------------

- Te lo recomiendo si:
  - Publicas con cierta regularidad y quieres traducir algunos posts en el futuro
  - Quieres un control sencillo sobre qué está pendiente sin entrar en procesos pesados

- Considera no usarlo si:
  - Publicas muy raramente (1–2 posts por año) y no te importa una nota manual en el contenido
  - No te preocupa la indexación temporal de borradores

Flujo práctico (pasos rápidos)
--------------------------------

1. Para crear un borrador de traducción desde el original:

  ```bash
  node ./scripts/create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>
  # ejemplo: node ./scripts/create-translation-draft.js talk es 2018-09-17-patrones-automatizacion-pruebas en
  ```

  Esto crea `src/content/<collection>/<targetLocale>/<id>.md` con frontmatter añadido:

  ```yaml
  draft: true
  translation_origin:
    locale: 'es'
    id: '2018-09-17-patrones-automatizacion-pruebas'
  ```

2. Edita el archivo en `en/` y trabaja en la traducción. Puedes dejar contenido en el idioma original temporalmente — la web mostrará que es un borrador.

3. Mientras el post está `draft`:
   - La página en `en/` será accesible pero estará marcada como `noindex` y mostrará un banner indicando que es una traducción en borrador.
   - El selector de idioma (LanguagePicker) mostrará un marcador (✏️) para indicar el estado.

4. Cuando completes la traducción, elimina `draft: true` (o cámbialo a `false`).

Buenas prácticas
-----------------

- Usa el helper para crear borradores — evita errores en frontmatter.
- Si trabajas en muchas traducciones, añade una pequeña tarea `npm run check-translations` que liste posts con metadata inconsistente (puedo añadirlo si quieres).
- Documenta en el README del repo el patrón (este archivo ya cumple esa función).

Replicabilidad en otros proyectos
---------------------------------

El patrón es genérico: cualquier sitio estático que se organice por carpetas por idioma puede adoptar el mismo enfoque. Las piezas claves son:

- Archivar traducciones por carpeta de idioma (`/en/`, `/es/`).
- Metadata opcional en frontmatter para estado y origen.
- Template que respete `draft` y `translation_origin` (banner, noindex, canonical).
- Un helper ligero para crear borradores automáticamente.

Detección de inconsistencias
---------------------------

Cuando trabajas con contenido en varias carpetas por idioma es fácil que se produzcan incongruencias (por ejemplo: existe una versión en otro idioma pero falta `translation_origin`, o hay declaraciones contradictorias entre archivos). Aquí tienes cómo detectarlas y tratarlas.

Comprobaciones disponibles

- Pares traducidos detectables: `scripts/auto-mark-translated.js` intenta marcar automáticamente pares y añadir `translation_origin` cuando es claro
- Inconsistencias detalladas: `scripts/check-translation-inconsistencies.js` detecta casos como:
  - traducción sin `translation_origin`
  - archivo que declara `translation_origin` pero la relación con el origen no es consistente
  - archivo que tiene `translation_origin` pero la relación es ambigua

Uso rápido (desde la raíz del repo):

```bash
# intentar auto-marcar pares (añade translation_origin cuando es claro)
node ./scripts/auto-mark-translated.js

# revisar inconsistencias más finas
node ./scripts/check-translation-inconsistencies.js
```

Ejemplo de salida (posible):

```
Found 2 inconsistency(ies):
- { collection: 'blog', id: '2011-02-17-software-libre-vs-propietario.md', type: 'origin_but_not_translated', locale: 'en', origin: { locale: 'es', id: '2011-02-17-software-libre-vs-propietario.md' } }
- { collection: 'talk', id: '2019-10-22-blog-con-gatsby.md', type: 'translated_missing_origin', locale: 'en' }
```

Qué hacer según el tipo

- `translated_missing_origin`: abrir la traducción y añadir `translation_origin` apuntando al original
- `origin_but_not_translated`: la entrada declara `translation_origin` pero la metadata no refleja la relación correctamente
- `origin_present_both_original`: revisar manualmente si ambos son versiones independientes o si existe una relación de traducción

Si quieres, puedo ejecutar estas comprobaciones ahora y generar un pequeño report en `scripts/translation-inconsistencies-report.json` o aplicar correcciones automáticas en los casos no ambiguos.

Ejemplos mínimos de frontmatter (solo campos relevantes aquí):

```yaml
title: "Mi post"
date: 2022-07-11
draft: true
translation_origin:
  locale: 'es'
  id: 'mi-post'
```

Notas importantes:

- La metadata siempre describe el archivo donde está escrito (es un atributo por archivo). El archivo que es la traducción debe llevar `translation_origin` apuntando al original.
- Puedes dejar campos ausentes en archivos antiguos si no quieres migrarlos ahora; los scripts que incluimos ayudan a detectar y actualizar casos evidentes.
- Para posts creados primero en inglés aplica la misma convención: las traducciones deben usar `translation_origin.locale: 'en'` para indicar el origen.

Con esto tienes una solución pragmática, de bajo coste y fácil de transferir a otros repos.
