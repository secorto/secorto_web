import { test } from '@tests/fixtures'
import { sectionRoutes } from '@domain/section'
import { userIsOnContentList } from '@tests/support/ui/content/ContentListPage'
import { contentDetailPage } from '@tests/support/ui/content/ContentDetailPage'
import { testContents } from '@tests/support/data/testContents'

/**
 * Flujo completo de navegación en content:
 * 1. Ir a listado de sección
 * 2. Validar carga
 * 3. Click en un tag
 * 4. Validar filtrado (URL cambió, contenido filtrado)
 * 5. Click en item de la lista (sin navegar por URL)
 *
 * Patrón: testContents con locale incluido para evitar variaciones de slugs por idioma.
 * Reporting: test.describe() agrupa por sección para mejor visibilidad.
 */

for (const content of testContents) {

  test.describe(`${content.name}`, () => {
    test(
      `navigation for ${content.name} content with slug ${content.testSlug} and tag ${content.testTag} in lang ${content.locale} `,
      { tag: [`@content-${content.name}`, `@${content.locale}`, '@navigation', '@functional'] },
      async ({ page }) => {
        // 1. Ir a listado de sección y validar carga (shouldBeLoaded llamado por visit)
        const list = await userIsOnContentList(page, content.name, content.locale)
        await list.shouldBeLocalized(content.locale).soft()

        // 2. Click en un tag para filtrar
        await list.filterByTag(content.testTag)
        await list.shouldBeLocalized(content.locale).soft()

        // 3. Validar filtrado fue exitoso
        await list.shouldBeFiltered(content.locale, content.testTag).soft()

        // 4. Click en el item con testSlug (sin navegar por URL)
        const entryPath = sectionRoutes.getEntryPath(content.name, content.locale, content.testSlug)
        await list.openItem(entryPath)

        // 5. Validar que el detail page se cargó correctamente
        const detail = contentDetailPage(page, content.name)
        await detail.shouldBeLoaded().soft()
        await detail.shouldBeLocalized(content.locale).soft()
      },
    )
  })
}
