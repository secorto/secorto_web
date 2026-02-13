---
title: "ESLint: la herramienta que me salvó (y cómo configurarla sin dolor)"
date: 2026-02-13
summary: "De YAML a .eslintrc, presets y hooks: cómo aprendí a convivir con ESLint y a convertir dolor en confianza."
draft: true
tags: [eslint, tooling, calidad, husky]
lang: es
---

## Introducción

ESLint me ha dado más de un dolor de cabeza... y más de una vez me ha
salvado. Entre YAML, `.eslintrc`, presets y configuraciones planas, he
probado varias formas de organizar reglas a través de tres reescrituras del
sitio.

## Línea de tiempo de configuraciones

- **Jekyll era**: reglas repartidas entre scripts y linters separados (JS,
  SCSS, Markdown).
- **Gatsby era**: `.eslintrc` con presets (`eslint-config-react-app`) y
  transformaciones para tests (jest-preprocess). Probé `styled-components`
  y migrated configs.
- **Astro era**: ESLint Flat Config + plugins (`astro`, `@typescript-eslint`),
  reglas más estrictas y `no-explicit-any` en radar.

## Patrones y buenas prácticas que funcionaron

- **Separar reglas por intención**: `errors` para problemas que rompen
  builds, `warnings` para estilo. Convertir warnings a errors en batches.
- **Overrides por carpeta**: `tests/`, `scripts/` y `legacy/` con reglas
  menos estrictas para facilitar migraciones.
- **Presets compartidos**: crear un preset interno (`.eslintrc.shared`) que
  se extienda en cada repo evita duplicación.
- **Auto-fix en commits**: `husky + lint-staged` para arreglar cambios antes
  de commitear. Reduce ruido y mantiene el repositorio limpio.

## Ejemplo mínimo: `package.json` scripts y hooks

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.ts,.astro",
    "lint:fix": "eslint . --ext .js,.ts,.astro --fix"
  }
}
```

Agregar `husky` y `lint-staged`:

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Y en `package.json`:

```json
"lint-staged": {
  "*.{js,ts,astro}": ["eslint --fix", "git add"]
}
```

## Cómo manejar legado sin pérdida de cordura

- **Carpeta `legacy/`**: permite que reglas estrictas no rompan PRs
- **Transformaciones automáticas**: ejecutar `eslint --fix` en una rama
  dedicada y abrir PR para revisión
- **Documentar reglas**: lista corta en `docs/LINTING.md` con razones para
  cada regla crítica

## Conclusión

ESLint es una herramienta con coste inicial de dolor y alto ROI a largo
plazo. La clave es aplicarlo con estrategia: presets, overrides, y hooks
para automatizar el trabajo repetitivo.

---

> Draft: puedo añadir ejemplos reales extraídos de `web2021/.eslintrc` y
> compararlos si quieres que incluya fragmentos concretos.
