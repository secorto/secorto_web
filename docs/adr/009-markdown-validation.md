# ADR 009: Validación de Markdown (formato y sincronización de documentación)

> **Estado:** Aceptado
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

Centralizar y automatizar la validación de Markdown
en el pipeline de CI mediante `markdownlint-cli2` usando una **configuración única unificada**
con niveles de severidad (`severity: "error"` y `severity: "warning"`).

La herramienta se usará para aplicar reglas sintácticas y de estilo;
la validación semántica del frontmatter seguirá siendo
responsabilidad de las content collections en build time.

### Configuración unificada con severity levels

La solución usa un único archivo de configuración (`.markdownlint.jsonc`) que especifica:

- **Sin `severity` (defecto `"error"`)**: Reglas que fallan tanto en local como en CI
- **`severity: "warning"`**: Reglas que se reportan pero no bloquean la compilación
  (útiles para excepciones justificadas en CI)
- **`false`**: Reglas deshabilitadas

Esto elimina la necesidad de mantener dos configuraciones separadas.

## Implementación

- Crear un único archivo `.markdownlint.jsonc` con severity levels
- Añadir scripts en `package.json`:
  - `npm run lint:md`: Validar archivos Markdown
  - `npm run lint:md:fix`: Corregir automáticamente
- Documentar en `docs/MARKDOWN_VALIDATION.md` las reglas aplicadas y cómo usarlas
- El script `npm run lint` integra `lint:md` como parte del flujo de validación

## Alternativas consideradas

- **Dos configuraciones separadas** (`.markdownlint.jsonc` y `.markdownlint-ci.jsonc`):
  - ❌ Ventaja: flexibilidad máxima
  - ❌ Desventaja: duplicación, complejidad, riesgo de desincronización
  - ❌ Rechazado en favor de severity levels

- **Solo linters en editor**:
  - Reduce errores locales pero no garantiza calidad en CI

- **Validación en pre-commit**:
  - Útil, pero puede omitirse en merges externos

- **Validación unificada en CI/local (elegida)**:
  - ✅ Garantiza que el sitio no se publica con errores
  - ✅ Centraliza las reglas en un único archivo
  - ✅ Usa severity levels para flexibilidad controlada

## Criterios de aceptación

- [x] `npm run lint:md` está documentado y ejecutable localmente
- [x] `npm run lint:md:fix` funciona para corregir automáticamente
- [x] Un único archivo `.markdownlint.jsonc` con severity levels
- [x] Integración en CI mediante `npm run lint` (que incluye `lint:md`)
- [x] Documentación en `docs/MARKDOWN_VALIDATION.md` explicando reglas y uso
- [x] ADR de referencia (ADR 010) documentando la decisión de unificación

## Riesgos y mitigaciones

- **Riesgo**: Fricción para contribuyentes por nuevas reglas
  - **Mitigación**: Ofrecer `npm run lint:md:fix`, documentación clara y ejemplos

- **Riesgo**: Warnings no se revisan en CI
  - **Mitigación**: Los warnings aparecen en logs; se revisan en PRs

## Notas operativas

- Mantener un único fichero de configuración: `.markdownlint.jsonc`
- Usar severity levels para controlar qué falla y qué se reporta
- Actualizar reglas según necesidad; documentar cambios en PRs

## Pasos futuros

- Documentación regla-por-regla detallada (ejemplos de fallos, cómo corregir)
- Auditar excepciones según sea necesario
- Endurecer reglas (cambiar warnings a errors) por iteraciones planificadas
- Considerar extensiones de markdownlint (plugins) si fuese necesario
