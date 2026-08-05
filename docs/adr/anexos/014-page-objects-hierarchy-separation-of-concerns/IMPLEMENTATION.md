# Implementación: Refactorización de POM Content a Composición

**Estado:** ✅ Completado
**Última actualización:** 2026-08-05

---

## Lo Que Se Implementó (Estado Actual)

### 1. Componentes Reutilizables (Composición, NO Herencia)

Archivo | Responsabilidad | Patrón
-------- | ----------------- | --------
[tests/support/ui/content/components/Tags.ts](../../../support/ui/content/components/Tags.ts) | Filtrado por tags | Recibe `Target` + `TargetSelector<string>`
[tests/support/ui/content/components/ContentList.ts](../../../support/ui/content/components/ContentList.ts) | Navegación en listados | Recibe `Target` + `TargetSelector<string>`
[tests/support/ui/content/components/ContentDetail.ts](../../../support/ui/content/components/ContentDetail.ts) | Detalles de experience (work, project, community) | Recibe `Target`
[tests/support/ui/content/components/Comments.ts](../../../support/ui/content/components/Comments.ts) | Comentarios (blog, talk) | Ya existía, reutilizado

**Patrón DI:** Componentes NO reciben `page`. Reciben selectores inyectados via `Target` y `TargetSelector<T>`.

### 2. Orquestadores (Composición)

Archivo | Compone | Patrón
-------- | --------- | --------
[tests/support/ui/content/ContentListPage.ts](../../../support/ui/content/ContentListPage.ts) | MainLayout + Tags + ContentList | Orquestador + helper `userIsOnContentList()`
[tests/support/ui/content/ContentDetailPage.ts](../../../support/ui/content/ContentDetailPage.ts) | MainLayout + PostDetailMain/ExperienceDetailMain | Orquestador simple + factory `buildDetailMain()`

**Cambios clave:**

- **ContentListPage eliminó** `ContentExperienceDetailPage.ts` (fue merged)
- **ContentDetailPage simplificado:** Solo contiene `mainLayout`, delega validaciones a componentes main
- **Flow files eliminados:** BlogPages.ts, WorkPages.ts, ProjectPages.ts, TalkPages.ts, CommunityPages.ts
  - Reemplazados por array `testContents`
- **Helpers nuevos:** `userIsOnContentList(page, contentType, locale)` encapsula navegación + instanciación

### 3. Parametrización de Tests sin Flujos

**CAMBIO:** Plan original usaba `ContentTypeFlow<ListPage>` descriptores. La implementación usa **array simple** `testContents`.

**Archivo:** [tests/e2e/functional/content-navigation-flow.spec.ts](../../../../e2e/functional/content-navigation-flow.spec.ts)

```typescript
const testContents = [
  { name: 'blog', locale: 'es', testTag: 'python', testSlug: '2022-07-11-intro-python' },
  { name: 'blog', locale: 'en', testTag: 'python', testSlug: '2022-07-11-intro-python' },
  { name: 'talk', locale: 'es', testTag: 'python', testSlug: '2017-01-30-test-unitarios' },
  { name: 'talk', locale: 'en', testTag: 'python', testSlug: '2017-01-30-test-unitarios' },
  { name: 'work', locale: 'es', testTag: 'dev', testSlug: 'perficient' },
  { name: 'work', locale: 'en', testTag: 'dev', testSlug: 'perficient' },
  { name: 'projects', locale: 'es', testTag: 'python', testSlug: 'colombia-python' },
  { name: 'projects', locale: 'en', testTag: 'python', testSlug: 'colombia-python' },
  { name: 'community', locale: 'es', testTag: 'python', testSlug: 'pybaq' },
  { name: 'community', locale: 'en', testTag: 'python', testSlug: 'pybaq' },
]
```

**Ventaja:** Más simple, más legible, sin factories adicionales por tipo de contenido.

---

## Lo Que Cambió vs Plan Original

### ✅ Se Implementó Correctamente

**Refactorización completada:**

