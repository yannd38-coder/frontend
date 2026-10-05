describe('E2E - Tunnel d\'achat complet avec persistance BDD', () => {
  it('Exécute une commande complète et vérifie la décrémentation en BDD', () => {
    let stockInitial = 0;

    // 1. Relevé du stock initial de l'article via l'API
    cy.request('GET', 'http://localhost:8081/products/4').then((res) => {
      expect(res.status).to.eq(200);
      stockInitial = res.body.availableStock;
    });

    // 2. Connexion via l'UI
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');

    // 3. Navigation sur le produit 4 et ajout de 2 unités
    cy.visit('/#/products/4');
    cy.get('input[type="number"]').clear().type('2');
    cy.get('[data-cy="detail-product-add"]').click();

    // 4. Accès au panier
    cy.visit('/#/cart');
    cy.get('[data-cy="cart-line-name"]').should('be.visible');

    // 5. Remplissage des champs de livraison obligatoires
    cy.get('[data-cy="cart-input-lastname"]').clear().type('Test');
    cy.get('[data-cy="cart-input-firstname"]').clear().type('User');
    cy.get('[data-cy="cart-input-address"]').clear().type('10 Rue du Test');
    cy.get('[data-cy="cart-input-zipcode"]').clear().type('75000');
    cy.get('[data-cy="cart-input-city"]').clear().type('Paris');

    // 6. Validation de la commande
    cy.get('[data-cy="cart-submit"]').click();

    // 7. Vérification de la confirmation
    cy.url().should('include', '/confirmation');

    // 8. Vérification que le stock en BDD a bien été décrémenté de 2 unités
    cy.request('GET', 'http://localhost:8081/products/4').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.availableStock).to.eq(stockInitial - 2);
    });
  });
});