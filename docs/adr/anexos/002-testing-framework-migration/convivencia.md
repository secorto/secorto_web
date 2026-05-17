# Anexo: Fase de convivencia — Detalles de la migración

Este anexo documenta el estado detallado durante la fase de convivencia
entre Cypress y Playwright/Vitest y contiene el inventario de tests y la
organización actual usada como referencia técnica.

## Resumen

La migración incluyó la conversión de specs E2E a Playwright y la adición
de tests unitarios con Vitest. La paridad funcional se alcanzó en las
áreas principales (blog, charlas, homepage, color switch, accesibilidad).

## Acciones realizadas

- Se instaló Playwright con los navegadores necesarios y se documentó la caracterización de escenarios
- Se ejecutaron las suites de Playwright y Cypress en convivencia para comparar resultados y estudiar diferencias entre frameworks
- Se migraron y verificaron los tests de Cypress a Playwright
- Durante el periodo de convivencia se eliminó únicamente un test (homepage)
  debido a que la página fue rediseñada y se prefirió crear el nuevo spec en Playwright
  en lugar de actualizar el spec de Cypress
- Se añadieron ejemplos de tests migrados en este anexo como referencia

### Matriz de conversión

La equivalencia entre cada test existente en Cypress y su versión en Playwright se muestra a continuación

| Área | Cypress | Playwright/Vitest |
| --- | --- | --- |
| Accesibilidad (axe) | `cypress-axe` | `@axe-core/playwright` |
| Blog (list, post) | `blog.cy.ts` | `blog.list.spec.ts`, `blog.post.spec.ts` |
| Charlas | `charla.cy.ts` | `charla.spec.ts`, `charla.a11y.spec.ts` |
| Color switch | `color-switch.cy.ts` | `color-switch.spec.ts` |
| Homepage | `main-page.cy.ts` | `homepage.spec.ts` |
