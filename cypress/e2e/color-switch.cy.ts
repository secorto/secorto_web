import { lightMode } from "./stubs"

describe('Color switch', () => {
  beforeEach(() => {
    cy.visit('/', lightMode())
  })

  it('Permite alternar entre modo claro y oscuro', () => {
    cy.get('html').should('not.have.class', 'dark')
    cy.get('#themeToggle').click()
    cy.get('html').should('have.class', 'dark')
    cy.get('#themeToggle').click()
    cy.get('html').should('not.have.class', 'dark')
  })
})
