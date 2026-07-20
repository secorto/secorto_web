---
title: Mapa de partes reemplazadas entre ADRs
status: informational
date: 2026-05-18
categories:
  - ADR
  - Governance
---

Este documento centraliza las partes de ADRs previos que han sido parcial o totalmente
reemplazadas por ADRs posteriores. Use este mapa como guía rápida para entender qué fragmentos
de decisiones han cambiado y a qué ADR remitir para la decisión actualizada.

- ADR 001: Framework i18n y router polimórfico
  - Estado: superseded por ADR 007
  - Sustituido por: [docs/adr/007-domain-i18n-unificacion.md](./007-domain-i18n-unificacion.md)
  - Partes que permanecen vigentes (documentadas en 007):
    - Router polimórfico, configuración de secciones y registro centralizado de secciones —
      reubicadas y normalizadas como objetos de `domain` por ADR 007.

Si detectas alguna inconsistencia en este mapa o quieres que añadamos más ADRs con su
relación de reemplazo, abre un PR con la propuesta o indícamelo y lo anoto aquí.
