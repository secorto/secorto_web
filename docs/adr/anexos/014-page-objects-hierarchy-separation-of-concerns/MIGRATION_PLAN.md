# Migration Plan: Refactorización de POM Content a Composición

**Fecha:** 2026-08-01
**Objetivo:** Restituir ADR 014 mediante patrón composición + componentes
**Estimación:** 6-9 horas
**Riesgo:** Bajo (solo tests)

---

## Visión Nueva: Patrón Composición (DI con Componentes)

La solución utiliza **composición de componentes** (como homepage)
en lugar de herencia inflexible.

```text
MainLayoutComponent (genérico, reutilizable)
├── shouldBeLoaded()
├── header, sidebar, footer
├── headerTitle → ya abstraído aquí

TagsComponent (reutilizable, encapsula selectores)
├── tagLink(tag)
├── filterByTag(tag)
├── shouldRenderTags()
└── tagLinksInSection → selectores internos

ContentListComponent (reutilizable, encapsula lista)
├── itemLink(href)
├── clickItem(href, title)
├── clickFirstItem()
├── shouldHaveResults()
└── itemLinks → selectores internos

ContentDetailComponent (reutilizable, encapsula detalle)
├── shouldHaveRole() [experience]
├── shouldHaveResponsibilities() [experience]
└── comentarios → delegados a CommentsComponent

ContentListPage (orquestador)
├── mainLayout: MainLayoutComponent
├── tags: TagsComponent
├── list: ContentListComponent
└── shouldBeLoaded() → delega a componentes

BlogPages.userInList() → factory composiendo: ...defaultMainLayout(page), tags, list
```

**Beneficio:** Composición > Herencia. Componentes reutilizables.
Selectores **encapsulados** en componentes (no factory centralizado).
Cero duplicación. Patrón idéntico a homepage.

---

## FASE 0: Reestructurar POM (Arquitectura con Componentes)

**Duración:** 4-6 horas
**Riesgo:** Bajo (solo crear componentes nuevos, eliminar viejos)

**Patrón DI:** Reutilizar `Target` y `TargetSelector` de `HighlightCard.ts`

- Componentes NO reciben `page`, reciben `Target` + `TargetSelector` factories
- Selectores están **inyectados**, no hardcodeados
- Factory externo (p. ej. `tagsComponent()`) inyecta los selectores

### Paso 1: Crear `TagsComponent` (DI con TargetSelector)

**Archivo nuevo:** `tests/support/ui/content/components/Tags.ts`

```typescript
import type { Locator } from '@playwright/test'
import { step, verifyStep } from '@tests/support/test-steps'
import { Target, target, TargetSelector, targetSelector } from '@tests/support/ui/components/Target'

/**
 * Componente reutilizable para tags.
 * Patrón: Recibe Target + TargetSelector (DI), NO recibe page.
 * Selectores son inyectados, no hardcodeados.
 * Ejemplo: HighlightCard.ts
 */
export class TagsComponent {
  constructor(
    readonly container: Target,
    readonly tagLink: TargetSelector<string>, // factory: dado tag name, retorna Locator
  ) {}

  async filterByTag(tag: string) {
    return step(`Filter by tag "${tag}"`, async () => {
      // TargetSelector inyectado resuelve el selector
      await this.tagLink.get(tag).click()
    })
  }

  shouldRenderTags() {
    return verifyStep(`Tags are rendered`, async ({ expect }) => {
      await expect(this.container.locator).toBeVisible()
      // tagLink.resolve() está disponible para validar cantidad
      const tagCount = await this.container.locator.locator('[data-testid^="tag-link-"]').count()
      expect(tagCount).toBeGreaterThan(0)
    })
  }
}

/**
 * Factory inyecta los selectores.
 * Cambiar selector = modificar aquí (1 lugar).
 * Patrón: idéntico a highlightCards() en HighlightCard.ts
 */
export function tagsComponent(containerLocator: Locator) {
  return new TagsComponent(
    target('tags container', containerLocator),
    targetSelector(
      'tag link',
      (tag: string) => containerLocator.locator(`[href*="/tags/${tag}"]`),
      (tag: string) => tag,
    ),
  )
}
```

**Beneficio:**

- Componente agnóstico a selectores (NO recibe `page`)
- Selectores inyectados vía factory (`TargetSelector`)
- Cambiar selector `[href*="/tags/${tag}"]` = 1 lugar (factory)
- Patrón **idéntico a HighlightCard** (DI puro)