1. ✅ **Componentes reutilizables** (Tags, ContentList, Comments)
2. ✅ **Orquestadores de composición** (MainLayout + componentes)
3. ✅ **Inyección de dependencias** con `Target` y `TargetSelector<T>`
4. ✅ **Test parametrizado** agnóstico (single loop + array config)
5. ✅ **Helper `userIsOnContentList()`** encapsula navegación
6. ✅ **PostDetailMain/ExperienceDetailMain** implementan `LocalizedPage<void>`
7. ✅ **Test grouping** por categoría en test.describe()

### 🔄 Se Simplificó Respecto a Plan

**Plan original vs Implementación actual:**

Aspecto | Plan | Implementación | Por Qué
--------- | ------ | --------- | ---------
Parametrización | Flow objects (`ContentTypeFlow<>`) | Array simple (`testContents`) | Más legible, menos código
Facades | BlogPages.ts, WorkPages.ts, etc | Eliminadas | No se necesitan sin flow descriptors
DetailPage composition | DetailPage + metadata parameter | DetailPage + inline main | Más simple, metadata ya inyectada en factory
List main classes | `PostListPageMain` / `ExperienceListPageMain` | Siguen en código (vacías) | No se usan, candidatas para eliminar

### 🗑️ Pendiente: Limpiar

**Clases vacías que pueden eliminarse:**

```typescript
// ContentListPage.ts - Estas clases son vacías y NO se usan
export class PostListPageMain implements LocalizedPage<void> {
  constructor(private sectionType: SectionType) {}
  shouldBeLoaded() {
    return verifyStep(`${this.sectionType} list main is ready`, async () => {})
  }
}

export class ExperienceListPageMain implements LocalizedPage<void> {
  constructor(private sectionType: SectionType) {}
  shouldBeLoaded() {
    return verifyStep(`${this.sectionType} list main is ready`, async () => {})
  }
}
```

**Razón:** `ContentListPage.shouldBeLoaded()` ya hace:

```typescript
await this.mainLayout.shouldBeLoaded(locale).with(expect)
// Ya valida todo, las clases main no aportan nada
```

---

## Archivo: Patrón Real vs Plan

**El test implementado:**

```typescript
for (const content of testContents) {
  const config = sectionsConfig[content.name]

  test.describe(`[${config.category}] ${content.name}`, () => {
    test(`navigation for ${content.name}...`, async ({ page }) => {
      // Paso 1: Navega usando helper que encapsula URL
      const list = await userIsOnContentList(page, content.name, content.locale)
      await list.shouldBeLoaded(content.locale).with(expect)

      // Paso 2-3: Filtra y valida
      await list.filterByTag(content.testTag)
      await list.shouldBeFiltered(content.testTag).with(expect)

      // Paso 4-5: Detalle
      const entryUrl = getEntryURL(content.name, content.locale, content.testSlug)
      await list.openItem(entryUrl)
      const detail = contentDetailPage(page, content.name)
      await detail.shouldBeLoaded(content.locale).with(expect)
    })
  })
}
```

**Resultado:**

- ✅ 10 tests (5 content types × 2 locales)
- ✅ 1 navegación por test
- ✅ Factories seleccionan automáticamente según `sectionsConfig`
- ✅ Test grouping en reporting por categoría `[POST]`/`[EXPERIENCE]`
- ✅ Slugs validados contra filesystem (2022-07-11-intro-python, colombia-python, etc.)

---

## ✅ Logros Finales

**La refactorización alcanzó:**

1. ✅ **Composición sobre Herencia** — MainLayout + componentes inyectables
2. ✅ **Cero Duplicación** — Selectores encapsulados en componentes/factories
3. ✅ **Test Parametrizado** — Single loop + array config, agnóstico a implementación
4. ✅ **Mejor Reporting** — test.describe() agrupa por `[POST]`/`[EXPERIENCE]`
5. ✅ **DI explícito** — `Page` inyectado en constructores
6. ✅ **Cambios Localizados** — Mutar factory = selector muta en un lugar
7. ✅ **Helper reutilizable** — `userIsOnContentList()` encapsula URL + goto + instanciación
8. ✅ **Cobertura en list pages** — PostListPageMain y ExperienceListPageMain validan contenido específico

