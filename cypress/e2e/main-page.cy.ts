describe('Página de inicio', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Verifica elementos principales y menú móvil', () => {
    // Verifica título y encabezado principal
    cy.get('title').should('have.text', 'Página de inicio | SeCOrTo')
    cy.get('h1').should('have.text', 'Soy Sergio Carlos Orozco Torres')

    // Verifica menú en escritorio
    cy.get('.hamburger').should('not.be.visible')

    // Cambia a vista móvil y verifica menú lateral
    cy.viewport('iphone-6')
    cy.get('.sidebar-title').should('not.be.visible')
    cy.get('.hamburger').click()
    cy.get('.sidebar-title').should('have.text', 'Sergio Carlos Orozco Torres')
    cy.get('.hamburger').click()
    cy.get('.sidebar-title').should('not.be.visible')
  })
  })