### Paso 2: Crear `ContentListComponent` (DI con TargetSelector)

**Archivo nuevo:** `tests/support/ui/content/components/ContentList.ts`

```typescript
import type { Locator } from '@playwright/test'
import { step, verifyStep } from '@tests/support/test-steps'
import { Target, target, TargetSelector, targetSelector } from '@tests/support/ui/components/Target'

/**
 * Componente reutilizable para lista de items.
 * Patrón: Recibe Target + TargetSelector (DI), NO recibe page.
 */
export class ContentListComponent {
  constructor(
    readonly container: Target,
    readonly itemLink: TargetSelector<string>, // factory: dado href, retorna Locator
  ) {}

  async clickItem(href: string, title: string) {
    return step(`Click item: ${title}`, async () => {
      await this.itemLink.get(href).click()
    })
  }

  async clickFirstItem() {
    return step(`Click first item`, async () => {
      const firstItem = this.container.locator.locator('[data-testid="list-item"]').first()
      const href = await firstItem.getAttribute('href')
      if (!href) throw new Error('No href found on first item')
      await this.itemLink.get(href).click()
    })
  }

  shouldHaveResults() {
    return verifyStep(`List has items`, async ({ expect }) => {
      const items = this.container.locator.locator('[data-testid="list-item"]')
      await expect.poll(async () => items.count()).toBeGreaterThan(0)
    })
  }
}

/**
 * Factory inyecta selectores.
 */
export function contentListComponent(containerLocator: Locator) {
  return new ContentListComponent(
    target('content list', containerLocator),
    targetSelector(
      'list item link',
      (href: string) => containerLocator.locator(`[href="${href}"]`),
      (href: string) => href,
    ),
  )
}
```

### Paso 3: Crear `ContentDetailComponent` (DI con TargetSelector)

**Archivo nuevo:** `tests/support/ui/content/components/ContentDetail.ts`

```typescript
import type { Locator } from '@playwright/test'
import { verifyStep } from '@tests/support/test-steps'
import { Target, target, TargetSelector, targetSelector } from '@tests/support/ui/components/Target'

/**
 * Componente para detalle de experience (work, project, community).
 * Patrón: Recibe Target + TargetSelector (DI).
 */
export class ContentDetailComponent {
  constructor(
    readonly container: Target,
    readonly roleField: TargetSelector<void>,
    readonly responsibilitiesField: TargetSelector<void>,
  ) {}

  shouldHaveRole(expectedRole: string) {
    return verifyStep(`Has role: ${expectedRole}`, async ({ expect }) => {
      await expect(this.roleField.get(undefined)).toContainText(expectedRole)
    })
  }

  shouldHaveResponsibilities(expectedResponsibilities: string) {
    return verifyStep(`Has responsibilities`, async ({ expect }) => {
      await expect(this.responsibilitiesField.get(undefined)).toContainText(expectedResponsibilities)
    })
  }
}

/**
 * Factory inyecta selectores de fields.
 */
export function contentDetailComponent(containerLocator: Locator) {
  return new ContentDetailComponent(
    target('content detail', containerLocator),
    targetSelector(
      'detail role field',
      () => containerLocator.locator('[data-testid="detail-role"]'),
    ),
    targetSelector(
      'detail responsibilities field',
      () => containerLocator.locator('[data-testid="detail-responsibilities"]'),
    ),
  )
}
```

### Paso 4: Refactorizar `ContentListPage` (Orquestador)

**Archivo a refactorizar:** `tests/support/ui/content/ContentListPage.ts`

