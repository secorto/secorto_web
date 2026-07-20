# Consolidación de Aserciones E2E con Soft Expect

Guía técnica de implementación del patrón de consolidación de aserciones E2E.
Para la decisión arquitectónica, ver [ADR 015](../adr/015-consolidated-e2e-assertions-soft-expect.md).

## Problema

Múltiples verificaciones independientes sobre el mismo estado de página pueden fragmentarse
en tests separados, causando:

- Combinatoria explosiva (N tests × M locales × B browsers)
- Presión en instanciación de browsers en CI (flakiness, timeouts)
- Ruido en reportes (suite crece pero sin valor semántico incrementado)

**Ejemplo real:**

```typescript
// ❌ ANTES: 3 tests × 2 locales = 6 navegaciones
test('renders bio, avatar and highlights', ...)
test('PyBAQ callout uses i18n strings', ...)
test('highlights hrefs match routes', ...)
```

## Solución: Soft Assert Semánticamente Guiado

Consolida verificaciones independientes en un único acto semántico usando soft expect.

### Uso básico

```typescript
// Test: expresa intención (cero detalles técnicos)
test('page loaded correctly', async ({ page }) => {
  const tagsPage = await userIsOnTags(page, locale)
  await tagsPage.shouldBeLoaded(locale).soft()  // ← consolidates multiple verifications
})

// POM: encapsula toda la lógica
shouldBeLoaded(locale) {
  return verifyStep('tags page is loaded correctly', async ({ expect }) => {
    await this.shouldHavePageTitle(expectedTitle).with(expect)
    await this.shouldHavePageDescription(expectedDescription).with(expect)
    await this.shouldShowTagGroups().with(expect)
    await this.shouldHaveAtLeastOneTagGroup().with(expect)
    await this.firstTagGroupHeadingShouldBeVisible().with(expect)
    await this.shouldHaveAtLeastOneLinkInFirstTagGroup().with(expect)
    await this.linksHrefMatches(hrefPattern).with(expect)
    await this.shouldContainAvailabilityText(availabilityText).with(expect)
  })
}
```

### Reporte Playwright

Cuando llamas `.soft()`, el reporte muestra cada assertion como step etiquetado, sin early exit:

```console
✓ tags page is loaded correctly (soft)
  ✓ tags header title should have text
  ✓ tags description should have text
  ✓ tags groups container should be visible
  ✓ global tag groups should have count > 0
  ✓ first tag group heading should be visible
  ✓ first tag group should contain links
  ✗ global tag links should have href matching /^\/es\/[a-z]+\/tags\/.+/
  ✓ tags page body should contain text
```

Nota: Todas las verificaciones se ejecutan, no hay early exit. Ves **todas** las faltas simultáneamente.

## Criterio de Consolidación

**✅ Consolidable:** Múltiples `expect()` sin interacción intermedia

- Usuario navega a página
- 5-6+ verificaciones puras sobre el mismo estado
- Sin cambio de estado entre asserts
- Todas son independientes (fallo en una no invalida otras)

**❌ No consolidable:** Hay interacción que cambia estado

```typescript
// ❌ INCORRECTO: filterByTag() cambia estado entre verificaciones
filterByTag('python')
await verify('filtered results')
await verify('title updated')

// El estado cambió → estas son 2 actos semánticos diferentes
```

Solución: separar en tests con `.soft()` dentro de cada uno

```typescript
// ✅ CORRECTO
test('filter updates state', async (...) => {
  await tagsPage.filterByTag('python').soft()
})
test('filtered results visible', async (...) => {
  await tagsPage.filterByTag('python')  // repetir la acción
  await tagsPage.shouldShowFilteredResults().soft()
})
```

## Implementación en Fixtures

### `verifyStep` y `SoftableAssertion`

```typescript
// tests/fixtures/index.ts
interface SoftableAssertion<T> extends Promise<T> {
  with(expectFn: ExpectType): Promise<T>  // ejecuta con expect específico
  soft(): Promise<T>                       // ejecuta con expect.soft
}

export const verifyStep = <T>(
  title: string,
  action: (args: StepExpect) => T | Promise<T>
): SoftableAssertion<T> => {
  return {
    // await tagsPage.shouldBeLoaded(locale) → todos los expects son hard
    then: (...) => test.step(title, () => action({ expect })),
    // await tagsPage.shouldBeLoaded(locale).soft() → todos los expects son soft
    soft: () => test.step(`${title} (soft)`, () => action({ expect: expect.soft }))
  }
}
```

### Métodos POM con `.with(expect)`

