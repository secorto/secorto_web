# ADR 003 — Detalles de Implementación y Benchmarks

Documento técnico consolidado con implementación, mediciones, estructura de tests
y ambiente.

## Tabla de Contenidos

- [Servicios de Terceros Integrados](#servicios-de-terceros-integrados)
- [Arquitectura de Mocks](#arquitectura-de-mocks)
- [Ejemplos de Código](#ejemplos-de-código)
- [Variables de Entorno](#variables-de-entorno)
- [Benchmarks](#benchmarks)
- [Organización de Tests E2E](#organización-de-tests-e2e)

---

## Servicios de Terceros Integrados

El sitio **secorto_web** integra varios servicios externos que se cargan en
páginas de detalle y de blog:

| Servicio | Uso | Recurso que carga |
| --- | --- | --- |
| **YouTube** | Videos embebidos en charlas | `youtube.com/embed/*` |
| **OneDrive / Google Slides / SlideShare / Speaker Deck / Slides.com** | Presentaciones embebidas en charlas | Visor iframe del proveedor |
| **Giscus** | Sección de comentarios (posts y charlas) | `giscus.app/client.js` + iframe |

---

## Arquitectura de Mocks

### Estructura de Archivos

```text
tests/e2e/helpers/
├── whenMocked.ts       ← Decorador condicional (REAL_THIRD_PARTY)
├── mockGiscus.ts       ← Intercepta giscus.app/client.js
├── mockYouTube.ts      ← Intercepta youtube.com/embed/*
├── mockSlides.ts       ← Intercepta OneDrive, Google Slides, etc.
└── mockThirdParty.ts   ← Compone los tres mocks con Promise.all
```

### Flujo de Ejecución

```ts
test.beforeEach(async ({ page }) => {
  await mockThirdParty(page)        // registra rutas interceptadas
  await page.goto('/es/charlas/..') // navega; requests a terceros → mock
})
```

**Puntos clave:**

- Los mocks se aplican **antes** de cualquier navegación para evitar condiciones
  de carrera
- Cada mock individual se envuelve en un decorador `whenMocked` que consulta
  `process.env.REAL_THIRD_PARTY`
- Si `REAL_THIRD_PARTY=true`, los mocks se omiten y el test usa servicios reales
- `mockThirdParty` agrupa los tres mocks con `Promise.all` para registrarlos en
  paralelo
- Los tests verifican atributos y estructura del DOM, no contenido de iframes
  cross-origin

---

## Ejemplos de Código

### mockYouTube.ts

```typescript
import { Page } from '@playwright/test'
import { whenMocked } from './whenMocked'

export const mockYouTube = whenMocked(async (page: Page) => {
  await page.route('**/youtube.com/embed/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html>
<html><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;font-family:sans-serif">
  <p>YouTube mock</p>
</body></html>`
    })
  })
})
```

### mockGiscus.ts

```typescript
import { Page } from '@playwright/test'
import { whenMocked } from './whenMocked'

export const mockGiscus = whenMocked(async (page: Page) => {
  await page.route('**/giscus.app/client.js', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `window.giscus = { IFrameResizer: {}</n}\n`
    })
  })
})
```

### mockSlides.ts

```typescript
import { Page } from '@playwright/test'
import { whenMocked } from './whenMocked'

export const mockSlides = whenMocked(async (page: Page) => {
  // OneDrive
  await page.route('**/live.com/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<div>Slides mock</div>'
    })
  })

  // Google Slides
  await page.route('**/docs.google.com/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<div>Slides mock</div>'
    })
  })
  // ... más proveedores
})
```

### whenMocked.ts (Decorador Condicional)

```typescript
import { Page } from '@playwright/test'

type MockFn = (page: Page) => Promise<void>

export const whenMocked = (mockFn: MockFn): MockFn => {
  return async (page: Page) => {
    if (process.env.REAL_THIRD_PARTY === 'true') {
      // Si queremos servicios reales, no aplicar el mock
      return
    }
    await mockFn(page)
  }
}
```

### mockThirdParty.ts (Composición)

```typescript
import { Page } from '@playwright/test'
import { mockGiscus } from './mockGiscus'
import { mockYouTube } from './mockYouTube'
import { mockSlides } from './mockSlides'

export const mockThirdParty = async (page: Page) => {
  await Promise.all([mockGiscus(page), mockYouTube(page), mockSlides(page)])
}
```

---

## Variables de Entorno

| Variable | Valor | Efecto |
| --- | --- | --- |
| `REAL_THIRD_PARTY` | *(no definida)* | Se aplican todos los mocks |
| `REAL_THIRD_PARTY` | `true` | Los mocks se omiten; se usan los servicios reales |

### Ejemplos de Uso

```bash
# Ejecutar tests con mocks (por defecto)
npm run test:e2e

