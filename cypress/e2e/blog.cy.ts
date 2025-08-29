describe('Blog', () => {
  beforeEach(() => {
    cy.visit('/blog')
  })

  it('Permite navegar por categorías y ver un post sin scroll horizontal', () => {
    // Verifica título y encabezado principal
    cy.get('head title').should('have.text', 'Blog | SeCOrTo')
    cy.get('header h1').should('have.text', 'Blog')

    // Interactúa con la categoría "python"
    const pythonTag = '[href="/blog/tags/python"]'
    cy.get(pythonTag).should('not.have.class', 'active')
    cy.get(pythonTag).click()
    cy.get(pythonTag).should('have.class', 'active')
    cy.get('header h1').should('have.text', 'python')

    // Accede al post de POO en Python
    cy.get('[href="/blog/2022-08-14-poo-python"]').click()
    cy.get('header h1').should('have.text', 'Programación orientada a objetos en python')

    // Verifica que no haya scroll horizontal en móvil
    cy.viewport('iphone-6')
    cy.scrollTo('right')
    cy.window().its('scrollX').should('eq', 0)
  })
  })
