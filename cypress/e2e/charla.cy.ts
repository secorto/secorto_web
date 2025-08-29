describe('Charlas', () => {
  beforeEach(() => {
    cy.visit('/charla');
  });

  it('Permite navegar por categorías y ver una charla', () => {
    // Verifica título y encabezado principal
    cy.get('head title').should('have.text', 'Charlas | SeCOrTo');
    cy.get('header h1').should('have.text', 'Charlas');

    // Interactúa con la categoría "containers"
    const containersTag = '[href="/charla/tags/containers"]';
    cy.get(containersTag).should('not.have.class', 'active');
    cy.get(containersTag).click();
    cy.get(containersTag).should('have.class', 'active');
    cy.get('header h1').should('have.text', 'containers');

    // Accede a la charla de Devcontainers
    cy.get('[href="/charla/2023-09-27-devcontainers"]').click();
    cy.get('header h1').should('have.text', 'Devcontainers en localhost');
  });
});
