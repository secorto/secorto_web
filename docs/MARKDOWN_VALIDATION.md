# Markdownlint: Validación de Markdown

Este documento contiene los comandos mínimos para validar Markdown en el proyecto.

Comandos

- Validar: `npm run lint:md`
- Corregir automáticamente: `npm run lint:md:fix`

Nota CI

En el pipeline de CI para `push` y `pull_request`
se ejecuta `npm run lint` (que incluye `lint:md`).
En ejecuciones manuales (`workflow_dispatch`), este paso puede omitirse.

Validación puntual

Para validar un archivo específico puedes usar `npx markdownlint-cli2 "path/to/file.md"`.

Configuración y contexto

La motivación y la configuración completa están documentadas en el ADR: [docs/adr/009-markdown-validation.md](adr/009-markdown-validation.md)
