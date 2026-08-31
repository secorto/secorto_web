import type { Page } from '@playwright/test'
import { contractVerifyStep, type Step } from '@tests/step'
import { mockThirdParty } from '@tests/support/mocks/mockThirdParty'
import type { Loadable, LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/shared/components/MainLayout'
import { target } from '@tests/support/ui/components/Target'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'

/**
 * Clase abstracta base para todas las páginas navegables.
 * Delega carga y auditoría a11y al layout.
 */
export abstract class NavigablePage implements Loadable {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly a11y: A11y,
  ) {}

  shouldBeLoaded() {
    return this.mainLayout.shouldBeLoaded()
  }

  auditA11y() {
    return this.a11y
  }
}

/**
 * Navega a una URL y ejecuta el factory para crear el page object.
 * Orquesta: setup -> goto -> factory -> validación de carga.
 */
export const visit = <T extends Loadable>(
  title: string,
  page: Page,
  url: string,
  factory: (page: Page) => T | Promise<T> | Step<T>,
  preAct?: (page: Page) => Step<void> | void,
  gotoOptions?: Parameters<Page['goto']>[1],
) => contractVerifyStep(
    title,
    async () => {
      if (preAct) await preAct(page)
      await mockThirdParty(page)
      await page.goto(url, gotoOptions)
      return await factory(page)
    }, async (pageObject, {expect}) => {
      await pageObject.shouldBeLoaded().with(expect)
      return pageObject
    }
  )

/**
 * Helper para construir el contexto base de una página: layout + validación de URL + a11y.
 * Evita repetición en los factories de pages.
 */
export function createPageContext(
  page: Page,
  pageName: string,
  main: LocalizedPage<void>,
) {
  return {
    layout: mainLayout({
      ...defaultMainLayout(page),
      name: pageName,
      headerTitle: target(`${pageName} header title`, page.getByRole('heading', { level: 1 })),
      main,
    }),
    validateUrl: urlValidator(page),
    a11y: a11yFlow(page),
  }
}
