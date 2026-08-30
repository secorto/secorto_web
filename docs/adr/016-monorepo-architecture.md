---
id: ADR-016
title: Adoptar una arquitectura de monorepo para el sitio web
status: accepted
date: 2026-08-18
last_updated: 2026-08-29
categories:
  - Architecture
---

## Contexto

El proyecto ha crecido más allá de la estructura de una sola aplicación.
La base de código ya contiene una separación clara entre la lógica de dominio,
la gestión de contenidos, i18n, pruebas y los aspectos de presentación específicos de Astro,
pero esas responsabilidades siguen concentradas físicamente dentro de la raíz de una única aplicación.

Esta organización dificulta la evolución del proyecto como una plataforma reutilizable,
especialmente cuando el objetivo es mantener la aplicación del sitio web enfocada mientras se permite
el trabajo independiente en la lógica compartida y la infraestructura de pruebas.

La estructura actual basada en alias ya sugiere un límite arquitectónico más fuerte,
pero el repositorio todavía se comporta como una sola aplicación arraigada en `src`.

Un espacio de trabajo (workspace) de monorepo permitiría que el proyecto evolucione sin forzar una reescritura
completa del modelo de la aplicación. También se alinea con los principios constitucionales de
"El Dominio Primero" (Domain First), "Núcleo Agnóstico al Framework" (Framework-Agnostic Core) y
"Calidad por Diseño"(Quality by Design).

## Objetivo

Proporcionar una migración estructural simple que preserve el proyecto actual,
permita que el sitio web viva como una aplicación dedicada y cree un camino claro para
la futura extracción de paquetes sin rediseños innecesarios.

## Decisión

Secorto adoptará una estructura de espacio de trabajo monorepo con una entrada de aplicación dedicada
para el sitio web.

El repositorio utilizará un modelo de espacio de trabajo raíz donde la aplicación se organizará bajo:

```text
apps/web
```

El espacio de trabajo raíz actuará como la capa de coordinación para la configuración y las herramientas
a nivel de repositorio, mientras que el sitio web real seguirá siendo la aplicación principal.

La migración inicial priorizará la claridad estructural y la estabilidad de la construcción (build)
sobre la extracción prematura de límites de paquetes reutilizables.

Esta decisión mantiene intencionalmente la evolución del proyecto de manera gradual: la aplicación se mueve
primero a su propia entrada de espacio de trabajo, y la extracción de paquetes puede ocurrir más adelante
una vez que los patrones de uso sean más claros.

## Implementación

El proyecto evolucionará hacia una estructura similar a:

```text
repo/
  apps/
    web/
      src/
      tests/
      package.json
  packages/
    (futuros límites de paquetes)
  package.json
```

Esta decisión no requiere una extracción inmediata de toda la lógica de dominio en
paquetes independientes. En su lugar, introduce el límite del espacio de trabajo necesario para
soportar la modularización futura mientras mantiene la aplicación actual en funcionamiento.

Las notas detalladas de la implementación pueden evolucionar en la documentación de la arquitectura.

## Consecuencias

### Positivas

- La aplicación obtiene un límite de espacio de trabajo claro.
- El repositorio se vuelve más fácil de escalar sin una estructura monolítica única.
- Las herramientas se pueden organizar en la raíz del espacio de trabajo mientras la aplicación se mantiene enfocada.
- La futura extracción de paquetes se vuelve más fácil y menos disruptiva.
- El historial actual del proyecto se preserva mientras la arquitectura evoluciona.

### Contras (Trade-offs)

- La migración introduce un desajuste temporal en la configuración.
- Algunos scripts a nivel de raíz y rutas de configuración necesitarán adaptación.
- Es posible que la estructura inicial aún no aproveche por completo los límites a nivel de paquete.

### Alternativas Rechazadas

#### Extracción completa de paquetes en el mismo cambio

Un refactor más grande extraería la lógica de dominio y los adaptadores de inmediato.

Rechazado porque aumenta el riesgo de la migración antes de que el diseño del monorepo haya demostrado ser estable.

#### Sin cambios en el espacio de trabajo

Mantener todo bajo la raíz de una sola aplicación.

Rechazado porque el proyecto ya muestra signos de crecer más allá de la estructura de una sola aplicación
y el límite del espacio de trabajo es una dirección más segura a largo plazo.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md) — Arquitectura
