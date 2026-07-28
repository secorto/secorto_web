# Page Objects (POM) – Guía Rápida

**Conceptos clave:** FLOW + STEP

> **Flow = unidad de composición, reutilización y significado**
>
> **Step (`step()` / `verifyStep()`) = unidad de ejecución y observabilidad en runtime**

En esta base de código:
- Escribes tests en términos de **flows**
- Los flows se materializan en **steps** observables en reportes

---

## 📋 Quick Start

### Paso 1: Test Replay Inicial (directo, sin abstraer)

```typescript
// content.spec.ts
test('filter blog by tag', async ({ page }) => {
  await page.goto('/blog')

  await step('filter by typescript', async () => {
    await page.locator('[data-testid="tag-link-typescript"]').click()
  })

  await verifyStep('filtered results visible', async ({ expect }) => {
    const items = page.locator('[href*="/blog/"]')
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })
})
```

✅ **Está bien así** si lo usas una sola vez.

### Paso 2: Cuando Repites → Extrae a Component o Page

Si necesitas el mismo patrón en otro test, ya es un **flow**. Agrúpalo donde tenga sentido.

**Si es sobre 1 elemento:**  
Ubicación: `tests/support/ui/components/`  
Ej: [Target.ts](../../tests/support/ui/components/Target.ts) expone métodos (flows) sobre un selector

**Si es sobre 1 vista:**  
Ubicación: `tests/support/ui/content/pages/`  
Ej: [ContentListPage.ts](../../tests/support/ui/content/pages/ContentListPage.ts) expone métodos como `filterByTag()`, cada uno un flow

✅ **Ganancia**: Flow reusable + Steps reportables + 1 lugar para cambiar selectores.

### Paso 3: Cuando Orquestas Múltiples Vistas → Support Flows

Si tu test cruza múltiples Pages:

Ubicación: `tests/support/ui/content/flows/`  
Patrón: función con `step()` que orquesta pages  
Ej: [BlogFlow.ts](../../tests/support/ui/content/flows/BlogFlow.ts) expone `userInBlogList()`, `userInBlogPost()`

✅ **Ganancia**: Flow reusable independiente del modelo CPOM.

---

## 🧭 Regla Operativa

- **Test**: compone flows (`await userInBlogList()`)
- **Flow**: expresa intención (`filterByTag`, `openPost`, `shouldHaveTags`)
- **Step**: hace observable esa intención en reporte (`step`, `verifyStep`)

Atajo mental:
- **Flow = qué significa**
- **Step = cómo se ejecuta y cómo se observa**

---

## 📊 Tabla de Decisión: CPOM por Alcance

| Alcance | Ubicación | Patrón | Ejemplo |
|---------|-----------|--------|---------|
| 1 elemento | `tests/support/ui/components/` | Método en clase Component | `target('title').shouldHaveText()` |
| 1 vista | `tests/support/ui/content/pages/` | Método en clase Page | `blog.filterByTag('typescript')` |
| Múltiples vistas | `tests/support/ui/content/flows/` | Función independiente | `userInBlogList()`, `userInBlogPost()` |

---

## ✅ Referencias: Tu Codebase

- [Target.ts](../../tests/support/ui/components/Target.ts) – component (flows sobre selectores)
- [ContentListPage.ts](../../tests/support/ui/content/pages/ContentListPage.ts) – page (flows sobre vista)
- [BlogFlow.ts](../../tests/support/ui/content/flows/BlogFlow.ts) – flow (orquesta pages)
