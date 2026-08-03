import { test, expect } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { getEntryURL } from '@domain/section'
import { blogFlow } from '@tests/support/ui/content/BlogPages'
import { projectFlow } from '@tests/support/ui/content/ProjectPages'
import { workFlow } from '@tests/support/ui/content/WorkPages'
import { communityFlow } from '@tests/support/ui/content/CommunityPages'
import { talkFlow } from '@tests/support/ui/content/TalkPages'

/**
 * Flujo completo de navegación en content:
 * 1. Ir a listado de sección
 * 2. Validar carga
 * 3. Click en un tag
 * 4. Validar filtrado (URL cambió, contenido filtrado)
 * 5. Click en item de la lista (sin navegar por URL)
 *
 * Patrón: Cada content type exporta su descriptor (ContentTypeFlow<ListPage>).
 * Test parametrizado itera sobre descriptores (agnóstico).
 * Sin duplicación, sin userInDetail, sin imports genéricos (as *).
 */

const flows = [
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
      { tag: [`@content-${flow.name}`, `@${locale}`, '@navigation', '@functional'] },
      async ({ page }) => {
        // 1. Ir a listado de sección y validar carga
        const list = await flow.userInList(page, locale)
        await list.shouldBeLoaded(locale).with(expect)

        // 2. Click en un tag para filtrar
        // Navegación interna: /es/blog → /es/blog/tags/python (sigue siendo ContentListPage)
        await list.filterByTag(flow.testTag)
        await list.shouldBeLoaded(locale).with(expect)

        // 3. Validar filtrado fue exitoso
        // Comprueba: URL contiene /tags/{tag} y lista tiene resultados
        await list.shouldBeFiltered(flow.testTag).with(expect)

        // 4. Click en el item con testSlug (sin navegar por URL)
        // Usa getEntryURL() del domain para obtener el href correcto (rutas localizadas)
        const entryUrl = getEntryURL(flow.name, locale, flow.testSlug)
        await list.openItem(entryUrl)

        // 5. Validar que el detail page se cargó correctamente
        const detail = flow.createDetail(page)
        await detail.shouldBeLoaded(locale).with(expect)
      },
    )
  }
}