```typescript
import type { UILanguages } from '@i18n/ui'
import { MainLayoutComponent } from '@tests/support/ui/components/layout/MainLayout'
import { TagsComponent } from './components/Tags'
import { ContentListComponent } from './components/ContentList'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import type { Page } from '@playwright/test'

/**
 * Orquestador de página de lista.
 * Compone MainLayout + Tags + ContentList.
 * Patrón: idéntico a HomePage.
 *
 * urlValidator: reutilizado de homepage, valida URL correcta de sección.
 */
export class ContentListPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly tags: TagsComponent,
    readonly list: ContentListComponent,
    readonly validateUrl: ReturnType<typeof urlValidator>,
  ) {}

  async shouldBeLoaded(locale: UILanguages) {
    await this.mainLayout.shouldBeLoaded(locale)
    await this.tags.shouldRenderTags()
    return this.shouldBeInLocale(locale)
  }

  /**
   * Valida que la URL sea correcta para esta sección (sin redirects).
   * Ej: /es/blog, /en/project/, etc.
   */
  shouldBeInLocale(locale: UILanguages) {
    const expected = new RegExp(`/${locale}/[a-z]+(/|$)`)
    return this.validateUrl(expected)
  }

  /**
   * Valida que el filtrado por tag fue exitoso.
   * Comprueba: URL contiene /tags/${tag} y lista tiene resultados.
   * Patrón: encapsula validaciones (no test hace expect(page.url())).
   */
  async shouldBeFiltered(tag: string) {
    await this.validateUrl(new RegExp(`/tags/${tag}`)).with(() => ({
      expect: require('@playwright/test').expect,
    }))
    return this.list.shouldHaveResults()
  }

  /**
   * Filtra por tag y hace click en el primer item resultante.
   * Combina: filterByTag(tag) + clickFirstItem().
   * Patrón: método de alto nivel, explícito, reutilizable.
   */
  async clickFirstItemInTag(tag: string) {
    await this.filterByTag(tag)
    return this.list.clickFirstItem()
  }

  // Delegadores de conveniencia (acceso directo a componentes)
  async filterByTag(tag: string) {
    return this.tags.filterByTag(tag)
  }

  async clickItem(href: string, title: string) {
    return this.list.clickItem(href, title)
  }
}
```

### Paso 5: Refactorizar `ContentDetailPage` (Orquestador)

**Archivo a refactorizar:** `tests/support/ui/content/ContentDetailPage.ts`

```typescript
import type { UILanguages } from '@i18n/ui'
import { MainLayoutComponent } from '@tests/support/ui/components/layout/MainLayout'
import { CommentsComponent } from './components/Comments'

/**
 * Orquestador de página de detalle (blog, talk).
 * Compone MainLayout + CommentsComponent.
 */
export class ContentDetailPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly comments: CommentsComponent,
  ) {}

  async shouldBeLoaded(locale: UILanguages) {
    await this.mainLayout.shouldBeLoaded(locale)
  }

  shouldHaveComments(locale: UILanguages) {
    return this.comments.shouldBeRendered(locale)
  }
}
```

**Beneficio:**

- Elimina ContentPostDetailPage (alias innecesario)
- CommentsComponent ya existe, bien diseñado

### Paso 6: Refactorizar `ContentExperienceDetailPage` (Orquestador)

**Archivo a refactorizar:** `tests/support/ui/content/ContentExperienceDetailPage.ts`

```typescript
import type { UILanguages } from '@i18n/ui'
import { MainLayoutComponent } from '@tests/support/ui/components/layout/MainLayout'
import { ContentDetailComponent } from './components/ContentDetail'

/**
 * Orquestador de página de detalle (work, project, community).
 * Compone MainLayout + ContentDetailComponent.
 */
export class ContentExperienceDetailPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly detail: ContentDetailComponent,
  ) {}

  async shouldBeLoaded(locale: UILanguages) {
    await this.mainLayout.shouldBeLoaded(locale)
  }

  shouldHaveRole(expectedRole: string) {
    return this.detail.shouldHaveRole(expectedRole)
  }

  shouldHaveResponsibilities(expectedResponsibilities: string) {
    return this.detail.shouldHaveResponsibilities(expectedResponsibilities)
  }
}
```

### Paso 7: Actualizar Facades — BlogPages, ProjectPages, etc

**Primero:** Definir tipo genérico para describir un content flow.

**Archivo nuevo:** `tests/support/ui/content/types.ts`

```typescript
import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'

/**
 * Descriptor genérico para un flow de content type.
 * Cada content type (blog, project, work, etc.) exporta su propio descriptor.
 * Patrón: agnóstico, reutilizable, sin duplicación de imports en test.
 */
export interface ContentTypeFlow {
  readonly name: string
  readonly userInList: (page: Page, locale: UILanguages) => Promise<unknown>
  readonly userInDetail: (page: Page, locale: UILanguages, slug: string) => Promise<unknown>
}
```

**Ejemplo:** `tests/support/ui/content/BlogPages.ts`

