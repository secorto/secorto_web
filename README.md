# Scot3004

[![SeCOrTo web](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/97byr8/master&style=flat-square&logo=cypress)](https://cloud.cypress.io/projects/97byr8/runs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/414a6ef2-a3ea-48b0-85ba-ba7fbe9f20d1/deploy-status)](https://app.netlify.com/sites/secorto-astro/deploys)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/secorto/secorto_web)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/devbox/github/secorto/secorto_web)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/secorto/secorto_web?devcontainer_path=.devcontainer/.devcontainer/devcontainer.json)

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

## 🚀 Estructura del proyecto

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Comandos

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                                         |
| :------------------------ | :------------------------------------------------------------- |
| `npm install`             | Instala las dependencias                                       |
| `npm run dev`             | Ejecuta el dev server en `localhost:4321`                      |
| `npm run build`           | Construye el sitio para produccion en `./dist/`                |
| `npm run preview`         | Previsualiza la compilacion localmente                         |
| `npm run astro ...`       | Ejecuta commandos de Astro CLI como `astro add`, `astro check` |
| `npm run astro -- --help` | Obtener ayuda sobre Astro CLI                                  |
