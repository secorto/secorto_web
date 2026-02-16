# ADR R01: Fundación del sitio personal con Jekyll

> **Estado:** Reemplazada → [R02](R02-migracion-jekyll-a-gatsby.md)
> **Fecha:** 2016-04
> **Categoría:** Plataforma / SSG / Quality
> **Repositorio:** `secorto.com_jekyll` (423 commits, 2016–2023)
> **Fecha reconstrucción:** 2026-02

---

## Contexto

En marzo de 2016 se inició el desarrollo de un sitio web personal con el
objetivo de practicar desarrollo front-end y tener presencia profesional
en línea. El primer intento usó **Lektor** (SSG basado en Python) durante
apenas dos semanas (~8 commits, 16–17 mar 2016) antes de descartarse por
falta de ecosistema y documentación en español.

Se necesitaba un generador de sitios estáticos que:

- Tuviera ecosistema maduro de temas y plugins
- Permitiera escribir contenido en Markdown
- Se pudiera desplegar gratuitamente (GitHub Pages)
- Tuviera buena documentación

---

## Decisión

Adoptar **Jekyll** como generador de sitios estáticos, desplegado inicialmente
en GitHub Pages y luego migrado a Netlify.

### Evolución del stack (fases)

#### Fase 1 — Jekyll + Gulp + Bootstrap (abr 2016)

- Migración completa de Lektor a Jekyll con Gulp como task runner
- Bootstrap 3, Sass, jQuery
- Bower para dependencias frontend
- Dominio `scot3004.xyz`
- CI: Travis CI (Ruby 2.5 + Node.js 8)

#### Fase 2 — Bower → NPM (jun 2016, tags v1.2.x–v1.3.x)

- Bower eliminado, dependencias movidas a NPM
- Scripts NPM reemplazan parcialmente a Gulp
- `html-proofer` integrado como `lint:html`
- `imagemin-cli` para optimización de imágenes

#### Fase 3 — Dominio propio (2017)

- Migración de `scot3004.xyz` a `secorto.com`
- SEO tags, Open Graph, formulario de contacto
- Notice de cookies, reCAPTCHA

#### Fase 4 — Minimal Mistakes + Netlify (sep-oct 2018, tag v2.0.0)

- Tema cambiado de custom a `minimal-mistakes-jekyll` (gema Ruby)
- Eliminación de todo el CSS/HTML personalizado
- Deploy migrado de GitHub Pages a **Netlify**
- **Netlify CMS** integrado (editorial workflow: draft → review → publish)
- Gulpfile eliminado definitivamente

#### Fase 5 — Mantenimiento (2019–2020)

- Remark lint para Markdown
- Portafolio con entradas de PyCon
- Bumps de dependencias vía Dependabot
- Último commit funcional: marzo 2020

#### Fase 6 — Deprecación (2023)

- Commit final advirtiendo migración al nuevo repositorio (Astro)

### Estrategia de calidad

El comando `npm test` ejecutaba exclusivamente **linters y validación
estática** — no existían tests unitarios:

| Herramienta | Tipo | Alcance |
|---|---|---|
| **html-proofer** | Validación HTML post-build | Enlaces rotos, alt vacíos, HTML válido |
| **ESLint** | Linter JS | `.eslintrc.yaml` con 207 líneas de reglas, complejidad máx 6 |
| **scss-lint** | Linter SCSS | `_sass/**/*.scss` |
| **remark-lint** | Linter Markdown | Preset recommended + frontmatter |
| **CodeClimate** | Análisis estático | Duplication (JS, Ruby), eslint, fixme, rubocop, scss-lint |

Pipeline CI (Travis CI):

```
gem install bundler → bundle install → npm install
→ jekyll build → npm run test (= lint:js + lint:css + lint:html + lint:md)
```

Variable de entorno crítica: `NOKOGIRI_USE_SYSTEM_LIBRARIES=true` — necesaria
porque `html-proofer` dependía de **Nokogiri** (parser XML/HTML con binding
nativo en C), que era problemático de compilar en diferentes entornos.

### Contenido

- **17 posts** (2010–2018, los de 2010–2011 migrados desde Blogger)
- **3 entradas de portafolio** (pybaq, pycon, scot3004)
- **6 páginas** (404, archive, categories, contacto, portafolio, tags)
- Datos estructurados: `navigation.yml`, `timeline.yml`

---

## Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| **Lektor** (Python) | Ecosistema limitado, poca documentación, comunidad pequeña |
| **WordPress** | Requiere hosting dinámico, no alineado con práctica de front-end |
| **HTML estático** | No escala para blog con múltiples posts |

---

## Consecuencias

### Positivas

- Jekyll era el SSG más maduro en 2016 con integración nativa en GitHub Pages
- Minimal Mistakes proporcionó un diseño profesional sin esfuerzo de CSS
- Netlify CMS permitió edición de contenido sin tocar código
- Los linters mantuvieron calidad básica del código
- `html-proofer` detectaba enlaces rotos antes del deploy

### Negativas

- **Nokogiri** se volvió un dolor de cabeza recurrente: compilación nativa
  fallaba frecuentemente en CI y en diferentes sistemas operativos
- Sin tests unitarios — la calidad dependía 100% de linting estático
- El stack Ruby + Node.js duplicaba la complejidad del entorno de desarrollo
- Jekyll carecía de componentización moderna (Liquid tiene limitaciones)
- La falta de tipado hacía difícil refactorizar con confianza
- Minimal Mistakes, al ser una gema, ocultaba la estructura interna y
  dificultaba personalizaciones profundas

### Métricas del repositorio

| Métrica | Valor |
|---|---|
| Commits totales | 423 |
| Período activo | 2016-04 a 2020-03 (~4 años) |
| Tags de versión | v1.2.1, v1.2.2, v1.3.1, v1.3.2, v2.0.0 |
| CI | Travis CI |
| Deploy | GitHub Pages → Netlify |
| Último commit | 2023-03-04 (aviso de deprecación) |

---

## Referencias

- Repositorio: `secorto.com_jekyll/`
- [Jekyll](https://jekyllrb.com/)
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)
- [html-proofer](https://github.com/gjtorikian/html-proofer)
- [Nokogiri](https://nokogiri.org/)
