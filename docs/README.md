# Documentación del proyecto

En esta carpeta `docs/` se agrupan guías, recursos técnicos y registros de decisiones del proyecto.

## Índice por sección

### Fundamentales

- [CONTRIBUTING.md](CONTRIBUTING.md) — Guía de contribución y convenciones de desarrollo
- [README.md](README.md) — Este archivo; índice y organización de la documentación

### Arquitectura y diseño

- [DETAIL_VIEW_ARCHITECTURE.md](DETAIL_VIEW_ARCHITECTURE.md) —
  Arquitectura de vistas de detalle (blog, charlas, trabajo, proyectos, comunidad)
- [GISCUS.md](GISCUS.md) — Integración de comentarios con Giscus

### Procesos y flujos

- [TESTING_STRATEGY.md](TESTING_STRATEGY.md) — Estrategia de pruebas (E2E con Playwright, unitarias con Vitest)
- [TRANSLATION_WORKFLOW.md](TRANSLATION_WORKFLOW.md) — Flujo de trabajo para traducciones y soporte multilingüe
- [POST_NAMING_AND_UPDATES.md](POST_NAMING_AND_UPDATES.md) — Convenciones de nombres para posts y procedimientos de actualización
- [MARKDOWN_VALIDATION.md](MARKDOWN_VALIDATION.md) — Validación de Markdown (linting y reglas de formato)

### Operativo y configuración

- [DEVCONTAINER.md](DEVCONTAINER.md) — Configuración de Dev Container para desarrollo consistente
- [E2E_PARAMS.md](E2E_PARAMS.md) — Parámetros y configuración para tests E2E

### Deuda técnica y seguimiento

- [tech-debt.md](tech-debt.md) — Registro centralizado de deuda técnica y TODOs de arquitectura

### Decisiones arquitectónicas (ADRs)

- [adr/](adr/) — Carpeta que contiene todas las **Architecture Decision Records**
  - [adr/README.md](adr/README.md) — Índice de ADRs, convenciones y procedimientos

### Recursos

- [images/](images/) — Imágenes referenciadas por documentos (capturas, diagramas, etc.)

## Notas de mantenimiento

- Mantén las imágenes organizadas dentro de `docs/images/`
  y utiliza rutas relativas (`./images/nombre.png`) desde los archivos de `docs/`.
- Los ADRs viven en `adr/` y poseen su propio README de índice.
- Actualiza este README si agregas nuevo contenido para facilitar la navegación.
