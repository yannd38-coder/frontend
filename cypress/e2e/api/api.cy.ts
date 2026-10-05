describe('Tests API - Eco Bliss Bath', () => {
  const baseUrl = 'http://localhost:8081';
  let jwtToken = '';

  beforeEach(() => {
    // Connexion via API pour obtenir le token JWT
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      jwtToken = res.body.token;
    });
  });

  it('1. GET /orders - Acces hors connexion (Verif 401 ou 403)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/orders`,
      failOnStatusCode: false
    }).then((res) => {
      expect([401, 403]).to.include(res.status);
    });
  });

  it('2. GET /orders - Acces avec authentification', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/orders`,
      headers: { Authorization: `Bearer ${jwtToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('3. GET /products - Recuperation de la liste des produits', () => {
    cy.request('GET', `${baseUrl}/products`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('4. POST /reviews - Envoi d\'un avis', () => {
    const xssPayload = '<script>alert("xss")</script>';

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: { Authorization: `Bearer ${jwtToken}` },
      body: {
        title: 'Avis Test',
        comment: xssPayload,
        rating: 5
      },
      failOnStatusCode: false
    }).then((res) => {
      // Vérification que le backend accepte et enregistre l'avis
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.have.property('comment');
    });
  });

  it('5. PUT /orders/add - Ajout d\'un produit avec quantite invalide', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/orders/add`,
      headers: { Authorization: `Bearer ${jwtToken}` },
      body: {
        product: 4,
        quantity: -1
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('6. PUT /orders/add - Ajout 1 produit disponible au panier', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/orders/add`,
      headers: { Authorization: `Bearer ${jwtToken}` },
      body: {
        product: 4,
        quantity: 1
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });
});