import type { Locator } from '@playwright/test'
import { step, verifyStep } from '@tests/step'
import type { TargetComponent } from '@tests/support/ui/target/target'
import { target } from '@tests/support/ui/target/target'
import { targetSelector, TargetSelector } from '@tests/support/ui/target/targetSelector'
import { link, type Link } from '@tests/support/ui/target/link'

export class TagsComponent {
  constructor(
    readonly container: TargetComponent,
    readonly tagLink: TargetSelector<string, Link>,
  ) {}

  filterByTag(tag: string) {
    return step(`Filter by tag "${tag}"`, async () => {
      await this.tagLink.get(tag).click()
    })
  }

  shouldRenderTags() {
    return verifyStep(`Tags are rendered`, async ({ expect }) => {
      await this.container.should.beVisible(expect)
      const tagCount = await this.container.locator.locator('[data-testid^="tag-link-"]').count()
      expect(tagCount).toBeGreaterThan(0)
    })
  }
}

export function tagsComponent(containerLocator: Locator) {
  return new TagsComponent(
    target('tags container', containerLocator),
    targetSelector(
      link,
      'tag link',
      (tag: string) => containerLocator.getByTestId(`tag-link-${tag}`),
      (tag: string) => tag,
    ),
  )
}
