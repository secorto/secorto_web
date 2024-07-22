describe('Sidebar', () => {
  it('Sidebar Title is visible on desktop', () => {
    const page = cy.visit('/');
    page.get('.sidebar-title').should('have.text', 'Sergio Carlos Orozco Torres')
    page.get('.hamburger').should('not.be.visible')
  })

  it('Sidebar Title is visible on mobile based on hamburger', () => {
    const page = cy.visit('/');
    page.viewport('iphone-6')
    page.get('.sidebar-title').should('not.be.visible')
    page.get('.hamburger').click()
    page.get('.sidebar-title').should('have.text', 'Sergio Carlos Orozco Torres')
    page.get('.hamburger').click()
    page.get('.sidebar-title').should('not.be.visible')
  });
})
  