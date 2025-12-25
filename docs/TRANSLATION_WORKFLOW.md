# Translation workflow

> Nota: en este repositorio `translation_status` es un campo obligatorio en el frontmatter de las entradas (colecciones como `blog` y `talk`). El build fallará si falta. Define uno de los valores permitidos: `translated`, `draft`, `partial`, `pending` o `original`.

This project uses a pragmatic translation workflow:

- Content is stored per-locale under `src/content/<collection>/<locale>/`.
- If you want to start a translation but keep it as a draft, create the file under the target locale and set `translation_status: 'draft'` in the frontmatter and `translation_origin` pointing to the original.

Quick helper (from project root):

```
node ./scripts/create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>
```

Example:

```
node ./scripts/create-translation-draft.js talk es 2018-09-17-patrones-automatizacion-pruebas en
```

This will copy the original file into `src/content/talk/en/2018-09-17-patrones-automatizacion-pruebas.md` and mark it as a draft translation.

UI behavior
- Draft translations show a notice banner and are marked `noindex`.
- Canonical points to the original (if provided in `translation_origin`).

If you later finish the translation, update `translation_status: 'translated'` and fill the English content.

Rationale — por qué este enfoque
---------------------------------

Este workflow busca equilibrio entre dos necesidades frecuentes en proyectos personales y pequeños blogs:

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
- Existe el riesgo de desincronización entre `translation_status` y el contenido real si no se actualiza cuando la traducción termina — mitigable con checks en build o con simples inspecciones periódicas.

Cuándo usarlo
--------------

- Te lo recomiendo si:
	- Publicas con cierta regularidad y quieres traducir algunos posts en el futuro
	- Quieres un control sencillo sobre qué está pendiente sin entrar en procesos pesados

- Considera no usarlo si:
	- Publicas muy raramente (1–2 posts por año) y no te importa una nota manual en el contenido
	- No te preocupa la indexación temporal de borradores

Workflow práctico (pasos rápidos)
--------------------------------

1. Para crear un borrador de traducción desde el original:

	 ```bash
	 node ./scripts/create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>
	 # ejemplo: node ./scripts/create-translation-draft.js talk es 2018-09-17-patrones-automatizacion-pruebas en
	 ```

	 Esto crea `src/content/<collection>/<targetLocale>/<id>.md` con frontmatter añadido:

	 ```yaml
	 translation_status: 'draft'
	 translation_origin:
		 locale: 'es'
		 id: '2018-09-17-patrones-automatizacion-pruebas'
	 ```

2. Edita el archivo en `en/` y trabaja en la traducción. Puedes dejar contenido en el idioma original temporalmente — la web mostrará que es un borrador.

3. Mientras el post está `draft`:
	 - La página en `en/` será accesible pero estará marcada como `noindex` y mostrará un banner indicando que es una traducción en borrador.
	 - El selector de idioma (LanguagePicker) mostrará un marcador (✏️) para indicar el estado.

4. Cuando completes la traducción, actualiza el frontmatter a:

	 ```yaml
	 translation_status: 'translated'
	 ```

	 Esto hará que desaparezcan los banners/noindex y la página en `en/` se convierta en la versión activa y canónica (si no sobreescribes canonical).

Buenas prácticas
-----------------

- Usa el helper para crear borradores — evita errores en frontmatter.
- Si trabajas en muchas traducciones, añade una pequeña tarea `npm run check-translations` que liste posts con `translation_status` inconsistentes (puedo añadirlo si quieres).
- Documenta en el README del repo el patrón (este archivo ya cumple esa función).

Replicabilidad en otros proyectos
---------------------------------

El patrón es genérico: cualquier sitio estático que se organice por carpetas por idioma puede adoptar el mismo enfoque. Las piezas claves son:

- Archivar traducciones por carpeta de idioma (`/en/`, `/es/`).
- Metadata opcional en frontmatter para estado y origen.
- Template que respete `translation_status` (banner, noindex, canonical).
- Un helper ligero para crear borradores automáticamente.

Con esto tienes una solución pragmática, de bajo coste y fácil de transferir a otros repos.
