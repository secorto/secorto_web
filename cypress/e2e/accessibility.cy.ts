import { darkMode, lightMode } from "./stubs"

describe("Accessibility tests Dark mode", () => {
  beforeEach(() => {

  })
  it("Has no detectable accessibility violations on load", () => {
    const page = cy.visit("/", darkMode()).get("main")
    cy.injectAxe()
    page.get('[href="/charla/"]').click()
    cy.injectAxe()
    page.get('[href="/blog/"]').click()
    cy.injectAxe()
    page.get('[href="/comunidad/"]').click()
    cy.injectAxe()
    page.get('[href="/trabajo/"]').click()
    cy.injectAxe()
    page.get('[href="/proyecto/"]').click()
    cy.injectAxe()
  })
})

describe("Accessibility tests light mode", () => {

  it("Has no detectable accessibility violations on load", () => {
    const page = cy.visit("/", lightMode()).get("main")
    cy.injectAxe()
    cy.checkA11y()
    page.get('[href="/charla/"]').click()
    cy.injectAxe()
    page.get('[href="/blog/"]').click()
    cy.injectAxe()
    page.get('[href="/comunidad/"]').click()
    cy.injectAxe()
    page.get('[href="/trabajo/"]').click()
    cy.injectAxe()
    page.get('[href="/proyecto/"]').click()
    cy.injectAxe()
  })
})
