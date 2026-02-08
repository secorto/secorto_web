describe('Página de inicio', () => {
  beforeEach(() => {
    cy.visit('/es')
  })

  it('Verifica elementos principales y menú móvil', () => {
    // Verifica título y encabezado principal
    cy.get('title').should('have.text', 'Página de inicio | SeCOrTo')
    cy.get('h1').should('have.text', 'Soy Sergio Carlos Orozco Torres')

    // Verifica menú en escritorio
    cy.get('[data-testid="hamburger"]').should('not.be.visible')

    // Cambia a vista móvil y verifica menú lateral
    cy.viewport('iphone-6')
    cy.get('[data-testid="sidebar-title"]').should('not.be.visible')
    cy.get('[data-testid="hamburger"]').click()
    cy.get('[data-testid="sidebar-title"]').should('have.text', 'Sergio Carlos Orozco Torres')
    cy.get('[data-testid="hamburger"]').click()
    cy.get('[data-testid="sidebar-title"]').should('not.be.visible')
  })
})
