# ADR 009: Validación de Markdown (formato y sincronización de documentación)

> **Estado:** Aceptada
> **Fecha:** 2026-05-01
> **Última actualización:** 2026-05-02
> **Categoría:** Contenido / Tooling
---

**Alcance:** Este ADR cubre la adopción e integración de `markdownlint-cli2`
como herramienta de validación sintáctica y de estilo de Markdown en CI y local.
La gobernanza de la documentación
(clasificación de anexos, políticas de archivado, owners y procesos de revisión)
queda fuera del alcance de este ADR y se tratará en un ADR o issue separados.

## Contexto

En los últimos cambios se han recibido numerosos comentarios en PRs por mal formato en Markdown
(encabezados inconsistentes, código sin fences adecuados,
line endings/whitespace, URLs desnudas, etc.).
El problema principal a resolver es operativo y de comunicación:
reducir el ruido en PRs aplicando reglas reproducibles
que eviten correcciones manuales repetidas.

## Decisión

Adoptar y automatizar la validación de Markdown en el pipeline de CI mediante `markdownlint-cli2` separando responsabilidades:

- Un archivo de reglas principal: `.markdownlint.jsonc` (define reglas y severity)
- Un archivo orientado a CLI/CI: `.markdownlint-cli2.jsonc`
  o un archivo de patrones/exclusiones (globs/ignores) que controla qué ficheros valida la CI

Esta separación permite mantener las reglas como fuente de verdad
mientras se adapta qué se valida en CI sin modificar las reglas mismas.

### Configuración propuesta: reglas + patterns para CLI

Detalles:

- **`.markdownlint.jsonc`**: contiene las reglas, niveles de `severity` (`error`/`warning`)
  y deshabilitaciones puntuales
- **`.markdownlint-cli2.jsonc` / patterns`**: contiene globs/exclusiones
  usados por el pipeline (por ejemplo para evitar validar ficheros generados o paths large)

Las reglas se siguen aplicando en local y en CI; los patterns determinan el alcance en cada entorno.

## Implementación

- Crear dos archivos de configuración:
  - `.markdownlint.jsonc` — reglas y `severity`
  - `.markdownlint-cli2.jsonc` — globs/exclusiones y opciones específicas de CI/CLI
- Añadir scripts en `package.json`:
  - `npm run lint:md`: Validar archivos Markdown (usa `.markdownlint-cli2.jsonc` en CI)
  - `npm run lint:md:fix`: Corregir automáticamente
- Documentar en `docs/MARKDOWN_VALIDATION.md` las reglas, patrones y cómo usarlos
- El script `npm run lint` integra `lint:md` como parte del flujo de validación

## Alternativas consideradas

- **Dos configuraciones separadas** (`.markdownlint.jsonc` y `.markdownlint-cli2.jsonc`):
  - ✅ Ventaja: flexibilidad para CI sin modificar reglas
  - ⚠️ Desventaja: riesgo de desincronización si no se documenta
  - ✅ Decisión adoptada: separar reglas y patterns, con documentación y checks de sincronización

- **Solo linters en editor**:
  - Reduce errores locales pero no garantiza calidad en CI

- **Validación en pre-commit**:
  - Útil, pero puede omitirse en merges externos

- **Validación unificada en CI/local (rechazada)**:
  - ❌ Rechazada por no permitir adaptar el alcance de la validación en CI sin tocar reglas

## Criterios de aceptación

- [x] `npm run lint:md` está documentado y ejecutable localmente
- [x] `npm run lint:md:fix` funciona para corregir automáticamente
- [x] Existen los archivos `.markdownlint.jsonc` (reglas) y `.markdownlint-cli2.jsonc` (patterns/CLI)
- [x] Integración en CI mediante `npm run lint` (que incluye `lint:md`)
- [x] Documentación en `docs/MARKDOWN_VALIDATION.md` explicando reglas y uso
- [x] La decisión de unificación queda documentada en este ADR (ADR 009)

## Riesgos y mitigaciones

- **Riesgo**: Fricción para contribuyentes por nuevas reglas
  - **Mitigación**: Ofrecer `npm run lint:md:fix`, documentación clara y ejemplos

- **Riesgo**: Warnings no se revisan en CI
  - **Mitigación**: Los warnings aparecen en logs; se revisan en PRs

## Notas operativas

- Mantener un único fichero de configuración para las reglas: `.markdownlint.jsonc`
- Mantener un único fichero de configuración para las opciones de linea de comando: `.markdownlint-cli2.jsonc`
- Usar severity levels para controlar qué falla y qué se reporta

## Pasos futuros

- Documentación regla-por-regla detallada (ejemplos de fallos, cómo corregir)
- Auditar excepciones según sea necesario
- Endurecer reglas (cambiar warnings a errors) por iteraciones planificadas
- Considerar extensiones de markdownlint (plugins) si fuese necesario
