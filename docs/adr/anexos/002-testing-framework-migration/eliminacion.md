# Anexo: Fase de eliminación total — Pasos y checklist

Este anexo documenta los pasos y el checklist de la eliminación completa de
Cypress y artefactos asociados, así como acciones verificables para CI.

## Resumen

Eliminación definitiva de Cypress y configuración relacionada una vez que
la fase de convivencia confirmó paridad y estabilidad en Playwright/Vitest.

## Acciones realizadas

- Se eliminó el paquete `cypress` de `package.json` y por extensión `package-lock.json`
- Se buscaron y eliminaron archivos residuales `cypress/**`, `cypress.config.*`, `*.cy.ts`
  o similares en repositorios y ramas antiguas
- Se verificaron los workflows de GitHub Actions y se removieron pasos/plugins relacionados con Cypress
- Se verificaron las configuraciones de CI externas (Netlify, servicios de CI) y se removieron integraciones de Cypress
- Se validó la nueva suite en CI y localmente
- Se creó el pull request <https://github.com/secorto/secorto_web/pull/157>
  que incluye la eliminación de los tests escritos con Cypress
  y la respectiva actualización de la documentación
