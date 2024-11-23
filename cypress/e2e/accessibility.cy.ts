import { darkMode, lightMode } from "./stubs"

describe("Accessibility tests Dark mode", () => {
  it("Has no detectable accessibility violations on load", () => {
    cy.visit("/", darkMode()).get("main")
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/charla/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/blog/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/comunidad/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/trabajo/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/proyecto/"]').click()
    cy.injectAxe()
    cy.checkA11y()
  })
})

describe("Accessibility tests light mode", () => {

  it("Has no detectable accessibility violations on load", () => {
    cy.visit("/", lightMode()).get("main")
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/charla/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/blog/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/comunidad/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/trabajo/"]').click()
    cy.injectAxe()
    cy.checkA11y()
    cy.get('[href="/proyecto/"]').click()
    cy.injectAxe()
    cy.checkA11y()
  })
})
