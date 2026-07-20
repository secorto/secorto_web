# Anexos de ADRs

Documentos técnicos y complementarios que expanden decisiones arquitectónicas sin redundancia.

## Estructura

```markdown
anexos/
├── 001-i18n-router-framework/          # Detalles técnicos de ADR 001
│   ├── ARCHITECTURE_DIAGRAM.md         # Diagrama y flujos
│   ├── ARCHITECTURE_SECTIONS.md        # Definiciones de secciones
│   ├── BEFORE_AFTER_COMPARISON.md      # Comparativa antes/después
│   └── MIGRATION_GUIDE.md              # Guía de migración
│
├── 002-testing-framework-migration/    # Detalles técnicos de ADR 002
│   ├── METRICS_FOR_PRESENTATION.md     # Métricas de migración
│   ├── convivencia.md                  # Periodo de convivencia Cypress+Playwright
│   └── eliminacion.md                  # Plan de eliminación de Cypress
│
└── 007-domain-i18n-unificacion/        # Detalles técnicos de ADR 007
    └── MIGRATION_AND_TECHNICAL_DETAILS.md  # API changes, trade-offs, checklist
```

## Propósito

- **Evitar redundancia**: ADRs permanecen agnósticas a implementación; anexos contienen detalles
- **Referencia técnica**: Desarrolladores que implementan encuentran guías, checklists y cambios de API
- **Histórico**: Preservar decisiones técnicas concretas que evolucionan

## Convenciones

- Un anexo por ADR (consolidado, no fragmentado)
- Nombres descriptivos: `MIGRATION_AND_TECHNICAL_DETAILS.md`, no genéricos
- Referenciar desde el ADR con link explícito en la sección Referencias
- Actualizar cuando cambien detalles técnicos (no cuando cambia la decisión principal)
