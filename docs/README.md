# Documentación del proyecto

En esta carpeta `docs/` se agrupan guías, recursos técnicos y registros de decisiones del proyecto.

**¿Es tu primera vez?** Comienza en [ARCHITECTURE.md](ARCHITECTURE.md) para entender principios.
**¿Necesitas hacer algo específico?** Busca en la sección temática abajo.
Cada documento se auto-referencia a sus documentos relacionados.

## Índice por sección

### Fundamentales

- [CONTRIBUTING.md](CONTRIBUTING.md) — Guía de contribución y convenciones de desarrollo

### Arquitectura y diseño

- [DETAIL_VIEW_COMPONENTS.md](architecture/DETAIL_VIEW_COMPONENTS.md) —
  Arquitectura de componentes de detalle (blog, charlas, trabajo, proyectos, comunidad)
- [PAGE_OBJECTS.md](architecture/PAGE_OBJECTS.md) — Jerarquía y separación de concerns en page objects (E2E)
- [GISCUS.md](GISCUS.md) — Integración de comentarios con Giscus

### Procesos y flujos

- [DEVELOPMENT_WORKFLOW.md](architecture/DEVELOPMENT_WORKFLOW.md) — Flujo visual de desarrollo y validación pre-PR
- [TESTING_STRATEGY.md](architecture/TESTING_STRATEGY.md) — Estrategia de pruebas (E2E con Playwright, unitarias con Vitest)
- [E2E_CONSOLIDATION.md](architecture/E2E_CONSOLIDATION.md) — Consolidación de assertions en E2E tests
- [COMMON_AI_MISTAKES.md](COMMON_AI_MISTAKES.md) — 6 patrones reales de errores que la IA ha cometido y cómo evitarlos
- [CONTENT_POLICY.md](CONTENT_POLICY.md) — Convenciones sobre el contenido del sitio
- [MARKDOWN_VALIDATION.md](MARKDOWN_VALIDATION.md) — Validación de Markdown (linting y reglas de formato)
- [UPGRADE.md](UPGRADE.md) — Guía de actualización

### Operativo y configuración

- [DEVCONTAINER.md](DEVCONTAINER.md) — Configuración de Dev Container para desarrollo consistente
- [E2E_PARAMS.md](architecture/E2E_PARAMS.md) — Parámetros y configuración para tests E2E

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
