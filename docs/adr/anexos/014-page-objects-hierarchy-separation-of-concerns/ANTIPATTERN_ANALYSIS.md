# Antipattern Analysis: Herencia Inflexible en POM Content

**Fecha:** 2026-08-01
**Contexto:** Análisis post-refactorización de POM Content
**Referencia:** ADR 014 — Page Objects Hierarchy

## Resumen Ejecutivo

En la implementación inicial del Page Object Model para Content
(blog, project, work, community, talk), se **violaron los principios
establecidos en ADR 014** mediante una jerarquía basada en herencia inflexible.

Este documento analiza:

1. **La estructura problemática implementada**
2. **Problemas concretos generados**
3. **Por qué violó ADR 014**
4. **Raíz causa del antipattern**

---

## El Problema Identificado

### Estructura Implementada (Incorrecta)

```text
ContentPage (base inflexible)
├── clickTag() — método genérico hardcodeado
├── tags — propiedad compartida
├── headerTitle — propiedad compartida
│
├── ContentListPage (hereda)
│   ├── clickItem() — DUPLICADO en ContentTagsPage
│   ├── shouldRenderTagsForSection() — DUPLICADO
│   ├── filterByTag()
│   └── ... otros métodos de lista
│
├── ContentDetailPage (hereda)
│   └── shouldHaveComments()
│
├── ContentPostDetailPage (hereda) ← ALIAS innecesario
│   └── shouldHaveComments() — idéntico a ContentDetailPage
│
├── ContentExperienceDetailPage (hereda)
│   ├── shouldHaveRole()
│   ├── shouldHaveResponsibilities()
│   └── ... métodos específicos de experience
│
└── ContentTagsPage (hereda)
    ├── clickItem() — DUPLICADO de ContentListPage
    ├── shouldRenderTagsForSection() — DUPLICADO
    └── shouldHaveFilteredTitle()
```

### Problemas Concretos Documentados

| # | Problema | Ubicación | Severidad | Impacto |
| --- | --- | --- | --- | --- |
| 1 | Alias duplicado | `ContentPostDetailPage` ≅ `ContentDetailPage` | Alto | Duplicación |
| 2 | `clickItem()` dup | ContentListPage + ContentTagsPage | Alto | 2 updates |
| 3 | `shouldRenderTagsForSection()` dup | Ambas clases | Alto | 2 updates |
| 4 | Selector hardcoded | `[href*="/tags/${tag}"]` | Medio | 1 update |
| 5 | Selector hardcoded | `[href="${href}"]` en ambas | Medio | 2 updates |
| 6 | Selector hardcoded | `[data-testid^="tag-link-"]` | Medio | 2 updates |
| 7 | DRY violation | Lógica esparcida | Alto | Frágil |
| 8 | Sin cobertura | Tests fragmentados | Alto | Sin flujo |

### Análisis Línea-por-Línea

#### Duplicación 1: `clickItem()` idéntico

**ContentListPage.ts (L62-67):**

```typescript
clickItem(href: string, title: string) {
  return step(title, async () => {
    await this.itemLinks.get(href).locator.click()
  })
}
```

**ContentTagsPage.ts (L37-42):**

```typescript
clickItem(href: string, title: string) {  // ← IDÉNTICO
  return step(title, async () => {
    await this.itemLinks.get(href).locator.click()
  })
}
```

**Por qué es problema:** Cambiar la lógica requiere actualizar
2 archivos. Violación de DRY.

#### Duplicación 2: `shouldRenderTagsForSection()` idéntico

**ContentListPage.ts (L71-82):**

```typescript
shouldRenderTagsForSection() {
  return verifyStep(`${this.name} list renders available tags`, async ({ expect }) => {
    await expect(this.tags.locator).toBeVisible()
    const tagLinks = this.tags.locator.locator('[data-testid^="tag-link-"]')  // ← Hardcoded
    await expect.poll(async () => tagLinks.count()).toBeGreaterThan(0)
  })
}
```

