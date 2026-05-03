# secorto.com fuentes

[![SeCOrTo web](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/97byr8/master&style=flat-square&logo=cypress)](https://cloud.cypress.io/projects/97byr8/runs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/414a6ef2-a3ea-48b0-85ba-ba7fbe9f20d1/deploy-status)](https://app.netlify.com/sites/secorto-astro/deploys)
[![Tests workflow](https://github.com/secorto/secorto_web/actions/workflows/tests.yml/badge.svg)](https://github.com/secorto/secorto_web/actions/workflows/tests.yml)

Página personal de presentación de Sergio C. Orozco Torres

## Propósito

Practicar desarrollo front-end, compartir conocimientos a través de un blog, y demostrar buenas prácticas en código fuente.

## 🚀 Inicio rápido

| Comando               | Acción                                            |
| :-------------------- | :------------------------------------------------ |
| `npm install`         | Instala dependencias                              |
| `npm run dev`         | Dev server en `localhost:4321`                    |
| `npm run build`       | Construye para producción en `./dist/`            |
| `npm run preview`     | Previsualiza la compilación localmente            |
| `npm run test`        | Ejecuta unitarias (Vitest) + E2E (Playwright)     |
| `npm run test:unit`   | Ejecuta pruebas unitarias (Vitest)                |
| `npm run test:e2e`    | Ejecuta pruebas E2E (Playwright)                  |

Ver más comandos y opciones de actualización en [docs/README.md](./docs/README.md).

## 📚 Documentación

La documentación se organiza en dos espacios:

- **[docs/](./docs/)** — Guías técnicas, arquitectura, procesos y flujos de trabajo
- **[docs/adr/](./docs/adr/)** — Architecture Decision Records (ADRs) que documentan decisiones clave

Consulta [docs/README.md](./docs/README.md) para el índice completo de documentación.

## 🤝 Contribuir

Lee [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) para conocer cómo contribuir.

## 🔒 Seguridad

Consulta [SECURITY.md](./SECURITY.md) para reportar vulnerabilidades.

## 🔧 Desarrollo

- **Framework:** Astro con TypeScript
- **Testing:** Playwright (E2E) + Vitest (unitarias)
- **Estilo:** ESLint, sin puntos y coma (a menos que sea necesario)
- **i18n:** Soporte multilingüe; lee [docs/TRANSLATION_WORKFLOW.md](./docs/TRANSLATION_WORKFLOW.md)

Para instrucciones de desarrollo en dev container, consulta [docs/DEVCONTAINER.md](./docs/DEVCONTAINER.md).

## 📄 Licencia

Copyright 2023 Scot3004. Bajo licencia [MIT](LICENSE) ([versión en español](LICENSE_es)).

---

**Herramientas en la nube:**
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/secorto/secorto_web)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/devbox/github/secorto/secorto_web)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/secorto/secorto_web?devcontainer_path=.devcontainer/.devcontainer/devcontainer.json)