Los métodos POM aceptan `.with(expect)` para que respeten el contexto (hard o soft):

```typescript
// tests/support/ui/components/Target.ts
shouldHaveText(textOrRegex: string | RegExp) {
  return verifyStep(`${this.name} should have text`, async ({ expect }) => {
    await expect(this.locator).toHaveText(textOrRegex)
  })
}

// En POM: lo usas dentro de shouldBeLoaded()
shouldBeLoaded(locale) {
  return verifyStep('page loaded', async ({ expect }) => {
    // Aquí `expect` es hard o soft según llamada
    await this.pageTitle.shouldHaveText(title).with(expect)  // respeta el contexto
  })
}
```

## Beneficios Medidos

### Reducción de browsers

- **Antes:** 3 tests × 2 locales × 3 browsers = 18 instanciaciones
- **Después:** 1 test × 2 locales × 3 browsers = 6 instanciaciones
- **Reducción:** 66% (impacto directo en CI flakiness)

### Diagnosticidad

- Soft asserts muestran todas las faltas sin re-run
- Cada assertion es step etiquetado en reporte
- No es "bloque opaco" de verificaciones

### Mantenibilidad

- Cambios en selectors/lógica se hacen en POM, no en tests
- Tests expresan intención, no detalles técnicos
- Agregar nuevas verificaciones es 1 línea en POM

## Ejemplo: Migración de 3 tests a 1

**Antes:**

```typescript
test('renders avatar', async () => {
  const home = await userInHome(page, locale)
  await home.shouldHaveAvatar()
})

test('renders bio', async () => {
  const home = await userInHome(page, locale)
  await home.shouldHaveBioText()
})

test('highlights valid', async () => {
  const home = await userInHome(page, locale)
  const blogRoute = sectionsConfig.blog.routes[locale]
  const talkRoute = sectionsConfig.talk.routes[locale]
  await home.blogHrefMatches(locale, blogRoute)
  await home.talkHrefMatches(locale, talkRoute)
})
```

**Después:**

```typescript
test('loads correctly', async () => {
  const home = await userInHome(page, locale)
  await home.shouldBeLoaded(locale).soft()
})

// POM: homepage incorpora la lógica
class HomePage {
  shouldBeLoaded(locale) {
    const i18n = ui[locale]
    const blogRoute = sectionsConfig.blog.routes[locale]
    const talkRoute = sectionsConfig.talk.routes[locale]

    return verifyStep('homepage is loaded correctly', async ({ expect }) => {
      await this.shouldHaveTitle().with(expect)
      await this.shouldHaveAvatar().with(expect)
      await this.shouldHaveBioText().with(expect)
      await this.shouldHavePyBAQ(i18n).with(expect)
      await this.blogHrefMatches(locale, blogRoute).with(expect)
      await this.talkHrefMatches(locale, talkRoute).with(expect)
    })
  }
}
```

**Resultado:**

- 3 tests → 1 test
- 3 navegaciones × 2 locales = 6 → 1 navegación × 2 locales = 2 instanciaciones
- Test es **más legible** (1 línea vs. 3 test functions)
- Suite **más eficiente** en CI

## Antipatrones

❌ **Consolidar con interacción intermedia**

```typescript
// INCORRECTO
shouldBeLoaded() {
  filterByTag('python')  // ← cambio de estado
  await expect(results)
  await expect(title)
}
```

❌ **Ignorar límites semánticos**

```typescript
// INCORRECTO: "login", "render", "verify" son actos separados
shouldBeLoaded() {
  await login()
  await renderPage()
  await verifyTitle()
  await verifyContent()
}
```

❌ **Dejar lógica sucia en POM**

```typescript
// INCORRECTO: 50 líneas de lógica sin estructura
shouldBeLoaded() {
  const var1 = await foo()
  const var2 = await bar(var1)
  // ... 45 líneas más
}
```

Solución: extraer helpers privados

```typescript
// CORRECTO
shouldBeLoaded() {
  return verifyStep('...', async ({ expect }) => {
    await this.verifyAvatar().with(expect)
    await this.verifyContent().with(expect)
    await this.verifyLinks().with(expect)
  })
}

private async verifyAvatar() { ... }
private async verifyContent() { ... }
```

## Referencias

- [ADR 015](../adr/015-consolidated-e2e-assertions-soft-expect.md) — Decisión arquitectónica
- [Playwright Soft Expect](https://playwright.dev/docs/api/class-teststep#test-step-expect-soft)
- [PAGE_OBJECTS.md](PAGE_OBJECTS.md) — Arquitectura completa de POM
