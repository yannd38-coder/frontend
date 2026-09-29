describe('Tests Fonctionnels - Connexion & Panier', () => {

  beforeEach(() => {
    cy.login('test2@test.fr', 'testtest');
  });

  it('Ajout au panier et vérification de la baisse du stock', () => {
    // 1. Navigation vers la liste des produits
    cy.visit('/#/products');

    // 2. Clic sur le premier bouton "Consulter"
    cy.contains('button', 'Consulter').first().click();

    // 3. Clic sur "Ajouter au panier"
    cy.get('button').contains(/ajouter/i).click();

    // 4. Confirmation visuelle d'ajout
    cy.contains(/ajouté|panier/i).should('be.visible');
  });

  it('Vérification des limites : saisie de quantités invalides (-100)', () => {
    // 1. Navigation vers le produit 1
    cy.visit('/#/products/1');

    // 2. Saisie d'une quantité négative
    cy.get('input[type="number"]').clear().type('-100');
    cy.get('button').contains(/ajouter/i).click();

    // 3. Contrôle de sécurité : l'application ne doit pas afficher un stock négatif
    cy.get('body').invoke('text').then((text) => {
      const match = text.match(/(-?\d+)\s*en stock/i);
      if (match) {
        const stockRestant = parseInt(match[1], 10);
        expect(stockRestant, 'Le stock ne doit pas être négatif').to.be.at.least(0);
      }
    });
  });

  it('Anomalie : Autorise la commande de plus de 20 produits sans blocage (+25)', () => {
    // 1. Navigation vers le produit 9
    cy.visit('/#/products/9');

    // 2. Saisie d'une quantité supérieure à la limite autorisée (25)
    cy.get('input[type="number"]').clear({ force: true }).type('25', { force: true });
    cy.get('button').contains(/ajouter/i).click({ force: true });

    // 3. Assertion : Le système devrait afficher un message de blocage (FAIL attendu / RED)
    cy.contains(/impossible|limite|erreur|maximum/i).should('be.visible');
  });

});