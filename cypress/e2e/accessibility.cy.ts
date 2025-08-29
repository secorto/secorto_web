import { darkMode, lightMode } from "./stubs"

const routes = [
  "/charla/",
  "/blog/",
  "/comunidad/",
  "/trabajo/",
  "/proyecto/",
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
    cy.visit("/", darkMode()).get("main")
    testAccessibilityForRoutes()
  })

  it("Light mode: no detectable accessibility violations on main routes", () => {
    cy.visit("/", lightMode()).get("main")
    testAccessibilityForRoutes()
  })
})
