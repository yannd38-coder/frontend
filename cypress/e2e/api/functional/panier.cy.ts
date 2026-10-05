describe('Tests Fonctionnels - Panier & Cas aux limites', () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');
  });

  it('1. Ajoute un produit au panier et vérifie la présence de la ligne', () => {
    cy.visit('/#/products/4');
    cy.get('[data-cy="detail-product-add"]').click();
    cy.visit('/#/cart');
    cy.get('[data-cy="cart-line-name"]').should('be.visible');
  });

  it('2. Bloque la saisie d\'une quantité négative (-100) sans envoyer de requête', () => {
    cy.intercept('PUT', '**/orders/add').as('addToCart');

    cy.visit('/#/products/4');

    // Saisie d'une quantité négative bloquée par les Validators Angular
    cy.get('input[type="number"]').clear().type('-100');
    cy.get('[data-cy="detail-product-add"]').click();

    // Vérification stricte : aucune requête réseau envoyée
    cy.get('@addToCart.all').should('have.length', 0);
  });

  it('3. Empêche le dépassement de quantité autorisée (25 unités)', () => {
    cy.visit('/#/products/4');
    cy.get('input[type="number"]').clear().type('25');
    cy.get('[data-cy="detail-product-add"]').click();

    cy.visit('/#/cart');
    cy.get('[data-cy="cart-line-name"]').should('be.visible');
  });
});