# Parámetros E2E y uso en CI

Este documento lista y explica los inputs que acepta el workflow de tests
(`.github/workflows/tests.yml`) y cómo se usan en el pipeline para ejecutar pruebas E2E.

## Inputs expuestos en `workflow_dispatch`

- `base_url` (string)
  - URL base a usar para las pruebas (por defecto `https://secorto.com`).
    Es la opción más importante: controla el host objetivo de las pruebas.
- `folder` (string)
  - Carpeta de tests (p. ej. `e2e`, `e2e/functional`) para ejecutar un subconjunto de pruebas.
    Útil para acotar alcance cuando se depura una sección concreta.
- `tag` (string)
  - Tag/grep para filtrar tests por etiquetas o descriptores dentro del `folder` o del conjunto completo.
- `real_third_party` (boolean)
  - Si `true` => el job exporta `REAL_THIRD_PARTY=true` y los mocks de terceros
    (p. ej. `mockGiscus`) NO se registrarán. Usar solo en ejecuciones manuales controladas,
    ya que depende de servicios externos y puede introducir flakiness.

Nota sobre tipos en la UI: GitHub Actions soporta `type: boolean` para inputs,
lo que renderiza un checkbox en la UI; recomendamos usarlo para `real_third_party` para hacerlo claramente visible.

## Variables de entorno por contexto

No todas las variables de entorno del repositorio responden al mismo problema. Conviene distinguirlas por contexto:

### 1 Variables del runner de Netlify / helper de preview

Las usa el helper en `packages/wait-netlify` y el flujo de CI para resolver una URL pública real:

- `NETLIFY_AUTH_TOKEN` — token de Netlify con el mínimo permiso necesario
- `NETLIFY_SITE_ID` — identificador del sitio de Netlify
- `GITHUB_ENV` — ruta del archivo de entorno del runner de GitHub Actions
- `PR_BRANCH` o `GITHUB_REF_NAME` — rama usada para localizar el deploy preview
- `COMMIT_ID` — SHA exacto del commit a validar; ayuda a filtrar el deploy correcto
- `GITHUB_REF` — referencia del checkout cuando el runner necesita inferir la rama

Estas variables son del helper de despliegue, no del driver de pruebas E2E.

### 2 Variables del suite E2E / runtime de tests

Las usa la aplicación de tests para decidir qué entorno y qué modo ejecutar:

- `NETLIFY_PREVIEW_URL` — URL exportada por el helper de preview cuando hay un deploy válido
- `BASE_URL` — override manual para apuntar a un entorno concreto
- `REAL_THIRD_PARTY` — si vale `true`, se omiten los mocks y se usan servicios externos reales
- `A11Y_ALL_LANGUAGES` — si vale `true`, la colección A11y incluye todas las locales en lugar de filtrar solo la locale por defecto

La convención general es separar claramente qué variable pertenece a CI/deploy y qué variable pertenece a la ejecución de tests. Eso evita mezclar requisitos de infraestructura con requisitos de validación funcional.

## Comportamiento en el pipeline

- Los navegadores de Playwright se instalan en el job antes de ejecutar las pruebas (`npx playwright install --with-deps`).
- Si el runner detecta un Netlify preview (PR o push a main/master),
  el helper del paquete `packages/wait-netlify/src/wait-netlify-runner.js` intentará obtener la URL de preview
  y exportará `NETLIFY_PREVIEW_URL` al entorno.
  El paso de ejecución de Playwright usa esa variable cuando está presente.
- `REAL_THIRD_PARTY` controla si los mocks de terceros se saltan.
  Por defecto los mocks están activos para mantener las ejecuciones automáticas de CI rápidas y deterministas.

## Netlify preview vs `base_url`

- `NETLIFY_PREVIEW_URL` (exportada por el runner):
  - Es la URL del deploy de preview que Netlify crea para un PR o para ciertos pushes.
    El helper de `packages/wait-netlify` espera al deploy que corresponda al `COMMIT_ID` y,
    cuando lo encuentra, exporta `NETLIFY_PREVIEW_URL` al entorno del job.
  - Ventaja: pruebas contra la versión desplegada exactamente igual que la que verán los revisores/QA en el deploy preview.
  - Uso recomendado: en ejecuciones de PR o cuando quieras validar el deploy asociado al commit.

- `base_url` (input del workflow / fallback):
  - Es una URL que el usuario puede pasar manualmente al ejecutar el workflow (o queda en el valor por defecto `https://secorto.com`).
  - Ventaja: control directo desde la UI para apuntar a cualquier host
    (staging, local tunneling, etc.) sin depender de Netlify.
  - Uso recomendado: cuando quieras ejecutar pruebas contra un host específico
    y no dependes del deploy preview automatizado.

## Comportamiento combinado

- El paso de ejecución de tests prioriza `NETLIFY_PREVIEW_URL` si está presente (exportada por el runner).
  Si no hay preview, usa `base_url` como URL objetivo.
- Recomendación práctica: en PRs confía en `NETLIFY_PREVIEW_URL` (si el runner lo obtiene) para validar el deploy;
  cuando ejecutes manualmente desde la UI usa `base_url` para apuntar a un host concreto.

## Ejemplo de uso desde la UI

1. Actions → Tests → Run workflow
2. Ajusta `base_url`, `folder` y `tag` según necesites (prioriza `base_url` para apuntar al host correcto)
3. Marca `real_third_party` (checkbox) solo si quieres ejecutar contra servicios reales

## Buenas prácticas

- Mantén la mayoría de ejecuciones CI usando mocks;
  reserva `real_third_party=true` para verificaciones manuales o jobs especiales
- Evita ejecutar frecuentes jobs con `REAL_THIRD_PARTY=true` porque dependen de servicios externos
  y pueden ser más lentos o frágiles
