it('los titulos son correctos', () => {
  const page = cy.visit('/');

  page.get('title').should('have.text', 'Página de inicio | SeCOrTo')
  page.get('h1').should('have.text', 'Soy Sergio Carlos Orozco Torres');
});