**ContentTagsPage.ts (L46-57):**

```typescript
shouldRenderTagsForSection() {  // ← IDÉNTICO
  return verifyStep(`${this.name} tags renders available tags`, async ({ expect }) => {
    await expect(this.tags.locator).toBeVisible()
    const tagLinks = this.tags.locator.locator('[data-testid^="tag-link-"]')  // ← Hardcoded
    await expect.poll(async () => tagLinks.count()).toBeGreaterThan(0)
  })
}
```

**Por qué es problema:** El selector está hardcodeado en ambas.
Refactor HTML = 2 updates.

#### Alias innecesario: `ContentPostDetailPage`

**ContentPostDetailPage.ts:**

```typescript
export class ContentPostDetailPage extends ContentPage {
  constructor(...readonly comments: CommentsComponent) {}
  shouldHaveComments(locale: UILanguages) {
    // ← Idéntico a ContentDetailPage
  }
}

export function contentPostDetailPage(page: Page, name: string): ContentPostDetailPage {
  // ← Factory innecesaria
}
```

**Por qué es problema:** Es alias 100% de `ContentDetailPage`.
¿Cuál usar?

### Raíz Causa del Antipattern

La herencia se utilizó para **reutilizar propiedades comunes**
(`tags`, `headerTitle`, `page`), pero causó:

1. **No respetó SRP** — ContentListPage y ContentTagsPage comparten 80%
2. **No permitió composición** — MainLayout no se reutilizó
3. **Selectores esparcidos** — cambios = múltiples archivos
4. **No escaló** — agregar especialización contaminaba base

---

## Violaciones Específicas de ADR 014

ADR 014 especifica: *"Cada clase tiene UNA responsabilidad clara.
El tipo de retorno comunica exactamente qué contexto se está probando."*

| Principio | Violación | Evidencia |
| --- | --- | --- |
| SRP | Duplicado 80% | `clickItem()` + `shouldRenderTagsForSection()` |
| Intención | Alias innecesario | `ContentPostDetailPage` = copia |
| Escalabilidad | Contamina base | `ContentPage.clickTag()` confunde |
| Mantenibilidad | N updates | `[data-testid^="tag-link-"]` × 2+ |
| Testabilidad | Sin navegación | Solo aislados |

---

## Impacto Medible

### En código

- **800 líneas** de POM (con duplicación)
- **3 métodos** completamente duplicados
- **3 selectores** hardcodeados en múltiples lugares
- **15+ test files** fragmentados

### En comportamiento

- **Cambiar 1 selector** = modificar 2-3 archivos
- **Agregar nueva sección** = riesgo alto de contaminar ContentPage
- **Tests de navegación** = ausentes (solo fragmentos aislados)
- **Firefox memory** = overhead de tests fragmentados

---

## Conclusión

Este antipattern fue **predecible y evitable** si se hubiera seguido ADR 014 desde el inicio.

**No debería haber:**

- Herencia (ContentPage como base inflexible)
- ContentPostDetailPage (alias innecesario)
- Métodos duplicados (DRY violation)
- Selectores hardcodeados esparcidos

La refactorización restituye la arquitectura de ADR 014 usando
**composición + DI puro** (patrón `Target` + `TargetSelector` de HighlightCard.ts),
que es **más limpia, escalable y mantenible**.

### Patrón Correcto (HighlightCard.ts)

```typescript
// ✅ Componente agnóstico, selectores inyectados
export class TagsComponent {
  constructor(
    readonly container: Target,
    readonly tagLink: TargetSelector<string>, // selector inyectado
  ) {}
}

export function tagsComponent(containerLocator: Locator) {
  return new TagsComponent(
    target('tags', containerLocator),
    targetSelector('tag link', (tag) => containerLocator.locator(`[href*="/tags/${tag}"]`)),
  )
}
```

**Ventaja clave:** Componente NO conoce selectores concretos.
Están **inyectados** en el factory. Cambiar selector = 1 lugar.
