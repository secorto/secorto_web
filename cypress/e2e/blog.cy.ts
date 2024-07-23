it('Blog post se visualiza', () => {
  const page = cy.visit('/blog');
  page.get('head title').should('have.text', 'Blog | SeCOrTo')
  page.get('header h1').should('have.text', 'Blog');
  page.get('[href="/blog/2022-08-14-poo-python"]').click()
  page.get('header h1').should('have.text', 'Programación orientada a objetos en python');
  page.viewport('iphone-6')
  cy.scrollTo('right');
  cy.window().its('scrollX').should('eq', 0)
});
