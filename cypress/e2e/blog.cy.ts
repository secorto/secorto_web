it('Blog post se visualiza', () => {
  cy.visit('/es/blog');
  cy.get('head title').should('have.text', 'Blog | SeCOrTo')
  cy.get('header h1').should('have.text', 'Blog');
  cy.get('[href="/es/blog/tags/python"]').should('not.have.class', 'active');
  cy.get('[href="/es/blog/tags/python"]').click()
  cy.get('[href="/es/blog/tags/python"]').should('have.class', 'active');
  cy.get('header h1').should('have.text', 'python');
  cy.get('[href="/es/blog/2022-08-14-poo-python"]').click()
  cy.get('header h1').should('have.text', 'Programación orientada a objetos en python');
  cy.viewport('iphone-6')
  cy.scrollTo('right');
  cy.window().its('scrollX').should('eq', 0)
});
