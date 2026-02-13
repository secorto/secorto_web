---
title: "10 años con Jamstack: mi viaje de Jekyll a Astro"
date: 2026-02-13
summary: "Lecciones aprendidas, decisiones arquitectónicas y errores útiles en 10 años construyendo mi sitio personal."
draft: true
tags: [historia, jamstack, astro, gatsby, jekyll]
lang: es
---

## Introducción

Hace diez años empecé a publicar en la web usando Markdown y SSGs. Este
post es un resumen personal: decisiones, dolores, aprendizajes y por qué
algunas ideas se mantuvieron pese a reescrituras completas.

## Resumen cronológico

- **2016** — Inicio con Lektor, migración rápida a **Jekyll**. Validación
  con `html-proofer` y linters.
- **2021** — Reescritura con **Gatsby** (React + MDX). Primera implementación
  seria de tema visual (light/dark), experimenté con `styled-components` y
  Theme UI.
- **2024** — Migración a **Astro**: Content Collections, TypeScript strict,
  builds más rápidos, router polimórfico e i18n.

## Lecciones clave

- Reducir dependencia de herramientas nativas (ej. Nokogiri) ahorra horas
  de CI.
- Componentizar y tipar reduce miedo al refactor.
- Los snapshots son útiles, pero pueden crear ruido; la cobertura unitaria
  es más valiosa.
- Mantener tokens de diseño (colores, spacing) permite conservar la
  identidad visual a través de reescrituras.

## Ideas para charla

- Demo: migración de una página de Jekyll → Gatsby → Astro
- Live-coding: construir el router polimórfico desde `sections.ts`
- Anecdotario: fallos con `nokogiri`, snapshots rotas, tema propio que salió mal

## Notas / TODO

- Añadir enlaces a commits clave y ADRs.
- Extraer capturas de pantallas históricas (Jekyll, Gatsby, Astro).

---

> Draft: marcaré listo para publicación cuando quieras que prepare la versión
> en inglés y las imágenes.
