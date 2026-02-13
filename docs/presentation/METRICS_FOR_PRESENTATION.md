# Métricas clave para la presentación

Breve resumen de métricas y puntos para diapositiva (usa esto como guion).

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

## Slides sugeridas (3–4 bullets por slide)

Slide 1 — Resumen rápido
- `Con mocks: 4.7 s` vs `Sin mocks: 8.1 s` → `-42 %` tiempo total
- 12 tests medidos (charla + blog posts)
- Mocks = velocidad + determinismo

Slide 2 — Detalle por caso
- Charla detail: `-60 %`
- Blog post (Giscus): `-77 %`
- Nota: lists/tags sin cambio

Slide 3 — Impacto en flujo de trabajo
- Unit tests: 165+ tests, cobertura 100 %
- Migración a Playwright + Vitest habilita multi-navegador y sin límite de ejecuciones
- Menos flakiness → menos re-ejecuciones y ahorro de tiempo humano

Slide 4 — Recomendaciones / próxima acción
- Mantener mocks en la suite rápida de CI (smoke + a11y) y ejecutar integración real
  periódica (`REAL_THIRD_PARTY=true`) en pipeline nocturno
- Incluir el ADR de mocks en tu presentación (docs/adr/003-third-party-mocks.md)
- Mostrar la inversión en automatización (tiempo ahorrado vs coste de herramientas)

## Notas técnicas rápidas para la diapositiva
- Comando para ejecutar con mocks (por defecto):

```bash
npx playwright test tests/e2e/a11y/charla.a11y.spec.ts \
  tests/e2e/smoke/charla.spec.ts \
  tests/e2e/functional/blog.post.spec.ts --project=chromium --reporter=list
```

- Con servicios reales (para validación completa):

```bash
REAL_THIRD_PARTY=true npx playwright test tests/e2e/a11y/charla.a11y.spec.ts \
  tests/e2e/smoke/charla.spec.ts \
  tests/e2e/functional/blog.post.spec.ts --project=chromium --reporter=list
```

---

Archivo generado automáticamente para la presentación. ¿Quieres que
convierta estos bullets en una diapositiva `.pptx` o en un `md` estilo deck (Remark/Reveal)?
