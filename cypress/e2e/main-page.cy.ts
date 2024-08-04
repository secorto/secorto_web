it('Pagina de inicio', () => {
  const page = cy.visit('/');
  page.get('title').should('have.text', 'Página de inicio | SeCOrTo')
  page.get('h1').should('have.text', 'Soy Sergio Carlos Orozco Torres');
  page.get('.sidebar-title').should('have.text', 'Sergio Carlos Orozco Torres')
  page.get('.hamburger').should('not.be.visible')
});
