---
id: ADR-R01
title: Fundación del sitio personal con Jekyll
status: replaced
date: 2016-04
last_updated: 2026-09-20
categories:
  - Platform
  - SSG
  - Quality
repository: secorto.com_jekyll
commits: 423
start_year: 2016
end_year: 2023
reconstruction_date: 2026-02
replaced_by: R02-migracion-jekyll-a-gatsby.md
---

## Contexto

En marzo de 2016 se inició el desarrollo de un sitio web personal con el
objetivo de practicar desarrollo front-end y tener presencia profesional
en línea. El primer intento usó **Lektor** (SSG basado en Python) durante
apenas dos semanas antes de descartarse por falta de ecosistema.

Se necesitaba un generador de sitios estáticos que tuviera:

- Ecosistema maduro de temas y plugins
- Soporte nativo para Markdown
- Posibilidad de desplegar gratuitamente (GitHub Pages)
- Buena documentación

---

## Decisión

Adoptar **Jekyll** como generador de sitios estáticos, desplegado inicialmente
en GitHub Pages y luego migrado a Netlify. La estrategia de calidad se basó
en linters y validación estática (`html-proofer`, `ESLint`, `scss-lint`,
`remark-lint`) sin tests unitarios.

---

## Consecuencias

### Positivas

- Jekyll era el SSG más maduro en 2016 con integración nativa en GitHub Pages.
- Minimal Mistakes proporcionó un diseño profesional sin esfuerzo de CSS.
- Netlify CMS permitió edición de contenido sin tocar código.
- Los linters mantuvieron calidad básica del código.
- `html-proofer` detectaba enlaces rotos antes del deploy.

### Negativas

- **Nokogiri fue un dolor de cabeza recurrente:** compilación nativa fallaba frecuentemente en CI.
- Sin tests unitarios — la calidad dependía 100% de linting estático.
- El stack Ruby + Node.js duplicaba la complejidad del entorno de desarrollo.
- Jekyll carecía de componentización moderna (Liquid tiene limitaciones).
- La falta de tipado hacía difícil refactorizar con confianza.
- Minimal Mistakes ocultaba la estructura interna y dificultaba personalizaciones.

### A considerar

- Cambios frecuentes en las dependencias de Ruby.
- Curva de aprendizaje de Jekyll para nuevos contribuidores.
- Integración limitada con herramientas modernas de desarrollo.

### Limitaciones

- Ecosistema de Jekyll era más maduro en 2016, pero limitado en componentización.
- Ruby + Node.js duplicaban la complejidad del entorno.
- Sin tipos nativos, refactorización riesgosa.

### Alternativas Rechazadas

#### Lektor (Python)

Ecosistema limitado, poca documentación, comunidad pequeña.

#### WordPress

Requiere hosting dinámico, no alineado con práctica de front-end.

#### HTML estático

No escala para blog con múltiples posts.

---

## Referencias

- Repositorio: `secorto.com_jekyll/`
- [Jekyll](https://jekyllrb.com/)
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)
- [ADR R02 — Migración de Jekyll a Gatsby](R02-migracion-jekyll-a-gatsby.md)

## Anexos

- [STACK_EVOLUTION.md](anexos/R01-fundacion-sitio-jekyll/STACK_EVOLUTION.md) — Fases, tecnologías y pipeline CI
- [LIMITATIONS.md](anexos/R01-fundacion-sitio-jekyll/LIMITATIONS.md) — Problemas que motivaron la migración
- [METRICS.md](anexos/R01-fundacion-sitio-jekyll/METRICS.md) — Métricas del repositorio
