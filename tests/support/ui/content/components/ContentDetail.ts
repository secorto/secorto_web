import type { Locator } from '@playwright/test'
import { Target, target } from '@tests/support/ui/components/Target'

/**
 * Componente para detalle de experience (work, project, community).
 * Patrón: Recibe Target + TargetSelector (DI).
 */
export class ContentDetailComponent {
  constructor(
    readonly container: Target,
    readonly roleField: Target,
    readonly responsibilitiesField: Target,
    readonly websiteLink: Target,
  ) {}

  shouldHaveRole(expectedRole: string) {
    return this.roleField.shouldContainText(expectedRole)
  }

  shouldHaveResponsibilities(expectedResponsibilities: string) {
    return this.responsibilitiesField.shouldContainText(expectedResponsibilities)
  }

  shouldHaveWebsite(expectedWebsite: string) {
    return this.websiteLink.shouldHaveAttribute('href', expectedWebsite)
  }
}

/**
 * Factory inyecta selectores de fields.
 */
export function contentDetailComponent(containerLocator: Locator) {
  return new ContentDetailComponent(
    target('content detail', containerLocator),
    target('role field', containerLocator.locator('[data-testid="post-role"]')),
    target('responsibilities field', containerLocator.locator('[data-testid="post-responsibilities"]')),
    target('website link', containerLocator.locator('a[data-testid="post-website"]')),
  )
}
