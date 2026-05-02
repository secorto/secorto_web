# ADR 009: Validación de Markdown (formato y sincronización de documentación)

> **Estado:** Aceptada
> **Fecha:** 2026-05-01
> **Última actualización:** 2026-05-02
> **Categoría:** Contenido / Tooling
---

**Alcance:** Este ADR cubre la adopción e integración de `markdownlint-cli2`
como herramienta de validación sintáctica y de estilo de Markdown.

## Contexto

En los últimos cambios se han recibido numerosos comentarios en PRs por mal formato en Markdown
(encabezados inconsistentes, código sin fences adecuados,
line endings/whitespace, URLs desnudas, etc.).
El problema principal a resolver es operativo y de comunicación:
reducir el ruido en PRs aplicando reglas reproducibles
que eviten correcciones manuales repetidas.

## Decisión

Usar `markdownlint-cli2` con un archivo de reglas (`.markdownlint.jsonc`)
y un archivo de opciones para la CLI (`.markdownlint-cli2.jsonc`) que controle patterns/exclusiones; ambos
archivos serán consumidos por CI cuando el pipeline ejecute `markdownlint-cli2` (por ejemplo vía
`npm run lint:md`), de modo que las mismas reglas se apliquen en CI y localmente.

## Implementación

- Mantener dos archivos de configuración consumidos por CI y localmente:
  - `.markdownlint.jsonc` — reglas y `severity`
  - `.markdownlint-cli2.jsonc` — globs/exclusiones y opciones de ejecución
- Añadir scripts en `package.json`:
  - `npm run lint:md` — validar (usado en CI y local)
  - `npm run lint:md:fix` — correcciones automáticas
- Documentar en [docs/MARKDOWN_VALIDATION.md](../MARKDOWN_VALIDATION.md) los comandos mínimos y enlace al ADR

## Alternativas consideradas

- **Dos archivos de reglas distintas (local vs CI)**:
  - ❌ Rechazada: provoca deriva de reglas y bloqueos inesperados
  - ❌ Motivo: `severity` permite la flexibilidad necesaria sin duplicar reglas

- **Separar reglas vs patterns/CLI (adoptada)** (`.markdownlint.jsonc` + `.markdownlint-cli2.jsonc`):
  - ✅ Ventaja: reglas centralizadas y patterns ajustables por entorno
  - ⚠️ Desventaja: requiere documentación y controles para evitar confusiones

- **Solo linters en editor**:
  - ❌ Rechazada: reduce errores locales pero no garantiza calidad en CI
  - ⚠️ Desventaja: depende de la configuración individual y no es obligatorio en CI

## Criterios de aceptación

- `npm run lint:md` y `npm run lint:md:fix` funcionan localmente
- `.markdownlint.jsonc` existe y contiene reglas con `severity`
- `.markdownlint-cli2.jsonc` contiene las reglas de ejecución, por ejemplo patrones a ignorar
- `docs/MARKDOWN_VALIDATION.md` muestra los comandos mínimos y enlaza al ADR
