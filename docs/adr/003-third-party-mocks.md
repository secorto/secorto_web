# ADR: Mocks de servicios de terceros en tests E2E

> **Estado:** Aceptada
> **Fecha:** 2025-07-11
> **Categoría:** Testing / Rendimiento / Arquitectura

---

## Contexto

El sitio **secorto\_web** integra varios servicios externos que se cargan en
páginas de detalle y de blog:

| Servicio | Uso | Recurso que carga |
|---|---|---|
| **YouTube** | Videos embebidos en charlas | `youtube.com/embed/*` |
| **OneDrive / Google Slides / SlideShare / Speaker Deck / Slides.com** | Presentaciones embebidas en charlas | Visor iframe del proveedor |
| **Giscus** | Sección de comentarios (posts y charlas) | `giscus.app/client.js` + iframe |

Estas dependencias provocaban problemas en la suite E2E:

1. **Lentitud:** cada test debía esperar la descarga de scripts pesados,
   reproductores de video y visores de presentaciones.
2. **Flakiness:** los tests dependían de la disponibilidad de servicios
   externos; cualquier timeout de red causaba fallos intermitentes en CI.
3. **No-determinismo:** el contenido de los iframes de terceros podía cambiar
   sin previo aviso, rompiendo aserciones.

---

## Decisión

Interceptar las peticiones a servicios de terceros con `page.route()` de
Playwright y devolver respuestas HTML/JS livianas (mocks) que satisfacen la
estructura esperada por el DOM sin descargar recursos reales.

### Principios de diseño

- **Decorador `whenMocked`:** cada mock individual se envuelve en un decorador
  que consulta `process.env.REAL_THIRD_PARTY`. Si vale `'true'`, el mock no se
  registra y el test usa los servicios reales.
- **Composición:** `mockThirdParty` agrupa los tres mocks (`mockGiscus`,
  `mockYouTube`, `mockSlides`) con `Promise.all` para registrarlos en paralelo.
- **Registro antes de navegar:** los mocks se aplican **antes** de cualquier
  `page.goto()` para evitar condiciones de carrera.
- **Verificar atributos, no contenido externo:** los tests verifican que el
  widget se montó (e.g. `iframe.giscus-frame` visible) o que se pasaron los
  atributos correctos (`data-lang`, `data-repo`), sin inspeccionar el
  contenido interno de un iframe cross-origin.

---

## Arquitectura de los mocks

```
tests/e2e/helpers/
├── whenMocked.ts       ← Decorador condicional (REAL_THIRD_PARTY)
├── mockGiscus.ts       ← Intercepta giscus.app/client.js
├── mockYouTube.ts      ← Intercepta youtube.com/embed/*
├── mockSlides.ts       ← Intercepta OneDrive, Google Slides, etc.
└── mockThirdParty.ts   ← Compone los tres mocks con Promise.all
```

### Flujo

```
test.beforeEach(async ({ page }) => {
  await mockThirdParty(page)        // registra rutas interceptadas
  await page.goto('/es/charlas/..') // navega; requests a terceros → mock
})
```

### Ejemplo: `mockYouTube`

```typescript
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

### Variable de entorno

| Variable | Valor | Efecto |
|---|---|---|
| `REAL_THIRD_PARTY` | *(no definida)* | Se aplican todos los mocks |
| `REAL_THIRD_PARTY` | `true` | Los mocks se omiten; se usan los servicios reales |

```bash
# Con mocks (por defecto)
npx playwright test

# Sin mocks (servicios reales)
REAL_THIRD_PARTY=true npx playwright test
```

---

## Medición de impacto

Pruebas ejecutadas: 12 tests en `charla.a11y.spec.ts`, `charla.spec.ts` y
`blog.post.spec.ts` sobre Chromium, 6 workers en paralelo.

### Resultados

| Test | Con mocks | Sin mocks | Ahorro |
|---|--:|--:|--:|
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

> **Nota:** Las páginas de listado y tags no cargan embeds de terceros, por lo
> que el mock no impacta su tiempo. El ahorro se concentra en las páginas de
> **detalle** (charlas y blog posts) donde se embeben YouTube, slides y Giscus.

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

---

## Organización de tests E2E

La suite E2E está organizada en tres categorías:

```
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

## Consecuencias

### Positivas

- **Velocidad:** 42 % menos de tiempo en tests que cargan contenido de
  terceros; más pronunciado en CI.
- **Determinismo:** los tests ya no dependen de la disponibilidad ni del
  contenido de servicios externos.
- **Mantenibilidad:** agregar un nuevo proveedor solo requiere crear un archivo
  `mockNuevoServicio.ts`, envolverlo con `whenMocked` e incluirlo en
  `mockThirdParty.ts`.
- **Flexibilidad:** con `REAL_THIRD_PARTY=true` se pueden ejecutar los tests
  contra los servicios reales para validación completa cuando sea necesario.

### A tener en cuenta

- Los mocks no prueban la integración real con los servicios externos; si un
  proveedor cambia su API o estructura, los mocks no lo detectarán.
- Se recomienda ejecutar periódicamente la suite con `REAL_THIRD_PARTY=true`
  (por ejemplo, en un job de CI nocturno) para detectar roturas de
  integración.

---

## Referencias

- [Playwright: Network — `page.route()`](https://playwright.dev/docs/network#modify-requests)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) — Kent C. Dodds
- [docs/TESTING_STRATEGY.md](./TESTING_STRATEGY.md) — Estrategia general de testing del proyecto
