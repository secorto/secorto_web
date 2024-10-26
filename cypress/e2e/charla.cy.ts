it('Charlas se visualizan', () => {
  const page = cy.visit('/charla');
  page.get('head title').should('have.text', 'Charlas | SeCOrTo')
  page.get('header h1').should('have.text', 'Charlas');
  page.get('[href="/charla/tags/containers"]').should('not.have.class', 'active');
  page.get('[href="/charla/tags/containers"]').click()
  page.get('[href="/charla/tags/containers"]').should('have.class', 'active');
  page.get('header h1').should('have.text', 'containers');
  page.get('[href="/charla/2023-09-27-devcontainers"]').click()
  page.get('header h1').should('have.text', 'Devcontainers en localhost');
});
