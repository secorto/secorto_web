import type { Page } from '@playwright/test'
import type { Verification } from '@tests/step'
import { orchestrateStep, type Step } from '@tests/step'
import { mockThirdParty } from '@tests/support/mocks/mockThirdParty'
import type { Loadable, LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import type { UILanguages } from '@i18n/ui'
import type { MainLayoutComponent } from '@tests/support/ui/layouts/main'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/layouts/main'
import { target } from '@tests/support/ui/target/target'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'

/**
 * Contexto unificado para una página.
 * Fuente ÚNICA de verdad para inyecciones.
 * No incluye main (es solo temporal en factory).
 * No incluye page (está encapsulado en los flujos).
 */
export type PageContext = {
  readonly layout: MainLayoutComponent
  readonly validateUrl: (expected: string | RegExp) => Verification<void>
  readonly a11y: A11y
}

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
 * Clase base para páginas localizadas.
 * Extiende NavigablePage — hereda shouldBeLoaded() y auditA11y() sin duplicar.
 * Implementa LocalizedUrl + LocalizedPage.
 *
 * Responsabilidades:
 * - shouldBeLoaded() (heredado de NavigablePage)
 * - auditA11y() (heredado de NavigablePage)
 * - shouldBeInLocale() genérico (LocalizedUrl) — NO se repite en subclases
 * - shouldBeLocalized() genérico (LocalizedPage) — delegado a mainLayout
 *
 * Cada subclase SOLO debe implementar: expectedUrl(locale)
 */
export abstract class LocalizedNavigablePage
  extends NavigablePage
  implements LocalizedUrl, LocalizedPage<void> {
  protected readonly validateUrl: (expected: string | RegExp) => Verification<void>

  constructor(context: PageContext) {
    super(context.layout, context.a11y)
    this.validateUrl = context.validateUrl
  }

  /**
   * Retorna el patrón de URL esperado para esta página en un locale dado.
   * Cada subclase implementa su propio patrón.
   * No debe ser Paso — es solo data.
   */
  protected abstract expectedUrl(locale: UILanguages): string | RegExp

  /**
   * Validación genérica de URL por locale.
   * Implementación única de LocalizedUrl — no se repite en subclases.
   */
  shouldBeInLocale(locale: UILanguages): Verification<void> {
    return this.validateUrl(this.expectedUrl(locale))
  }

  /**
   * Delegación a mainLayout para validación de localización de contenido.
   * Implementación de LocalizedPage.
   */
  shouldBeLocalized(locale: UILanguages) {
    return this.mainLayout.shouldBeLocalized(locale)
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
) => orchestrateStep(
    title,
    async () => {
      if (preAct) await preAct(page)
      await mockThirdParty(page)
      await page.goto(url, gotoOptions)
      return await factory(page)
    }, async (pageObject, { expect }) => {
      await pageObject.shouldBeLoaded().with(expect)
      return pageObject
    }
  )

/**
 * Helper para construir el contexto base de una página: layout + flujos.
 * Retorna PageContext unificado — fuente única de verdad para inyecciones.
 * Evita repetición en los factories de pages.
 */
export function createPageContext(
  page: Page,
  pageName: string,
  main: LocalizedPage<void>,
): PageContext {
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
