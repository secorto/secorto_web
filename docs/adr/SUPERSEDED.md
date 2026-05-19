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
  - Sustituido por: [docs/adr/007-domain-i18n-unificacion.md](docs/adr/007-domain-i18n-unificacion.md)
  - Partes que permanecen vigentes (documentadas en 007):
    - Router polimórfico, configuración de secciones y registro centralizado de secciones —
      reubicadas y normalizadas como objetos de `domain` por ADR 007.

- ADR 007: Unificación de dominio e i18n
  - Estado:  superseded por ADR 011
  - Sustituido por: [docs/adr/011-i18n-translationkey.md](docs/adr/011-i18n-translationkey.md) (postId → translationKey)
  - Partes que permanecen vigentes:
    - Normalización de objetos de dominio, centralización de `localeLinks` y APIs SEO.

- ADR 011: `translationKey`
  - Formaliza la política de keys: ADR 011 reemplaza la recomendación puntual de ADR 007
    que proponía usar `postId` como llave de traducción, imponiendo `translationKey` en su lugar.

Si detectas alguna inconsistencia en este mapa o quieres que añadamos más ADRs con su
relación de reemplazo, abre un PR con la propuesta o indícamelo y lo anoto aquí.
