# Parámetros E2E y uso en CI

Resumen rápido
-------------

Este documento lista y explica los inputs que acepta el workflow de tests (`.github/workflows/tests.yml`) y cómo se usan en el pipeline para ejecutar pruebas E2E.

Inputs expuestos en `workflow_dispatch`
-------------------------------------

- `base_url` (string)
  - URL base a usar para las pruebas (por defecto `https://secorto.com`). Es la opción más importante: controla el host objetivo de las pruebas.
- `folder` (string)
  - Carpeta de tests (p. ej. `e2e`, `e2e/smoke`) para ejecutar un subconjunto de pruebas. Útil para acotar alcance cuando se depura una sección concreta.
- `tag` (string)
  - Tag/grep para filtrar tests por etiquetas o descriptores dentro del `folder` o del conjunto completo.
- `real_third_party` (boolean)
  - Si `true` => el job exporta `REAL_THIRD_PARTY=true` y los mocks de terceros (p. ej. `mockGiscus`) NO se registrarán. Usar solo en ejecuciones manuales controladas, ya que depende de servicios externos y puede introducir flakiness.

Nota sobre tipos en la UI: GitHub Actions soporta `type: boolean` para inputs, lo que renderiza un checkbox en la UI; recomendamos usarlo para `real_third_party` para hacerlo claramente visible.

Comportamiento en el pipeline
-----------------------------

- Los navegadores de Playwright se instalan en el job antes de ejecutar las pruebas (`npx playwright install --with-deps`).
- Si el runner detecta un Netlify preview (PR o push a main/master), el script `.github/scripts/wait-netlify-runner.js` intentará obtener la URL de preview y exportará `NETLIFY_PREVIEW_URL` al entorno. El paso de ejecución de Playwright usa esa variable cuando está presente.
- `REAL_THIRD_PARTY` controla si los mocks de terceros se saltan. Por defecto los mocks están activos para mantener las ejecuciones automáticas de CI rápidas y deterministas.

Netlify preview vs `base_url`
-----------------------------

- `NETLIFY_PREVIEW_URL` (exportada por el runner):
  - Es la URL del deploy de preview que Netlify crea para un PR o para ciertos pushes. El script `.github/scripts/wait-netlify-runner.js` espera al deploy que corresponda al `COMMIT_ID` y, cuando lo encuentra, exporta `NETLIFY_PREVIEW_URL` al entorno del job.
  - Ventaja: pruebas contra la versión desplegada exactamente igual que la que verán los revisores/QA en el deploy preview.
  - Uso recomendado: en ejecuciones de PR o cuando quieras validar el deploy asociado al commit.

- `base_url` (input del workflow / fallback):
  - Es una URL que el usuario puede pasar manualmente al ejecutar el workflow (o queda en el valor por defecto `https://secorto.com`).
  - Ventaja: control directo desde la UI para apuntar a cualquier host (staging, local tunneling, etc.) sin depender de Netlify.
  - Uso recomendado: cuando quieras ejecutar pruebas contra un host específico y no dependes del deploy preview automatizado.

Comportamiento combinado
------------------------

- El paso de ejecución de tests prioriza `NETLIFY_PREVIEW_URL` si está presente (exportada por el runner). Si no hay preview, usa `base_url` como URL objetivo.
- Recomendación práctica: en PRs confía en `NETLIFY_PREVIEW_URL` (si el runner lo obtiene) para validar el deploy; cuando ejecutes manualmente desde la UI usa `base_url` para apuntar a un host concreto.

Ejemplo de uso desde la UI
-------------------------

1. Actions → Tests → Run workflow
2. Ajusta `base_url`, `folder` y `tag` según necesites (prioriza `base_url` para apuntar al host correcto)
3. Marca `real_third_party` (checkbox) solo si quieres ejecutar contra servicios reales

Buenas prácticas
---------------

- Mantén la mayoría de ejecuciones CI usando mocks; reserva `real_third_party=true` para verificaciones manuales o jobs especiales
- Evita ejecutar frecuentes jobs con `REAL_THIRD_PARTY=true` porque dependen de servicios externos y pueden ser más lentos o frágiles
