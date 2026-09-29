describe('Sécurité - Vérification Faille XSS (Avis)', () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('input').first().type('test2@test.fr');
    cy.get('input[type="password"]').type('testtest');
    cy.get('button').contains(/connecter/i).click();
  });

  it('Injecte un script XSS dans un avis et vérifie qu\'il n\'est pas exécuté', () => {
    const xssPayload = '<script>window.xssTest=true</script>';

    cy.visit('/#/products/4');

    // Saisie et soumission du commentaire
    cy.get('input, textarea').last().type(xssPayload);
    cy.get('button').contains(/publier|envoyer|poster|ajouter|valider/i).click();

    // Validation de sécurité : le script injecté n'a pas été exécuté dans le DOM
    cy.window().should('not.have.property', 'xssTest');
  });
});