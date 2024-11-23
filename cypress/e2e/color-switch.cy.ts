import { lightMode } from "./stubs";

describe('Color switch', () => {
  it('Sidebar Title is visible on desktop', () => {
    cy.visit('/', lightMode());
    cy.get('html').should('not.have.class', 'dark')
    cy.get('#themeToggle').click()
    cy.get('html').should('have.class', 'dark')
    cy.get('#themeToggle').click()
    cy.get('html').should('not.have.class', 'dark')
  })
})
