# Métricas

## Comparación directa

| Criterio | Cypress | Playwright |
| --- | --- | --- |
| Límite mensual CI | **500 ejecuciones** (Cloud) | **Sin límite** |
| Navegadores | Chromium, Firefox | Chromium, Firefox, **WebKit** |
| Interceptación de red | `cy.intercept()` | `page.route()` (más flexible) |
| Multi-tab/ventana | ❌ | ✅ |
| Traces/debugging | Video + screenshots (~pesados) | Trace ZIP (~livianos) |
| Page Object Model | Manual | Fixtures nativos |
| Coste (CI recording) | Gratis limitado / pago | Gratis ilimitado |
| API de mocking | Limitada | `route.fulfill()` con body, headers, status |

| Criterio | — (sin framework) | Vitest |
| --- | --- | --- |
| Tests unitarios | No existían | 165+ tests |
| Cobertura | No medible | 100 % (statements, branches, functions, lines) |
| Velocidad | — | < 1 s toda la suite |
| Mocking | — | `vi.mock()`, `vi.fn()`, `vi.spyOn()` |
| TypeScript | — | Nativo |

## Resumen ejecutivo

- Suite E2E seleccionada ejecutada (12 tests, Chromium, 6 workers)
- Tiempo total con *mocks* aplicados: **4.7 s**
- Tiempo total sin *mocks* (servicios reales): **8.1 s**
- Ahorro absoluto: **3.4 s** (≈ **42 %** reducción) en el subset medido

## Ahorro por tipo de página (ejemplos)

- Charla (detalle) — con mocks: 2.5 s vs sin mocks: 6.2 s → ahorro **~60 %**
- Blog post (con Giscus) — con mocks: ~0.7 s vs sin mocks: ~3.1 s → ahorro **~77 %**
- Páginas de listas/tags — sin impacto significativo (no cargan embeds)

## Impacto total y razonamiento

- El ahorro se concentra en páginas de detalle que embeben reproductores
  y visores externos (YouTube, Slides, Giscus). Las páginas index/listado no
  se benefician significativamente.
- En CI el beneficio real suele ser mayor porque elimina variabilidad de red
  y fallos intermitentes por timeouts.
- Además de la velocidad, los mocks mejoran el determinismo y reducen flakiness,
  lo que reduce re-ejecuciones y coste humano en debugging.

## Métricas de cobertura y productividad

- Tests unitarios: **165+ tests**, cobertura **100 %** (statements, branches, functions, lines)
- E2E: reorganizados en `a11y/`, `functional/`, `smoke/` con mocks centrales
- Tiempo estimado ahorrado en desarrollo (por ti): la adopción de Copilot/IA
  permitió acelerar el desarrollo de la épica de unit testing — estimación
  personal: completaste en ~1 mes lo que manualmente habría tardado hasta Junio
  (≈ 2.5× productividad comparada con tu métrica laboral)
