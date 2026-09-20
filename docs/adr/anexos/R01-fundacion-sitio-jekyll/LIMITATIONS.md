# R01 — Limitaciones identificadas

## Problemas con Nokogiri (crítico)

`html-proofer` — la herramienta central de validación de calidad — dependía
de **Nokogiri**, un parser XML/HTML con bindings nativos en C. Compilar
Nokogiri era un proceso frágil:

- Fallaba frecuentemente en CI (Travis CI) requiriendo
  `NOKOGIRI_USE_SYSTEM_LIBRARIES=true`
- Diferentes versiones de `libxml2`/`libxslt` en el sistema generaban
  errores crípticos
- Actualizaciones de Ruby o del SO rompían la compilación nativa
- El stack dual Ruby + Node.js multiplicaba los puntos de fallo

## Deseo de mayor estructura

Jekyll con Liquid ofrecía poca componentización:

- No había componentes reutilizables con props tipados
- La lógica de templates era difícil de testear
- No existía sistema de tipos — los errores se detectaban en runtime (build)
- El código CSS/HTML estaba acoplado al tema Minimal Mistakes (gema opaca)

## Falta de testing unitario

El comando `npm test` ejecutaba exclusivamente **linters y validación
estática** — no existían tests unitarios. La calidad dependía 100% de
linting estático sin poder validar lógica en tiempo de ejecución.
