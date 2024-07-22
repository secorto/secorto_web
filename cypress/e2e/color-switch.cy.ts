import { lightMode } from "./stubs";

describe('Color switch', () => {
  it('Sidebar Title is visible on desktop', () => {
    const page = cy.visit('/', lightMode());
    page.get('html').should('not.have.class', 'dark')
    page.get('#themeToggle').click()
    page.get('html').should('have.class', 'dark')
    page.get('#themeToggle').click()
    page.get('html').should('not.have.class', 'dark')
  })
})
  