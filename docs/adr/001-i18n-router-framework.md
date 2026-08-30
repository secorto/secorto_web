---
id: ADR-001
title: Router polimórfico de secciones
status: accepted
date: 2025-06
last_updated: 2026-08-29
categories:
  - Architecture
  - i18n
  - Routing
---

## Contexto

El sitio necesita soportar varias secciones de contenido con comportamiento
similar, pero con identidad, rutas y localización distintas según el idioma.
Sin una regla central, cada sección tiende a duplicar lógica de listados,
filtrado y resolución de URLs, y se vuelve frágil al introducir nuevas secciones
o variantes por locale.

La complejidad no es la i18n en sí, sino la combinación de tres problemas:

1. múltiples tipos de contenido con la misma estructura de navegación,
2. aliases de ruta por idioma y
3. necesidad de un mecanismo reutilizable para listar, filtrar y resolver
   entradas sin duplicación.

## Objetivo

Establecer un patrón de routing que permita resolver secciones por idioma sin
repetir lógica ni depender de convenciones acopladas a archivos. La decisión
busca mantener la navegación consistente y extensible a medida que el contenido
crece.

## Decisión

Adoptar un router polimórfico de secciones como patrón de resolución de rutas.
Cada sección se modela como una entidad del dominio con una identidad estable,
una colección asociada y una estrategia de aliasing por idioma. La resolución de
la ruta se realiza a partir de una configuración central, en lugar de crear
variantes manuales por sección y por locale.

La idea central es:

> La i18n se resuelve como navegación de secciones, no como rutas físicas
> dispersas ni convenciones del filesystem.

Este ADR define la política estructural del routing; no pretende resumir cada
implementación concreta del sistema. Los detalles de mapeo de archivos,
componentes y loaders viven en la documentación de arquitectura del proyecto.

## Implementación

La implementación concreta se apoya en tres principios:

- Registro centralizado de secciones: cada sección declara su identidad,
  alias por idioma y comportamiento compartido.
- Resolución uniforme de rutas: el router interpreta el tipo de sección y
  deriva la página adecuada sin duplicación por locale.
- Composición de vistas: el render se parametriza por el tipo de sección,
  evitando código específico repetido en cada ruta.

Esta decisión es la base del patrón de navegación del sitio, pero no reemplaza
la responsabilidad del dominio ni la semántica de las traducciones:

- ADR 007 define las invariantes del dominio y la fuente de verdad del
  contenido e i18n.
- ADR 011 define la clave canónica de traducción.

## Consecuencias

### Positivas

- Reduce duplicación radical en la navegación del sitio.
- Hace explícitos los aliases por idioma y la relación entre secciones.
- Facilita agregar nuevas secciones sin multiplicar rutas manualmente.
- Mejora la consistencia de la experiencia multilenguaje.

### A considerar

- Introduce una capa de indirección entre la URL, la sección y la colección.
- Requiere documentación clara para que la resolución de rutas sea legible.
- El patrón debe mantenerse agnóstico a frameworks o archivos concretos para
  evitar que el ADR quede obsoleto cuando cambia la implementación.

## Referencias

- [ADR 007](./007-domain-i18n-unificacion.md) — rol del dominio en contenido e i18n.
- [ADR 011](./011-i18n-translationkey.md) — llave canónica de traducción.
- [ADR 010](./010-plantilla-estandar-adr.md) — plantilla estándar y reglas de
  redacción para ADRs.

## Anexos

- [ARCHITECTURE_SECTIONS.md](./anexos/001-i18n-router-framework/ARCHITECTURE_SECTIONS.md) — Arquitectura técnica detallada
- [ARCHITECTURE_DIAGRAM.md](./anexos/001-i18n-router-framework/ARCHITECTURE_DIAGRAM.md) — Diagramas de flujo
- [BEFORE_AFTER_COMPARISON.md](./anexos/001-i18n-router-framework/BEFORE_AFTER_COMPARISON.md) — Comparación antes/después
- [MIGRATION_GUIDE.md](./anexos/001-i18n-router-framework/MIGRATION_GUIDE.md) — Guía de migración
- [DETAIL_VIEW_COMPONENTS.md](./anexos/001-i18n-router-framework/DETAIL_VIEW_COMPONENTS.md) — de vistas de detalle
