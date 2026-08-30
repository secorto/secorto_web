# Implementación ADR-010

- Crear `docs/adr/TEMPLATE.md` que especifique:
  - `Frontmatter` YAML con campos: `status`, `date`, `last_updated`, `categories`.
    **Note:** `categories` is an array of strings
  - Recomendación adicional para metadatos de reconstrucción/historia:
    - `repository`: repositorio origen o nombre histórico (string)
    - `commits`: número aproximado de commits migrados (number)
    - `start_year`: año de inicio del repositorio/mantenimiento (number)
    - `end_year`: año de fin. **Omisión** de `end_year` se interpreta como "present".
      - Recomendar: si se quiere dejar explícito, usar `end_year: null` para indicar abierto/en curso;
        la plantilla debe documentar que la ausencia es equivalente a presente para compatibilidad con ADRs anteriores.
    - `replaced_by`: campo opcional que apunta al ADR que reemplaza a este
      (string, preferiblemente filename relativo, p.ej. `R03-migracion-gatsby-a-astro.md`).
  - Secciones obligatorias: Contexto, Objetivo, Decisión, Implementación,
    Consecuencias (Positivas / A tener en cuenta), Referencias.
  - **Guía de contenido por sección:** Los ADRs deben mantener la decisión
    **agnóstica a detalles de implementación concretos**:
    - **Contexto:** problema abstracto (p.ej. "múltiples responsabilidades en
      una clase"), no nombres de archivos o clases específicas
    - **Decisión:** estructura o patrón abstracto (p.ej. "especialización por
      responsabilidad", "Vista de Lista vs Vista de Detalle"), no
      identificadores de implementación
    - **Implementación:** descripción de cómo se aplicó, referencias a
      documentos de arquitectura (docs/architecture/) donde vive el mapeo
      concreto a clases/archivos reales
    - **Consecuencias:** impacto conceptual (mantenibilidad, complejidad,
      claridad), no detalles técnicos de clases específicas
    - **Razón:** ADRs permanecen válidos como referencias incluso cuando
      cambia la implementación. Detalles concretos van en archivos de
      arquitectura específicos (docs/architecture/) que pueden evolucionar
      sin invalidar la decisión.
- Actualizar `docs/adr/README.md` — sección **Convenciones** — para
  documentar el nuevo formato `frontmatter` YAML como fuente única de verdad
  para autores humanos.
- Normalizar ADRs existentes en PRs separados y claramente marcados (commits
  de formato que **reemplazan completamente** `blockquotes` por `frontmatter`
  YAML,
  sin mezcla de ambos formatos).
- Actualizar `.github/copilot-instructions.md` para que asistentes IA generen ADRs conformes
  con `frontmatter` YAML desde el inicio.
