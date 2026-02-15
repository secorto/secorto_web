# Giscus (comentarios) — cómo funciona y cómo probarlo

Resumen
-------

Este documento explica cómo se integra Giscus (el widget de comentarios) en el sitio, qué páginas lo usan, por qué se eligió Giscus y cómo se comportan las pruebas E2E respecto al widget (mock vs infraestructura real).

¿Qué es Giscus?
---------------

Giscus es un widget de comentarios que se integra en páginas estáticas inyectando un script (`https://giscus.app/client.js`) que monta un `iframe` con la interfaz de discusión ligada a un repositorio de GitHub.

Dónde se usa en este proyecto
-----------------------------

- El componente de integración es `src/components/Comments.astro`. Inserta un `div.comments` y carga `https://giscus.app/client.js` con los atributos necesarios (`data-repo`, `data-category`, `data-mapping`, `data-lang`, etc.)
- `Comments.astro` se incluye en la plantilla de detalle de contenidos: `src/pages/[locale]/[section]/[...id].astro`. Por tanto, Giscus aparece en las páginas de detalle (posts de blog, charlas, proyectos/works y páginas de comunidad) que usan el componente de detalle.

Por qué usar Giscus
-------------------

- Ligado a GitHub: almacena comentarios como issues/discussions en GitHub, lo que facilita moderación y mantenibilidad
- Ligero y fácil de integrar en sitios estáticos (simple script que se inyecta en la página)
- Soporta mapeos por ruta (`pathname`) y temas (se puede sincronizar con el tema del sitio)

Comportamiento en pruebas E2E
----------------------------

- Para evitar llamadas externas y mantener las pruebas rápidas y deterministas, el repositorio usa un mock durante las pruebas E2E.
- Helper relevante: `tests/e2e/helpers/mockGiscus.ts` — inyecta un `iframe.giscus-frame` simulado interceptando `https://giscus.app/client.js`.
- Decorador: `tests/e2e/helpers/whenMocked.ts` ejecuta los mocks solo si `process.env.REAL_THIRD_PARTY !== 'true'`. Si `REAL_THIRD_PARTY` está a `'true'`, los mocks NO se registran y las pruebas pueden interactuar con la infraestructura real.
- Uso común en tests: los helpers de terceros importan y usan `mockGiscus` de forma centralizada (`tests/e2e/helpers/mockThirdParty.ts`).

Cómo ejecutar pruebas contra la infraestructura real (manual)
---------------------------------------------------------

- Localmente, puedes ejecutar Playwright con la variable `REAL_THIRD_PARTY=true` para desactivar los mocks y permitir que el widget real se cargue (necesitarás conexión a Internet y configuración correcta del widget):

```bash
REAL_THIRD_PARTY=true npm run test:e2e
```

- En CI, es recomendable proporcionar una ruta controlada (por ejemplo, ejecutar contra un `NETLIFY_PREVIEW_URL`) y reservar la ejecución contra infra real a pipelines manuales o jobs con autorización (evita flakiness y llamadas externas en runs automáticos).

Soporte en el workflow de tests
--------------------------------

El pipeline de tests está en `.github/workflows/tests.yml`. Para detalles sobre los inputs expuestos (`real_third_party`, `base_url`, `folder`, `tag`) y cómo se usan en CI, consulta `docs/E2E_PARAMS.md`.

Cómo usarlo desde GitHub Actions UI:

1. Ve a la pestaña **Actions → Tests** en el repositorio
2. Haz clic en **Run workflow**
3. Ajusta `real_third_party` a `true` si quieres probar contra infra real y, opcionalmente, establece `base_url`, `folder` o `tag`
4. Ejecuta el workflow (recomendado sólo para ejecuciones manuales controladas)

Notas sobre estabilidad
----------------------

- Ejecutar contra infra real puede introducir latencia y flakiness — mantén los mocks activos para las ejecuciones automáticas de CI y reserva las ejecuciones reales para validaciones manuales o jobs específicos
- Localmente puedes replicar lo mismo exportando la variable de entorno y ejecutando Playwright:

```bash
REAL_THIRD_PARTY=true npm run test:e2e
```