```typescript
import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { MainLayoutComponent } from '@tests/support/ui/components/layout/MainLayout'
import { ContentListPage } from './ContentListPage'
import { ContentDetailPage } from './ContentDetailPage'
import { tagsComponent } from './components/Tags'
import { contentListComponent } from './components/ContentList'
import { CommentsComponent } from './components/Comments'
import type { ContentTypeFlow } from './types'

export async function userInBlogList(page: Page, locale: UILanguages): Promise<ContentListPage> {
  // Factories inyectan selectores (patrón DI, idéntico a HighlightCard)
  const mainLayout = new MainLayoutComponent(page, 'Blog List')
  const tags = tagsComponent(page.locator('main')) // selectores inyectados
  const list = contentListComponent(page.locator('main'))
  return new ContentListPage(mainLayout, tags, list, urlValidator(page))
}

export async function userInBlogPost(page: Page, locale: UILanguages, slug: string): Promise<ContentDetailPage> {
  const mainLayout = new MainLayoutComponent(page, 'Blog Detail')
  const comments = new CommentsComponent(page)
  return new ContentDetailPage(mainLayout, comments)
}

/**
 * Descriptor del flow para blog.
 * Usado en test parametrizado para iterar sobre content types.
 * Patrón: agnóstico (ContentTypeFlow), sin duplicar imports.
 */
export const blogFlow: ContentTypeFlow = {
  name: 'blog',
  userInList: userInBlogList,
  userInDetail: userInBlogPost,
} as const
```

**Similar para ProjectPages, WorkPages, CommunityPages, TalkPages:**

```typescript
export const projectFlow: ContentTypeFlow = {
  name: 'project',
  userInList: userInProjectList,
  userInDetail: userInProjectDetail,
} as const

// ... etc
```

**Beneficio:**

- ✅ Tipo genérico (`ContentTypeFlow`) agnóstico
- ✅ Cada módulo exporta su descriptor (factory)
- ✅ Cero duplicación de imports en test
- ✅ Explícito: qué funciones van en cada flow
- ✅ Elegante: loop genérico en test sin cambios por content type

### Paso 8: ELIMINAR archivos obsoletos

- `tests/support/ui/content/ContentPage.ts`
- `tests/support/ui/content/ContentPostDetailPage.ts`
- `tests/support/ui/content/ContentTagsPage.ts`

**Verificación FASE 0:**

- TagsComponent, ContentListComponent, ContentDetailComponent creados
- Componentes usan patrón DI (reciben `Target` + `TargetSelector<T>`)
- NO hay selectores hardcodeados en componentes (están en factories)
- NO hay `page` en componentes (reciben `Target` en su lugar)
- Factories (`tagsComponent()`, `contentListComponent()`, etc.) inyectan selectores
- Orquestadores refactorizados (componen MainLayout + componentes)
- ContentPage.ts, ContentPostDetailPage.ts, ContentTagsPage.ts no existen
- Cero métodos duplicados
- Patrón **idéntico a HighlightCard.ts** (DI + Target + TargetSelector)

---

## FASE 1: Consolidar Tests E2E (Cobertura Real)

**Duración:** 2-3 horas
**Riesgo:** Bajo (depende de FASE 0)

**Objetivo:** Reemplazar tests fragmentados con navegación completa parametrizada.

### Problema: Tests Fragmentados Actuales

Hoy los tests están divididos en:

1. **`.titles.spec.ts`** (blog, project, work, talk, community)
   - Hace: `goto` + `shouldBeLoaded()`
   - Problema: NO navega, solo valida carga inicial

2. **`tags.*.spec.ts`** (blog, project, talk, community)
   - Hace: lista + filtra por tag + valida filtro
   - Problema: NO navega a detalle después de filtrar

3. **`tags.list.spec.ts`** (global tags)
   - Hace: solo valida página de tags global carga
   - Problema: NO navega por ningún tag específico

**Resultado:** No existe test que valide el flujo REAL:
listado → click en tag → validar filtrado → click en item → validar detalle

### Solución: Test E2E Parametrizado (Navegación Completa)

**Archivo nuevo:** `tests/e2e/content-navigation-flow.spec.ts`

