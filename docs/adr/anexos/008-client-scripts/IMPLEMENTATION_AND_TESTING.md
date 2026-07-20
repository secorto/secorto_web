# ADR 008 — Estructura de Tests Client-Side

Documento técnico con la estructura de directorios y archivos de test del proyecto.

## Tabla de Contenidos

- [Estructura de Directorios](#estructura-de-directorios)
- [Archivos de Módulos Cliente](#archivos-de-módulos-cliente)
- [Tests Unitarios Existentes](#tests-unitarios-existentes)
- [Configuración Base](#configuración-base)

---

## Estructura de Directorios

Código cliente reorganizado en módulos testables:

```text
src/
├── client/                    ← Lógica cliente con API explícita
│   ├── themeToggle.ts        ← Manejo del tema (localStorage, preferencias)
│   ├── sidebar.ts            ← Lógica del menú hamburguesa
│   └── giscus.ts             ← Integración del widget de comentarios
│
└── layouts/
    └── SiteLayout.astro      ← Inicialización explícita de módulos

tests/unit/client/            ← Tests unitarios con jsdom
├── themeToggle.test.ts
├── sidebar.test.ts
└── giscus.test.ts
```

---

## Archivos de Módulos Cliente

### src/client/themeToggle.ts

Funciones principales:

- `getDocumentTheme(doc?: Document): Theme | null` — Lee el tema actual
- `applyTheme(theme: Theme, doc?: Document): void` — Aplica tema y persiste en localStorage
- `setGiscusTheme(theme: Theme): void` — Sincroniza tema con widget Giscus
- `handleToggleClick(doc?: Document): void` — Maneja click del toggle
- `initThemeToggle(button: HTMLElement | null): void` — Inicializa listener

Tipos: `Theme = 'light' | 'dark'`

### src/client/sidebar.ts

Funciones principales:

- `openSidebar(doc?: Document): void` — Abre el sidebar
- `closeSidebar(doc?: Document): void` — Cierra el sidebar
- `toggleSidebar(doc?: Document): void` — Alterna estado
- `initSidebar(button: HTMLElement | null): void` — Inicializa listener

Usa selectores: `.sidebar-toggle`, `.hamburger`

### src/client/giscus.ts

Integración con widget de comentarios (ver [docs/GISCUS.md](../../GISCUS.md) para detalles).

---

## Tests Unitarios Existentes

### tests/unit/client/themeToggle.test.ts

Cubre:

- `getDocumentTheme()` — lectura de tema actual
- `applyTheme()` — aplicación de tema y persistencia en localStorage
- `handleToggleClick()` — toggle de tema, sincronización con Giscus, cierre de sidebar
- `initThemeToggle()` — inicialización de listener

Usa `@vitest-environment jsdom` para simular el DOM.

### tests/unit/client/sidebar.test.ts

Cubre:

- `openSidebar()` — agregar clase `sidebar-open`
- `closeSidebar()` — remover clase `sidebar-open`
- `toggleSidebar()` — alternar estado
- `initSidebar()` — inicialización de listener de click

### tests/unit/client/giscus.test.ts

Cubre integración con widget de comentarios.

---

## Configuración Base

### vitest.config.ts

El proyecto usa `vitest` con `jsdom` para tests unitarios. El ambiente
`jsdom` permite simular el DOM sin abrir un navegador real.

### Tests Setup

- `beforeEach` — limpia localStorage y resetea estado del DOM
- Mocks de funciones externas (ej. Giscus) para aislar pruebas
- `matchMedia` mockeado para pruebas de preferencias del sistema

---

## Referencias

- [Vitest Documentation](https://vitest.dev/)
- [jsdom](https://github.com/jsdom/jsdom)
- [Astro Scripts Documentation](https://docs.astro.build/en/guides/client-side-scripts/)
- [docs/GISCUS.md](../../GISCUS.md) — Detalles de integración del widget
- [ADR 002: Migración de Cypress a Playwright + Vitest](../../002-testing-framework-migration.md)
