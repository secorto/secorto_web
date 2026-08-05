import { test, expect } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { getEntryURL, type SectionType, sectionsConfig } from '@domain/section'
import { userIsOnContentList } from '@tests/support/ui/content/ContentListPage'
import { contentDetailPage } from '@tests/support/ui/content/ContentDetailPage'

/**
 * Flujo completo de navegación en content:
 * 1. Ir a listado de sección
 * 2. Validar carga
 * 3. Click en un tag
 * 4. Validar filtrado (URL cambió, contenido filtrado)
 * 5. Click en item de la lista (sin navegar por URL)
 *
 * Patrón: testContents con locale incluido para evitar variaciones de slugs por idioma.
 * Factories seleccionan automáticamente type basado en sectionsConfig.
 * Reporting: test.describe() agrupa por categoría (POST/EXPERIENCE) para mejor visibilidad.
 */

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
] satisfies Array<{ name: SectionType; locale: typeof languageKeys[number]; testTag: string; testSlug: string }>

for (const content of testContents) {
  const config = sectionsConfig[content.name]

  test.describe(`[${config.category}] ${content.name}`, () => {
    test(
      `navigation for ${content.name} content with slug ${content.testSlug} and tag ${content.testTag} in lang ${content.locale} `,
      { tag: [`@content-${content.name}`, `@${content.locale}`, '@navigation', '@functional'] },
      async ({ page }) => {
        // 1. Ir a listado de sección y validar carga
        const list = await userIsOnContentList(page, content.name, content.locale)
        await list.shouldBeLoaded(content.locale).with(expect)

        // 2. Click en un tag para filtrar
        await list.filterByTag(content.testTag)
        await list.shouldBeLoaded(content.locale).with(expect)

        // 3. Validar filtrado fue exitoso
        await list.shouldBeFiltered(content.testTag).with(expect)

        // 4. Click en el item con testSlug (sin navegar por URL)
        const entryUrl = getEntryURL(content.name, content.locale, content.testSlug)
        await list.openItem(entryUrl)

        // 5. Validar que el detail page se cargó correctamente
        const detail = contentDetailPage(page, content.name)
        await detail.shouldBeLoaded(content.locale).with(expect)
      },
    )
  })
}
