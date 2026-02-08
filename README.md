# secorto.com fuentes

[![SeCOrTo web](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/97byr8/master&style=flat-square&logo=cypress)](https://cloud.cypress.io/projects/97byr8/runs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/414a6ef2-a3ea-48b0-85ba-ba7fbe9f20d1/deploy-status)](https://app.netlify.com/sites/secorto-astro/deploys)

Página personal de presentación de Sergio C. Orozco Torres

## Motivación

Practicar el desarrollo front-end para fortalecer habilidades y tener una plantilla base en caso que requiera iniciar otro desarrollo similar

## Objetivos

### Objetivo General

Desarrollar un sitio web informativo que demuestre los conocimientos y habilidades en desarrollo web de Sergio Orozco Torres

### Objetivos específicos

- Presentarme como persona y desarrollador web
- Compartir todo lo que he aprendido ya sea a traves del blog o del portafolio de experiencias
- Demostrar buenas practicas a través del código fuente de la página

## Guía de contribución

En este [enlace al archivo contributing.md](./docs/CONTRIBUTING.md) puedes ver como contribuir con el mejoramiento de este proyecto

## Guía de seguridad

En este [enlace al archivo security.md](./SECURITY.md) puedes ver como puedes reportar un issue de seguridad

## Copyright y licencia

Copyright 2023 Scot3004. Este código es lanzado bajo licencia [MIT](LICENSE), también puedes ver [los términos de la licencia MIT traducidos al español](LICENSE_es)

## 🧞 Comandos

Puedes ejecutar estos comandos en la carpeta raíz del proyecto:

| Command                   | Action                                                         |
| :------------------------ | :------------------------------------------------------------- |
| `npm install`             | Instala las dependencias                                       |
| `npm run dev`             | Ejecuta el dev server en `localhost:4321`                      |
| `npm run build`           | Construye el sitio para produccion en `./dist/`                |
| `npm run preview`         | Previsualiza la compilacion localmente                         |
| `npm run astro ...`       | Ejecuta commandos de Astro CLI como `astro add`, `astro check` |
| `npm run astro -- --help` | Obtener ayuda sobre Astro CLI                                  |

## Actualizar paquetes

Primero actualizar astro que su script de actualización ayuda para actualizar configuraciones

```
npx @astrojs/upgrade
```

Actualizar otros paquetes

```
npx npm-check-updates -u
```

## Herramientas en la nube

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/secorto/secorto_web)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/devbox/github/secorto/secorto_web)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/secorto/secorto_web?devcontainer_path=.devcontainer/.devcontainer/devcontainer.json)

**Integración Continua (Playwright + Netlify)**

- **Runner script:** El pipeline invoca `node .github/scripts/wait-netlify-runner.js`, que llama internamente a `runAndExit()` del script `wait-netlify.js` sólo cuando se ejecuta directamente. Esto evita problemas con exports mutables y mejora testabilidad.
- **COMMIT_ID:** El workflow inyecta `COMMIT_ID` con el SHA del PR (o del push). `wait-netlify` usa `COMMIT_ID` para encontrar el deploy que coincide con el commit y exporta `NETLIFY_PREVIEW_URL` al entorno de GitHub Actions.
- **Requisitos:** El runner requiere Node >= 20 (según `engines.node` en `package.json`) para el soporte global de `fetch` o que esté disponible en el entorno.

## Tests

[![Tests workflow](https://github.com/secorto/secorto_web/actions/workflows/tests.yml/badge.svg)](https://github.com/secorto/secorto_web/actions/workflows/tests.yml)

Ejecutar localmente:

| Command | Acción |
| :------ | :----- |
| `npm run test` | Ejecuta las pruebas E2E (Playwright/Cypress según configuración) |
| `npm run test:unit` | Ejecuta las pruebas unitarias con Vitest y genera cobertura |

En CI el workflow `Tests` corre dos jobs en paralelo:

- `unit-tests`: ejecuta `vitest --run --coverage` y sube el artifact `vitest-coverage/` (contiene `lcov.info`)
- `e2e-tests`: ejecuta las pruebas E2E con Playwright y sube el reporte `playwright-report/`

Así las unit y las E2E corren en paralelo y la cobertura la genera únicamente el job `unit-tests`.

Cómo ejecutar E2E localmente con variables de entorno

- `npm run test:e2e` — Ejecuta Playwright directamente (`npx playwright test`). Este comando no carga `.env` automáticamente; si necesitas pasar `NETLIFY_PREVIEW_URL` u otras variables, expórtalas en la misma línea o en tu entorno.
- `npm run test:e2e:env` — Ejecuta Playwright con `env-cmd` vía `npx` y la opción `-f .env`. Esta opción carga `.env` automáticamente y evita tener que exportar variables manualmente.

Ejemplos rápidos:

 - Exportar en shells POSIX y ejecutar (no requiere `env-cmd`):

```bash
NETLIFY_PREVIEW_URL=https://preview.example.com npm run test:e2e
```

 - En PowerShell:

```powershell
$Env:NETLIFY_PREVIEW_URL = 'https://preview.example.com'
npm run test:e2e
```

 - Usar el script que carga `.env` con `env-cmd` (no requiere instalación global):

```bash
npm run test:e2e:env
```

Nota: `test:e2e:env` usa `npx env-cmd` para cargar `.env`; `test:e2e` es minimalista y ejecuta Playwright directamente.
