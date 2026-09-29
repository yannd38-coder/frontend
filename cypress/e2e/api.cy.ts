describe('Tests API - Eco Bliss Bath', () => {
  const baseUrl = 'http://localhost:8081';
  it('1. GET /orders - Accès hors connexion (Vérification 401 vs 403)', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      failOnStatusCode: false
    }).then((response) => {
      // Le test va échouer (RED) car le serveur renvoie 401 au lieu de 403
      expect(response.status).to.eq(403);
    });
  });

  it('2. POST /login - Utilisateur inconnu (Doit retourner 401)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        username: 'inconnu@test.fr',
        password: 'mauvaispassword'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it('3. POST /login - Utilisateur connu (Doit retourner 200 + token)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('token');
    });
  });

  it('4. GET /products - Récupération du catalogue', () => {
    cy.request(`${baseUrl}/products`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });
});

it('5. Bug 2 - Ajout au panier (Attendu POST, Obtenu PUT)', () => {
  // On teste si la route d'ajout au panier accepte le verbe conventionnel POST
  cy.request({
    method: 'POST',
    url: 'http://localhost:8081/orders/add',
    failOnStatusCode: false,
    body: { productId: 1, quantity: 1 }
  }).then((response) => {
    // Le test va échouer car l'application utilise la méthode PUT
    expect(response.status).to.eq(200);
  });
});
