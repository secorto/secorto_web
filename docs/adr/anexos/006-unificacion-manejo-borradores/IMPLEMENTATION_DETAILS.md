# ADR 006 - Detalles de Implementación

**Referencia:** [ADR 006 - Unificación del manejo de borradores (`draft`)](../../006-unificacion-manejo-borradores.md)

Este anexo documenta los detalles técnicos, cambios de archivos y notas de
implementación para la unificación del campo `draft` como única fuente de verdad
para indicar borradores.

---

## Plan de Migración

### Fase 1: Actualizar Schema

1. Actualizar `src/content.config.ts` para aceptar `draft?: boolean` en el
   schema base.
   - Permite que todas las colecciones acepten el campo sin cambios manuales
     en cada post.
   - Campo opcional: archivos sin `draft` se tratan como `draft: false`.

### Fase 2: Actualizar Utilidades y Plantillas

1. Actualizar `src/utils/paths.ts` para filtrar por `draft === true`:
   - Excluir entradas donde `data.draft === true` de listados públicos.
   - Eliminar casts inseguros (evitar `any`).
   - Usar comprobaciones en tiempo de ejecución sobre `Record<string, unknown>`.

2. Actualizar `src/domain/post.ts`:
   - Helpers de dominio (p. ej. `getSeoDescription`) y lógica de SEO deben
     depender únicamente de `draft`, no de `translation_status`.
   - Eliminar inferencias automáticas sobre `translation_status` en el flujo
     principal.

3. Actualizar plantillas de vista:
   - `src/pages/[locale]/[section]/[...id].astro`: mostrar aviso de borrador
     únicamente cuando `entry.data.draft === true`.
   - Eliminar lógica condicional que inferira borradores desde `translation_status`.

4. Tipado: añadir `draft?: boolean` en el tipo local `BaseEntryData` para
   evitar casteos.

### Fase 3: Tests

1. Adaptar pruebas unitarias para usar `draft` (`entry.data.draft`) como
   fuente de verdad.
   - Eliminar dependencia en helpers de compatibilidad.
   - Reescribir tests para cubrir la nueva interfaz.

### Fase 4: Migración de Datos

1. Ejecutar un script que identifique archivos con `translation_status: 'draft'`
   y proponga (o aplique con turno manual) `draft: true`.
   - Modo preview recomendado antes de aplicar cambios masivos.

### Fase 5: Documentación

1. Actualizar `docs/CONTENT_POLICY.md` para reflejar la nueva convención.

---

## Cambios por Archivo

### `src/content.config.ts`

- **Cambio:** añadir `draft?: boolean` al schema base.
- **Efecto:** todas las colecciones heredan el campo automáticamente.
- **Validación:** campo booleano opcional, valor por defecto `undefined`
  (equivalente a `false` en comportamiento de filtrado).

### `src/utils/paths.ts`

- **Cambio:** filtro por `data.draft === true` en funciones que generan
  listados (p. ej. `getPosts()`, `getTalks()`, etc.).
- **Efecto:** entradas con `draft: true` se excluyen de:
  - Listados públicos (blogs, talks, portfolio, etc.).
  - Feeds RSS/sitemap.
  - Índices generados.
- **Tipado:** usar comprobaciones en tiempo de ejecución para evitar `any`.
  Ejemplo:

  ```typescript
  if (typeof entry.data === 'object' && entry.data !== null && entry.data.draft === true) {
    // Filtrar este entry
  }
  ```

### `src/domain/post.ts`

- **Cambio:** lógica de SEO (canonical, noindex, avisos) depende únicamente
  de `draft`.
- **Efecto:**
  - Si `draft: true`, marcar con `noindex` en SEO.
  - Si `draft: true`, mostrar aviso de "contenido en borrador" en detalle.
  - Si `draft: false`, comportamiento normal (indexable).
- **Eliminación:** remover cualquier lógica que infiera `draft` desde
  `translation_status`.

### `src/pages/[locale]/[section]/[...id].astro`

- **Cambio:** renderizar aviso de borrador solo si `entry.data.draft === true`.
- **Efecto:** UI clara y consistente.
- **Ejemplo:**

  ```astro
  {entry.data.draft && <DraftWarning />}
  ```

### `src/types/` (tipo local `BaseEntryData`)

- **Cambio:** añadir campo `draft?: boolean`.
- **Efecto:** type safety en templates y helpers.
- **Ejemplo:**

  ```typescript
  export interface BaseEntryData {
    draft?: boolean
    // ... otros campos
  }
  ```

### Tests en `tests/unit/`

- **Cambio:** usar `entry.data.draft` como fuente de verdad en fixtures y
  assertions.
- **Efecto:** suite pasa completamente tras los cambios.
- **Ejemplo:**

  ```typescript
  const entry = { data: { draft: true } }
  expect(paths.isVisible(entry)).toBe(false)
  ```

---

## Notas de Implementación

### Prioridades

1. **Eliminar compatibilidad retro en runtime:** para evitar lógica dispersa y
   ambigua.
   - No crear helpers que infieran `draft` desde `translation_status`.
   - Si es necesario preservar esa lógica, hacerlo en scripts de migración
     (offline), no en code paths principales.

2. **Eliminar `any` y casts inseguros** en puntos críticos:
   - `paths.ts`: usar type guards (typeof checks).
   - Templates: usar frontmatter con tipos explícitos.

3. **Resultado esperado:** comportamiento determinista.
   - Solo `draft: true` controla la visibilidad y SEO en la web.
   - No hay inferencias implícitas desde metadata histórica.

### Migración de Datos Existentes

Si existen archivos con `translation_status: 'draft'`, crear un script que:

1. Identifique todos los archivos con ese valor.
2. Genere un preview (dry-run) mostrando cambios propuestos.
3. Permita aplicar cambios manualmente o de forma controlada.

**Script propuesto (pseudocódigo):**

```typescript
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// Iterar content/ recursivamente
// Para cada archivo .md:
//   - Extraer frontmatter
//   - Si translation_status === 'draft' → proponer draft: true
//   - Mostrar diff
//   - Aplicar (opcionalmente)
```

### Rollback / Reversibilidad

- Si se necesita revertir, `translation_status` puede permanecer en archivos
  como metadata histórica.
- El código no dependerá de ese campo, así que su presencia no causa problemas.
- Limpiar `translation_status` puede hacerse en una fase posterior si se
  considera necesario.

---

## Validación Post-Implementación

Checklist de verificación después de implementar cambios:

- [ ] `npm run test:unit` pasa (tests adaptados a nueva interfaz).
- [ ] `npm run test:e2e` pasa (flujos de usuario aún funcionan).
- [ ] `npm run lint` pasa (sin `any`, types correctos).
- [ ] Listados públicos (blog, talks, etc.) excluyen entradas con `draft: true`.
- [ ] Entradas con `draft: true` muestran aviso en detalle.
- [ ] Entradas con `draft: true` tienen `noindex` en SEO.
- [ ] Documentación (`docs/CONTENT_POLICY.md`) actualizada.
- [ ] Script de migración (si aplica) validado en dry-run.

---

## Referencias

- **ADR 006:** [Unificación del manejo de borradores (`draft`)](../../006-unificacion-manejo-borradores.md)
- **Documentación de Contenido:** [docs/CONTENT_POLICY.md](../../CONTENT_POLICY.md)
- **Arquitectura de Dominio:** [docs/architecture/](../../architecture/)
