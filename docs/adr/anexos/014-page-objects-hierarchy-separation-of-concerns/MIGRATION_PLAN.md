# MIGRATION_PLAN.md — Refactorización de POM Content

**⚠️ DEPRECATED:** Este documento describe el plan original (ideal vs realidad).
**📖 VER:** [IMPLEMENTATION.md](IMPLEMENTATION.md) — Qué se implementó realmente

---

## Resumen Rápido

Aspecto | Antes | Después | Beneficio
--------- | ------- | --------- | -----------
**Browser instances** | 18 (3×2×3 tests) | 6 (1×2×3 tests) | -66%
**Selectores** | Duplicados | Encapsulados en componentes | DRY
**Tests** | Fragmentados | 1 test parametrizado | Agnóstico
**Herencia** | Inflexible | Composición | Explícito

**Patrón:** Composición + Descriptores Genéricos + Tests Parametrizados

---

## Qué Se Implementó

### 1. Componentes Reutilizables

Archivo | Responsabilidad
--------- | ---
Tags.ts | Filtrado por tags
ContentList.ts | Navegación en listados
ContentDetail.ts | Detalles de experience (work, project, community)
Comments.ts | Comentarios (reutilizado)

**Patrón:** Reciben `Target` + selectores inyectados. NO reciben `page`.

### 2. Orquestadores

Archivo | Compone
--------- | ---------
ContentListPage.ts | MainLayout + Tags + ContentList
ContentDetailPage.ts | MainLayout + CommentsComponent
ContentExperienceDetailPage.ts | MainLayout + ContentDetail

**Beneficio:** Composición explícita. Sin herencia.

### 3. Descriptor Genérico

```typescript
interface ContentTypeFlow<ListPage> {
  name: SectionType
  testTag: string              // tag de prueba
  testSlug: string             // slug de item a navegar
  userInList: (page, locale) => Promise<ListPage>
  createDetail: (page) => DetailPage
}
```

Cada módulo (BlogPages, ProjectPages, etc.) exporta su descriptor.

### 4. Test E2E Unificado

**Patrón:** Parametrizado sobre descriptores (agnóstico)

```typescript
const flows = [blogFlow, projectFlow, workFlow, communityFlow, talkFlow]

for (const flow of flows) {
  for (const locale of languageKeys) {
    test(`${flow.name}: complete navigation flow (${locale})`, async ({ page }) => {
      const list = await flow.userInList(page, locale)
      await list.shouldBeLoaded(locale).with(expect)
      await list.filterByTag(flow.testTag)
      await list.shouldBeFiltered(flow.testTag).with(expect)
      const entryUrl = getEntryURL(flow.name, locale, flow.testSlug)
      await list.openItem(entryUrl)
      const detail = flow.createDetail(page)
      await detail.shouldBeLoaded(locale).with(expect)
    })
  }
}
```

**Resultado:** 10 tests, 1 navegación por test, 0 duplicación.

---

## Errores del Plan Original

### Lo que el plan especificaba pero se simplificó

❌ **Sobre-genéricos NO implementados:**

- `PostListPageMain` y `ExperienceListPageMain` — vacías, no se usan
- `createContentListPageFactory()` — cada módulo hace su factory
- `TargetSelector<void>` en ContentDetail — usar `Target` es suficiente

✅ **Lo que funcionó bien:**

- Componentes reutilizables
- Composición explícita
- Descriptor genérico
- Test parametrizado

---

## Próximos Pasos

**P1 (30 min):** Limpiar classes vacías
**P2 (15 min):** Actualizar ADR 014

Ver detalles → [IMPLEMENTATION.md](IMPLEMENTATION.md)
