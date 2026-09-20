# R02 — Problemas identificados en Jekyll

## Infierno de dependencias con Nokogiri

`html-proofer` — la herramienta central de validación de calidad — dependía
de **Nokogiri**, un parser XML/HTML con bindings nativos en C. Compilar
Nokogiri era un proceso frágil:

- Fallaba frecuentemente en CI (Travis CI)
- Diferentes versiones de `libxml2`/`libxslt` en el sistema causaban errores crípticos
- Actualizaciones de Ruby o del SO rompían la compilación nativa
- El stack dual Ruby + Node.js multiplicaba los puntos de fallo

## Deseo de mayor estructura

Jekyll con Liquid ofrecía poca componentización:

- No había componentes reutilizables con props tipados
- La lógica de templates era difícil de testear
- No existía sistema de tipos — los errores se detectaban en runtime (build)
- El código CSS/HTML estaba acoplado al tema Minimal Mistakes (gema opaca)

## Motivación personal

- Practicar React y el ecosistema moderno de JavaScript
- Tener una base más estructurada y componentizada
- Poder escribir tests unitarios reales (no solo linters)
