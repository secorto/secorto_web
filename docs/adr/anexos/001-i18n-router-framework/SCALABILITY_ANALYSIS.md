# Análisis de Escalabilidad

Este documento ilustra cómo la arquitectura propuesta escala al agregar secciones, comparando el enfoque tradicional (archivos por sección) con la solución polimórfica basada en configuración.

## Estado inicial (3 secciones)

Ejemplo de configuración inicial:

```ts
const initialConfig = {
  blog: { collection: 'blog', routes: { es: 'blog', en: 'blog' } },
  talk: { collection: 'talk', routes: { es: 'charla', en: 'talk' } },
  work: { collection: 'work', routes: { es: 'trabajo', en: 'work' } }
}
```

- Rutas generadas: 3 × 2 = 6
- Archivos de routing (en sistema nuevo): 1
- Complejidad: O(1)

## Iteraciones de ejemplo

### Iteración 1 — agregar `project` y `community`

```ts
const expandedConfig = {
  ...initialConfig,
  project: { collection: 'projects', routes: { es: 'proyecto', en: 'project' } },
  community: { collection: 'community', routes: { es: 'comunidad', en: 'community' } }
}
```

### Iteración 2 — agregar `events`, `resources`, `tutorials`

```ts
const scaledConfig = {
  ...expandedConfig,
  events: { collection: 'events', routes: { es: 'eventos', en: 'events' } },
  resources: { collection: 'resources', routes: { es: 'recursos', en: 'resources' } },
  tutorials: { collection: 'tutorials', routes: { es: 'tutoriales', en: 'tutorials' } }
}
```

### Iteración 3 — agregar `newsletter`, `external`, `testimonials`

```ts
const massiveConfig = {
  ...scaledConfig,
  newsletter: { collection: 'newsletter', routes: { es: 'boletin', en: 'newsletter' } },
  external: { collection: 'external', routes: { es: 'externos', en: 'external' } },
  testimonials: { collection: 'testimonials', routes: { es: 'testimonios', en: 'testimonials' } }
}
```

## Comparación: Antes vs Después

### Antes (archivos por sección)

- Para 3 secciones: 3 archivos de routing, ~69 líneas, muchos puntos de cambio (~15+), complejidad O(n)
- Para 8 secciones: 8 archivos de routing, ~184 líneas, muchos puntos de cambio (~40+), complejidad O(n)

### Después (sistema polimórfico)

- Para 3 secciones: 1 archivo de routing, ~20–60 líneas en `sections.ts`, 1 punto de cambio, complejidad O(1)
- Para 8–11 secciones: 1 archivo de routing, crecimiento en datos en `sections.ts`, puntos de cambio: 1

### Resumen comparativo

| Escenario | Archivos (antes → después) | Líneas (antes → después) |
|---|---:|---:|
| 3 secciones | 3 → 1 | 69 → 60 |
| 8 secciones | 8 → 1 | 184 → 45 |
| 11 secciones | 11 → 1 | 253 → 60 |

## Tiempo de implementación (estimado)

**Antes**: ~40 min por nueva sección (crear archivos, copiar, actualizar rutas, tests manuales)

**Después**: ~4 min por nueva sección (añadir entrada en `sections.ts`, traducciones, build)

**Ahorro aproximado**: ~36 minutos por sección

## Caso real: proyección (equipo de 3)

- Crecer de 3 a 11 secciones (8 nuevas):
  - Antes: ~800 minutos (~13.3 h)
  - Después: ~32 minutos (~0.5 h)
  - Ahorro: ~12.8 horas

## Conclusión

La arquitectura polimórfica reduce duplicación, centraliza puntos de cambio y minimiza el coste de añadir nuevas secciones. Recomendado validar estas estimaciones en el entorno local con `./validate-architecture.sh`.

> Nota: cifras y tiempos son estimaciones para comparación; ajusta según tu contexto y métricas reales.
