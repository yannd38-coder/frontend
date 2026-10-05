describe('Smoke Tests - Elements principaux IHM', () => {
    it('Verifie la presence des champs et du bouton de connexion', () => {
        cy.visit('/#/login');
        cy.get('[data-cy="login-input-username"]').should('be.visible');
        cy.get('[data-cy="login-input-password"]').should('be.visible');
        cy.get('[data-cy="login-submit"]').should('be.visible');
    });

    it('Verifie la presence du bouton panier une fois connecté', () => {
        cy.visit('/#/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');
        cy.get('[data-cy="login-submit"]').click();

        // Verification du lien de deconnexion puis du lien panier
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.get('[data-cy="nav-link-cart"]').should('be.visible');
    });

    it('Verifie affichage du stock sur fiche produit', () => {
        cy.visit('/#/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');
        cy.get('[data-cy="login-submit"]').click();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');

        cy.visit('/#/products/4');
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
    });
});