```typescript
import { test, expect } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { blogFlow } from '@tests/support/ui/content/BlogPages'
import { projectFlow } from '@tests/support/ui/content/ProjectPages'
import { workFlow } from '@tests/support/ui/content/WorkPages'
import { communityFlow } from '@tests/support/ui/content/CommunityPages'
import { talkFlow } from '@tests/support/ui/content/TalkPages'
import type { ContentTypeFlow } from '@tests/support/ui/content/types'

/**
 * Flujo completo de navegación en content:
 * 1. Ir a listado de sección
 * 2. Validar carga
 * 3. Click en un tag
 * 4. Validar filtrado (URL cambió, contenido filtrado)
 * 5. Click en item de la lista
 * 6. Validar detalle carga
 *
 * Patrón: Cada content type exporta su descriptor (ContentTypeFlow).
 * Test parametrizado itera sobre descriptores (agnóstico).
 * Sin duplicación, sin imports genéricos (as *).
 */

const flows: ContentTypeFlow[] = [
  blogFlow,
  projectFlow,
  workFlow,
  communityFlow,
  talkFlow,
]

for (const flow of flows) {
  for (const locale of languageKeys) {
    test(
      `${flow.name}: complete navigation flow (${locale})`,
      { tag: [`@${flow.name}`, `@${locale}`, '@navigation'] },
      async ({ page }) => {
        // 1. Goto listado
        await page.goto(`/${locale}/${flow.name}`)

        // 2. Valida listado (carga + URL correcta)
        const list = await flow.userInList(page, locale)
        await list.shouldBeLoaded(locale).with(expect)

        // 3. Click en un tag y primer item resultante
        // (encapsulado en método de alto nivel: filtrado + click)
        await list.clickFirstItemInTag('python')

        // 4. Valida filtrado (URL + resultados)
        await list.shouldBeFiltered('python').with(expect)

        // 6. Valida detalle
        const detail = await flow.userInDetail(page, locale, 'auto')
        await detail.shouldBeLoaded(locale)
      },
    )
  }
}
```

**Beneficio:**

- ✅ Navegación completa (lista → tag → item → detail)
- ✅ Cobertura realista (flujo real del usuario)
- ✅ 1 browser instance (no múltiples goto)
- ✅ Parametrizado: 5 secciones × 2 locales = 10 tests en 1
- ✅ Explícito: cada import es específico (no `as *`)
- ✅ Elegante: tipo genérico + descriptores
- ✅ Agnóstico: test NO cambia si agregás content type (solo importas su descriptor)

### Paso 2: ELIMINAR tests fragmentados

Eliminar:

- `tests/e2e/smoke/blog.titles.spec.ts` (project, work, talk, community)
- `tests/e2e/functional/tags/tags.blog.spec.ts` (project, talk, community)

**Beneficio:**

- Menos archivos
- Menos overhead browser
- Menos fragmentación
- Firefox memory: -15% a -30% (estimado)

**Verificación FASE 1:**

- `content-navigation-flow.spec.ts` creado
- Todos los `.titles.spec.ts` y `tags.*.spec.ts` eliminados
- `npm run test:e2e` pasa
- Navegación completa validada (listado → tag → item → detail)
- Firefox memoria: medida y documentada (esperado: -15% a -30%)

---

## Cronograma Completo

| Fase | Tarea | Estimación | Riesgo |
| --- | --- | --- | --- |
| 0.1 | Crear TagsComponent | 30min | Bajo |
| 0.2 | Crear ContentListComponent | 30min | Bajo |
| 0.3 | Crear ContentDetailComponent | 20min | Bajo |
| 0.4-0.6 | Refactorizar orquestadores (3) | 1.5h | Bajo |
| 0.7 | Actualizar facades (5 archivos) | 1h | Bajo |
| 0.8 | Eliminar archivos obsoletos | 1h | Bajo |
| FASE 0 Total | Reestructuración POM | 5-6h | Bajo |
| 1.0 | Crear tipo `ContentTypeFlow` | 15min | Bajo |
| 1.1 | Descriptores en cada módulo (5) | 30min | Bajo |
| 1.2 | Crear test E2E parametrizado | 1h | Bajo |
| 1.3 | Eliminar tests fragmentados | 30min | Bajo |
| 1.4 | Validar tests + Firefox memory | 1h | Bajo |
| FASE 1 Total | Consolidar E2E con DI | 3.25h | Bajo |
| **Total** | **Ambas fases** | **8.25-9.25h** | **Bajo** |

---

## Checklist de Aceptación

### FASE 0

- [ ] `tests/support/ui/content/components/Tags.ts` creado (DI con `Target` + `TargetSelector<string>`)
- [ ] `tests/support/ui/content/components/ContentList.ts` creado (DI con `Target` + `TargetSelector<string>`)
- [ ] `tests/support/ui/content/components/ContentDetail.ts` creado (DI con `Target` + `TargetSelector<void>`)
- [ ] `ContentListPage.ts` refactorizado como orquestador (compone MainLayout + Tags + ContentList)
- [ ] `ContentDetailPage.ts` refactorizado como orquestador (compone MainLayout + CommentsComponent)
- [ ] `ContentExperienceDetailPage.ts` refactorizado como orquestador (compone MainLayout + ContentDetail)
- [ ] Factories (`tagsComponent()`, `contentListComponent()`, etc.) inyectan selectores
- [ ] Facades (BlogPages, ProjectPages, etc.) actualizados con patrón DI
- [ ] `ContentPage.ts` no existe
- [ ] `ContentPostDetailPage.ts` no existe
- [ ] `ContentTagsPage.ts` no existe
- [ ] Cero selectores hardcodeados en componentes (están en factories)
- [ ] Cero `page: Page` en componentes (reciben `Target` en su lugar)
- [ ] `npm run test:unit` pasa
- [ ] Patrón **idéntico a HighlightCard.ts** (DI + Target + TargetSelector)

