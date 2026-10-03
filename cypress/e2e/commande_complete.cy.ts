describe('E2E - Tunnel d\'achat complet avec persistance BDD', () => {
  const baseUrl = 'http://localhost:8081';

  // Réinitialisation de la BDD avant chaque test
  beforeEach(() => {
    // Purge+remise à zéro des données(endpoint de seed/reset)
    cy.request('POST', `${baseUrl}/api/reset-db`);
  });

  it('Exécute une commande complète et vérifie la décrémentation en BDD', () => {
    // 1. Connexion utilisateur via l'UI
    cy.visit('/#/login');
    cy.get('input[type="email"], input[name="email"]').type('test2@test.fr');
    cy.get('input[type="password"]').type('testtest');
    cy.get('button').contains(/connecter/i).click();

    // 2. Navigation vers la fiche d'un produit(ex:Produit ID 4)
    cy.visit('/#/products/4');

    // 3. Choix de la quantité( ici 2 unités)et ajout au panier
    cy.get('input[type="number"]').clear().type('2');
    cy.get('button').contains(/ajouter/i).click();

    // 4. Accès au panier et validation de la commande
    cy.visit('/#/cart');
    cy.get('button').contains(/commander|valider|payer/i).click();

    // 5. Confirmation IHM
    cy.contains(/commande confirmée|merci/i).should('be.visible');

    // 6. Vérification côté API:le stock du produit 4 doit avoir baissé de 2
    cy.request(`${baseUrl}/products/4`).then((res) => {
      expect(res.status).to.eq(200);
      // Exemple:stock initial de 14-2bcommandés=12
      expect(res.body.stock).to.eq(12);
    });
  });
});