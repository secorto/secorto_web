it('Charlas se visualizan', () => {
  cy.visit('/es/charla');
  cy.get('head title').should('have.text', 'Charlas | SeCOrTo')
  cy.get('header h1').should('have.text', 'Charlas');
  cy.get('[href="/es/charla/tags/containers"]').should('not.have.class', 'active');
  cy.get('[href="/es/charla/tags/containers"]').click()
  cy.get('[href="/es/charla/tags/containers"]').should('have.class', 'active');
  cy.get('header h1').should('have.text', 'containers');
  cy.get('[href="/es/charla/2023-09-27-devcontainers"]').click()
  cy.get('header h1').should('have.text', 'Devcontainers en localhost');
});
