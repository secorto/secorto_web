# Guía de Estilo y Convenciones (español)

Este documento contiene las reglas y convenciones de codificación del proyecto en español.

- **Lenguaje:** Usar TypeScript para código nuevo y refactors cuando sea posible
- **Tipos:** Preferir tipos e interfaces explícitas y específicas; evitar `any` salvo justificación documentada
- **Punto y coma:** Omitir punto y coma (`;`) al final de sentencias, salvo cuando la sintaxis o herramientas lo requieran
- **Nombres:** Usar nombres descriptivos para variables, funciones y componentes
- **Modularidad:** Mantener código modular, legible y con responsabilidad única por módulo
- **Comentarios:** Añadir comentarios para lógica compleja o decisiones no obvias
- **Manejo de errores:** No usar bloques `try/catch` vacíos; siempre manejar o loguear la excepción y, si procede, propagarla

## Fallar rápido, Cobertura total

- **No ocultar fallos:** Evitar `if` defensivos o manejos que silencien errores
  en un estado inconsistente. Prefiere el principio de "fail fast":
  dejar que el error sea visible y tratable, o manejarlo explícitamente con logging y pruebas.
- **Consulta antes de degradar comportamiento:**
  Si consideras que es necesario añadir un bypass o comportamiento degradado
  (por ejemplo, evitar lanzar una excepción en producción),
  primero abre un issue y discútelo con el equipo.
  No introduzcas cambios que simplemente silencien fallos sin aprobación documentada.
- **Cobertura de pruebas unitarias 100%** para todo código typescript
  si hay alguna rama defensiva analizar si realmente se justifica y adicionarle test o directamente eliminarla

## Convenciones específicas de Astro

- Usar componentes `.astro` para UI y layout
- Componentes compartidos en `src/components/`
- Layouts en `src/layouts/`
- Recursos estáticos en `public/` o `src/assets/`
- Para renderizado y resaltado de bloques de código usar `astro-expressive-code`
- **Evitar lógica en `.astro`:** siempre que sea posible, delega la lógica a módulos TypeScript
  (`src/lib/`, `src/utils/`, o `src/domain/`)
  y mantén los componentes `.astro` centrados en la composición y presentación.
  Astro no proporciona cobertura unitaria directa para plantillas;
  trasladar lógica a TypeScript facilita escribir tests unitarios y mantener la cobertura.

Referencias: para flujo de trabajo y contribuciones, ver [README.md](../README.md),
[.github/copilot-instructions.md](../.github/copilot-instructions.md) y [docs/CONTRIBUTING.md](CONTRIBUTING.md).

## TypeScript: ignores y referencias triple-slash

**`// @ts-expect-error` / `// @ts-ignore` / `// @ts-nocheck`**: su uso está muy restringido.

Si no hay alternativa razonable, añade una descripción breve junto al comentario
y, además, añade una anotación inline `TODO(debt)` que apunte al `issue` que
documente la deuda técnica. Se deben hacer barridos regulares para verificar si
estos bloques siguen siendo necesarios.

Evitar `// @ts-ignore`; si se emplea, crear un `issue` y añadir la anotación
inline `TODO(debt)` que lo referencie.

**Referencias triple-slash (`/// <reference ... />`)**: permitidas únicamente en archivos de declaración
(`*.d.ts`) cuando son necesarias para consumir tipos generados (por ejemplo `.astro`).
Preferir una configuración centralizada en TypeScript/ESLint para evitar múltiples referencias inline.

Coloca ejemplos mínimos y enlaces a issues relacionados cuando se creen excepciones.
El objetivo es corregir tipos siempre que sea posible.

Para preguntas sobre flujo de trabajo, CI y la guía rápida de desarrollo,
ver [README.md](../README.md) y [docs/CONTRIBUTING.md](CONTRIBUTING.md).

Para pruebas y estrategia de testing, ver
[docs/TESTING_STRATEGY.md](TESTING_STRATEGY.md).

## Pruebas obligatorias y cobertura

- **Pruebas obligatorias:** Todo desarrollo (features, refactors que cambien comportamiento, fixes)
debe incluir pruebas automatizadas apropiadas: tests unitarios y/o E2E según aplique.
Sigue las convenciones de [docs/TESTING_STRATEGY.md](TESTING_STRATEGY.md) para dónde colocarlas y cómo estructurarlas.
