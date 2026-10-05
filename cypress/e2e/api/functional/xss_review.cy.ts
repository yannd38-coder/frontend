describe('Test de sécurité - Faille XSS dans le formulaire d\'avis', () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Déconnexion').should('be.visible');
  });

  it('Injecte un script XSS dans le formulaire d\'avis et vérifie son comportement', () => {
    const xssPayload = '<script>window.xssVulnerable=true</script>';

    cy.intercept('POST', '**/reviews').as('postReview');

    cy.visit('/#/reviews');

    cy.get('[data-cy="review-input-rating-images"] img').last().click();

    cy.get('[data-cy="review-input-title"]').type('Test de sécurité XSS');
    cy.get('[data-cy="review-input-comment"]').type(xssPayload, { parseSpecialCharSequences: false });

    cy.get('[data-cy="review-submit"]').click();

    cy.wait('@postReview').its('response.statusCode').should('be.oneOf', [200, 201]);

    // 1. Vérifie que le script ne s'est PAS exécuté dans l'environnement JS
    cy.window().should((win: any) => {
      expect(win.xssVulnerable).to.be.undefined;
    });

    // 2. Vérifie qu'un nouvel avis a bien été ajouté au DOM
    cy.get('[data-cy="review-detail"]').should('have.length.at.least', 1);
  });
});