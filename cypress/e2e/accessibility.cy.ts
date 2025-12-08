import { darkMode, lightMode } from "./stubs"

const routes = [
  "/es/charla",
  "/es/blog",
  "/es/comunidad",
  "/es/trabajo",
  "/es/proyecto",
]

function testAccessibilityForRoutes() {
  cy.injectAxe()
  cy.checkA11y()
  routes.forEach((route) => {
    cy.get(`[href="${route}"]`).click()
    cy.injectAxe()
    cy.checkA11y()
  })
}

describe("Accessibility tests", () => {
  it("Dark mode: no detectable accessibility violations on main routes", () => {
    cy.visit("/es", darkMode()).get("main")
    testAccessibilityForRoutes()
  })

  it("Light mode: no detectable accessibility violations on main routes", () => {
    cy.visit("/es", lightMode()).get("main")
    testAccessibilityForRoutes()
  })
})
