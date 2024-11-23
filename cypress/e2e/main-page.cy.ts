it('Pagina de inicio', () => {
  cy.visit('/')
  cy.get('title').should('have.text', 'Página de inicio | SeCOrTo')
  cy.get('h1').should('have.text', 'Soy Sergio Carlos Orozco Torres')
  cy.get('.hamburger').should('not.be.visible')
  cy.viewport('iphone-6')
  cy.get('.sidebar-title').should('not.be.visible')
  cy.get('.hamburger').click()
  cy.get('.sidebar-title').should('have.text', 'Sergio Carlos Orozco Torres')
  cy.get('.hamburger').click()
  cy.get('.sidebar-title').should('not.be.visible')
});