# Ejecutar tests sin mocks (servicios reales)
REAL_THIRD_PARTY=true npm run test:e2e

# En CI, ejecutar job nocturno con servicios reales
# (ver .github/workflows/test-e2e.yml)
```

---

## Benchmarks

### Configuración de Prueba

- **Suite de tests:** 12 tests en `charla.a11y.spec.ts`, `charla.spec.ts` y
  `blog.post.spec.ts`
- **Browser:** Chromium
- **Paralelismo:** 6 workers
- **Fecha de medición:** 2025-07

### Resultados

| Test | Con mocks | Sin mocks | Ahorro |
| --- | --: | --: | --: |
| charla detail a11y (es) | 2.5 s | 6.2 s | **3.7 s (60 %)** |
| charla detail a11y (en) | 2.4 s | 5.7 s | **3.3 s (58 %)** |
| charla list a11y (es) | 1.6 s | 1.5 s | -0.1 s |
| charla list a11y (en) | 1.6 s | 1.6 s | 0.0 s |
| charla tag a11y (es) | 1.3 s | 1.4 s | -0.1 s |
| charla tag a11y (en) | 1.3 s | 1.3 s | 0.0 s |
| blog post (es) – título | 720 ms | 3.2 s | **2.5 s (78 %)** |
| blog post (en) – título | 677 ms | 3.0 s | **2.3 s (77 %)** |
| blog post (es) – scroll | 727 ms | 3.1 s | **2.4 s (77 %)** |
| blog post (en) – scroll | 690 ms | 3.0 s | **2.3 s (77 %)** |
| smoke charla (es) | 641 ms | 1.1 s | **0.5 s (45 %)** |
| smoke charla (en) | 769 ms | 1.2 s | **0.4 s (36 %)** |
| **Total suite** | **4.7 s** | **8.1 s** | **3.4 s (42 %)** |

### Análisis

- En páginas de **detalle de charla** (YouTube + slides + Giscus): reducción
  de **~58-60 %** del tiempo de test.
- En páginas de **blog post** (Giscus): reducción de **~77 %** del tiempo de
  test.
- El tiempo total de la suite se reduce de **8.1 s → 4.7 s** (ahorro del
  **42 %**).
- En CI (donde la latencia de red es variable), el ahorro real puede ser
  **mayor** y la principal ganancia es la **eliminación de fallos
  intermitentes** por timeouts de red.

**Nota:** Las páginas de listado y tags no cargan embeds de terceros, por lo que
el mock no impacta su tiempo. El ahorro se concentra en las páginas de
**detalle** (charlas y blog posts) donde se embeben YouTube, slides y Giscus.

---

## Organización de Tests E2E

La suite E2E está organizada en tres categorías:

```text
tests/e2e/
├── a11y/         ← Tests de accesibilidad (axe-core)
│   └── charla.a11y.spec.ts
├── functional/   ← Tests de funcionalidad específica
│   ├── blog.list.spec.ts
│   ├── blog.post.spec.ts        ← usa mockThirdParty
│   ├── color-switch.spec.ts
│   ├── homepage.language.spec.ts
│   ├── menu.spec.ts
│   ├── robots.spec.ts
│   ├── rss.spec.ts
│   ├── theme-load.spec.ts
│   └── theme-persistence.spec.ts
├── helpers/      ← Mocks y utilidades compartidas
│   ├── mockGiscus.ts
│   ├── mockSlides.ts
│   ├── mockThirdParty.ts
│   ├── mockYouTube.ts
│   └── whenMocked.ts
└── smoke/        ← Tests de humo (verificación rápida)
    ├── charla.spec.ts            ← usa mockThirdParty
    ├── community.titles.spec.ts
    ├── footer.spec.ts
    ├── homepage.spec.ts
    ├── project.titles.spec.ts
    └── work.titles.spec.ts
```

---

## Referencias Relacionadas

- [Playwright: Network routing](https://playwright.dev/docs/network#modify-requests)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
  — Kent C. Dodds
- [docs/TESTING_STRATEGY.md](../../TESTING_STRATEGY.md) — Estrategia general de
  testing del proyecto
- [docs/architecture/TESTING_STRATEGY.md](../../architecture/TESTING_STRATEGY.md)
  — Detalles adicionales sobre estrategia de tests