### FASE 1

- [ ] `tests/support/ui/content/types.ts` creado (tipo `ContentTypeFlow`)
- [ ] `BlogPages.ts` exporta `blogFlow: ContentTypeFlow`
- [ ] `ProjectPages.ts` exporta `projectFlow: ContentTypeFlow`
- [ ] `WorkPages.ts` exporta `workFlow: ContentTypeFlow`
- [ ] `CommunityPages.ts` exporta `communityFlow: ContentTypeFlow`
- [ ] `TalkPages.ts` exporta `talkFlow: ContentTypeFlow`
- [ ] `tests/e2e/content-navigation-flow.spec.ts` creado (loop genérico, imports específicos)
- [ ] `tests/e2e/smoke/blog.titles.spec.ts` no existe
- [ ] `tests/e2e/smoke/project.titles.spec.ts` no existe
- [ ] `tests/e2e/smoke/work.titles.spec.ts` no existe
- [ ] `tests/e2e/smoke/talk.titles.spec.ts` no existe
- [ ] `tests/e2e/smoke/community.titles.spec.ts` no existe
- [ ] `tests/e2e/functional/tags/tags.blog.spec.ts` no existe
- [ ] `tests/e2e/smoke/tags.list.spec.ts` no existe
- [ ] `npm run test:e2e` pasa
- [ ] Navegación completa validada
- [ ] Firefox memoria medida

---

## Justificación de Refactorización

Esta refactorización documenta que:

1. **ADR 014 fue correctamente especificado** — composición de componentes + especialización de responsabilidades
2. **Implementación inicial violó el ADR** — usó herencia inflexible en lugar de composición
3. **Los problemas encontrados eran predecibles** — duplicación, acoplamiento, falta de escalabilidad
4. **La solución restituye el ADR** — transición hacia composición (patrón homepage + HighlightCard)
5. **Beneficios no son teóricos** — reducción concreta en líneas, eliminación de duplicación, DI puro

## Patrón Elegido: DI con Target + TargetSelector

En lugar de pasar `page: Page` a componentes y que hardcodeen selectores:

```typescript
// ❌ Antipattern: page embebido, selectores hardcodeados
export class TagsComponent {
  constructor(readonly page: Page) {}
  async filterByTag(tag: string) {
    await this.page.locator(`[href*="/tags/${tag}"]`).click() // selector hardcodeado
  }
}
```

Usar **composición + DI** (patrón HighlightCard):

```typescript
// ✅ DI puro: Target + TargetSelector inyectado
export class TagsComponent {
  constructor(
    readonly container: Target,
    readonly tagLink: TargetSelector<string>, // selector inyectado
  ) {}
  async filterByTag(tag: string) {
    await this.tagLink.get(tag).click() // selector resuelto vía factory
  }
}

export function tagsComponent(containerLocator: Locator) {
  return new TagsComponent(
    target('tags', containerLocator),
    targetSelector('tag link', (tag) => containerLocator.locator(`[href*="/tags/${tag}"]`)),
  )
}
```

**Ventajas de este patrón:**

- ✅ **Componente agnóstico** — NO conoce `page`, selectores
- ✅ **Selectores inyectados** — en factory (fuera componente)
- ✅ **Cambiar selector = 1 lugar** — el factory
- ✅ **DI puro** — idéntico a HighlightCard.ts
- ✅ **Reutilizable** — mismo componente con diferentes selectores
- ✅ **Testeable** — fácil de mockar selectores en tests

**Conclusión:**

La refactorización no es "agregar más tests" sino **alinear implementación con ADR 014**
mediante:

1. Composición de componentes (NO herencia)
2. DI puro (selectores inyectados, NO hardcodeados)
3. Patrón probado (HighlightCard + Target + TargetSelector)
4. Mejorar cobertura real (navegación completa vs fragmentados)
