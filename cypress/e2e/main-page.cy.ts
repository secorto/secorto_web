it('Pagina de inicio', () => {
  const page = cy.visit('/')
  page.get('title').should('have.text', 'Página de inicio | SeCOrTo')
  page.get('h1').should('have.text', 'Soy Sergio Carlos Orozco Torres')
  page.get('.hamburger').should('not.be.visible')
  page.viewport('iphone-6')
  page.get('.sidebar-title').should('not.be.visible')
  page.get('.hamburger').click()
  page.get('.sidebar-title').should('have.text', 'Sergio Carlos Orozco Torres')
  page.get('.hamburger').click()
  page.get('.sidebar-title').should('not.be.visible')
});
