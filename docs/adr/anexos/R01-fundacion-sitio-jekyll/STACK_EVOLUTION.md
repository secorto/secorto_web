# R01 — Evolución técnica del stack Jekyll

## Fases del proyecto (2016–2023)

### Fase 1 — Jekyll + Gulp + Bootstrap (abr 2016)

- Migración completa de Lektor a Jekyll con Gulp como task runner
- Bootstrap 3, Sass, jQuery
- Bower para dependencias frontend
- Dominio `scot3004.xyz`
- CI: Travis CI (Ruby 2.5 + Node.js 8)

### Fase 2 — Bower → NPM (jun 2016, tags v1.2.x–v1.3.x)

- Bower eliminado, dependencias movidas a NPM
- Scripts NPM reemplazan parcialmente a Gulp
- `html-proofer` integrado como `lint:html`
- `imagemin-cli` para optimización de imágenes

### Fase 3 — Dominio propio (2017)

- Migración de `scot3004.xyz` a `secorto.com`
- SEO tags, Open Graph, formulario de contacto
- Notice de cookies, reCAPTCHA

### Fase 4 — Minimal Mistakes + Netlify (sep-oct 2018, tag v2.0.0)

- Tema cambiado de custom a `minimal-mistakes-jekyll` (gema Ruby)
- Eliminación de todo el CSS/HTML personalizado
- Deploy migrado de GitHub Pages a **Netlify**
- **Netlify CMS** integrado (editorial workflow: draft → review → publish)
- Gulpfile eliminado definitivamente

### Fase 5 — Mantenimiento (2019–2020)

- Remark lint para Markdown
- Portafolio con entradas de PyCon
- Bumps de dependencias vía Dependabot
- Último commit funcional: marzo 2020

### Fase 6 — Deprecación (2023)

- Commit final advirtiendo migración al nuevo repositorio (Astro)

## Stack de herramientas de calidad

| Herramienta | Tipo | Alcance |
| --- | --- | --- |
| **html-proofer** | Validación HTML post-build | Enlaces rotos, alt vacíos, HTML válido |
| **ESLint** | Linter JS | `.eslintrc.yaml` con 207 líneas de reglas, complejidad máx 6 |
| **scss-lint** | Linter SCSS | `_sass/**/*.scss` |
| **remark-lint** | Linter Markdown | Preset recommended + frontmatter |
| **CodeClimate** | Análisis estático | Duplication (JS, Ruby), eslint, fixme, rubocop, scss-lint |

### Pipeline CI (Travis CI)

```bash
gem install bundler → bundle install → npm install
→ jekyll build → npm run test (= lint:js + lint:css + lint:html + lint:md)
```

### Punto crítico: Nokogiri

Variable de entorno crítica: `NOKOGIRI_USE_SYSTEM_LIBRARIES=true` — necesaria
porque `html-proofer` dependía de **Nokogiri** (parser XML/HTML con binding
nativo en C), que era problemático de compilar en diferentes entornos.

**Problemas recurrentes:**

- Compilación nativa fallaba frecuentemente en CI
- Diferentes versiones de `libxml2`/`libxslt` causaban errores crípticos
- Actualizaciones de Ruby o del SO rompían la compilación

## Contenido migrado

- **17 posts** (2010–2018, los de 2010–2011 migrados desde Blogger)
- **3 entradas de portafolio** (pybaq, pycon, scot3004)
- **6 páginas** (404, archive, categories, contacto, portafolio, tags)
- Datos estructurados: `navigation.yml`, `timeline.yml`
