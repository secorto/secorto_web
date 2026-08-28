import { Target } from "./target"

export const shouldBeVisible =
  (verifyStep: VerifyStepFn, target: Target) =>
    () =>
      verifyStep(`${target.name} should be visible`, async ({ expect }) => {
        await expect(target.locator).toBeVisible()
      })

export const shouldHaveText =
  (verifyStep: VerifyStepFn, target: Target) =>
    (textOrRegex: string | RegExp) =>
      verifyStep(`${target.name} should have text`, async ({ expect }) => {
        await expect(target.locator).toHaveText(textOrRegex)
      })

export const shouldContainText =
  (verifyStep: VerifyStepFn, target: Target) =>
    (textOrRegex: string | RegExp) =>
      verifyStep(`${target.name} should contain text`, async ({ expect }) => {
        await expect(target.locator).toContainText(textOrRegex)
      })

export const shouldHaveVisibleText =
  (verifyStep: VerifyStepFn, target: Target) =>
    (textOrRegex: string | RegExp) =>
      verifyStep(`${target.name} visible and has text`, async ({ expect }) => {
        await expect(target.locator).toBeVisible()
        await expect(target.locator).toHaveText(textOrRegex)
      })

export const shouldHaveClass =
  (verifyStep: VerifyStepFn, target: Target) =>
    (re: RegExp) =>
      verifyStep(`${target.name} should have class`, async ({ expect }) => {
        await expect(target.locator).toHaveClass(re)
      })

export const shouldHaveAttribute =
  (verifyStep: VerifyStepFn, target: Target) =>
    (name: string, value: string) =>
      verifyStep(
        `${target.name} should have attribute ${name} with value ${value}`,
        async ({ expect }) => {
          await expect(target.locator).toHaveAttribute(name, value)
        },
      )

export const shouldHaveCount =
  (verifyStep: VerifyStepFn, target: Target) =>
    (count: number) =>
      verifyStep(`${target.name} should have count ${count}`, async ({ expect }) => {
        await expect(target.locator).toHaveCount(count)
      })

export const shouldHaveAtLeastOne =
  (verifyStep: VerifyStepFn, target: Target) =>
    () =>
      verifyStep(`${target.name} should have at least one item`, async ({ expect }) => {
        await expect.poll(async () => target.locator.count()).toBeGreaterThan(0)
      })