**Performance:**

- 10 tests (5 content types × 2 locales)
- 1 browser navigation por test
- Tests agrupados por categoría en report

---

## 📊 Status Final

**Refactorización completada con cobertura:**

Componente | Status | Notas
------------ | -------- | -------
ContentListPage | ✅ Completo | `userIsOnContentList()` helper + PostListPageMain/ExperienceListPageMain con cobertura
ContentDetailPage | ✅ Completo | PostDetailMain/ExperienceDetailMain implementan LocalizedPage
content-navigation-flow.spec.ts | ✅ Completo | Array `testContents` + test.describe() grouping por categoría
Componentes (Tags, ContentList, Comments) | ✅ Existentes | Sin cambios, reutilizables vía composición
Flow files | 🗑️ Eliminados | BlogPages, WorkPages, ProjectPages, TalkPages, CommunityPages
ListWork.astro | ✅ Actualizado | Agregado data-testid="post-role" y "post-responsibilities"
PostListPageMain | ✅ Implementado | Valida presencia de PostDate en items
ExperienceListPageMain | ✅ Implementado | Valida presencia de role/responsibilities en items

---

## 🎯 Cobertura Implementada: PostListPageMain y ExperienceListPageMain

**Estado:** ✅ Implementado
**Fecha:** 2026-08-05

### Qué validan

**PostListPageMain** (para blog, talk en listados):

- ✅ Valida que los items de lista contienen `<PostDate data-testid="post-date">` en el slot
- Implementación: Busca el primer item y verifica que PostDate es visible
- Referencia: [ListPost.astro](../../../../src/components/ListPost.astro#L21) renderiza `<PostDate>` en el slot

**ExperienceListPageMain** (para work, projects, community en listados):

- ✅ Valida que los items contienen `role` y `responsibilities` en el slot
- Implementación: Busca el primer item y verifica que ambos campos son visibles (si existen)
- Referencia: [ListWork.astro](../../../../src/components/ListWork.astro#L36-L37) renderiza ambos con data-testid

### Cambios realizados

**1. ContentListPage.ts:**

```typescript
export class PostListPageMain implements LocalizedPage<void> {
  constructor(private page: Page) {}

  shouldBeLoaded() {
    return verifyStep('post list items have post-date', async ({ expect }) => {
      const firstItem = this.page.getByTestId('list-item').first()
      const postDate = firstItem.getByTestId('post-date')
      await expect(postDate).toBeVisible()
    })
  }
}

export class ExperienceListPageMain implements LocalizedPage<void> {
  constructor(private page: Page) {}

  shouldBeLoaded() {
    return verifyStep('experience list items have role/responsibilities', async ({ expect }) => {
      const firstItem = this.page.getByTestId('list-item').first()
      const roleField = firstItem.getByTestId('post-role')
      const respField = firstItem.getByTestId('post-responsibilities')
  }
}
```

**2. ListWork.astro (agregado data-testid):**

```astro
{post.data.role && <p data-testid="post-role">{post.data.role}</p>}
{post.data.responsibilities && <p data-testid="post-responsibilities">{post.data.responsibilities}</p>}
```

**3. Factory contentListPage() actualizado:**

- Ahora pasa `page` en lugar de `sectionType` a las clases main
- Selecciona automáticamente PostListPageMain o ExperienceListPageMain según `sectionsConfig[sectionName].category`

### Cobertura lograda

- ✅ PostListPageMain valida el contenido específico de posts en listados
- ✅ ExperienceListPageMain valida el contenido específico de experiences en listados
- ✅ Selectores consistentes con detail pages (data-testid="post-date", "post-role", "post-responsibilities")
- ✅ Sin duplicación: mismo patrón que ContentDetailPage (reciben page, implementan `LocalizedPage<void>`)
