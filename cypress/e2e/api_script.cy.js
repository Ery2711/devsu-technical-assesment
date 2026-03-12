const json_request = {
  "id": 2713,
  "category": {
    "id": 0,
    "name": "Dogs"
  },
  "name": "TestPet1",
  "photoUrls": [],
  "tags": [],
  "status": "available"
}

const store_url = "https://petstore.swagger.io/v2"

describe('API requests - Opcion 2', () => {
  it('Agregar nueva mascota', () => {
    let endpoint = "/pet"
    cy.request('POST', store_url + endpoint, json_request).then((response) => {
      expect(response.status).to.equal(200)
    });
  });
  
  it('Consultar mascota por ID', () => {
    let endpoint = `/pet/${json_request.id}`
    cy.request('GET', store_url + endpoint).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.id).to.equal(json_request.id)
      expect(JSON.stringify(response.body)).to.equal(JSON.stringify(json_request))
    });
  });
  
  it('Actualizar nombre y status de una mascota existente', () => {
    let endpoint = "/pet"
    let json_updated = JSON.parse(JSON.stringify(json_request))
    json_updated.name = "TestName Edited"
    json_updated.status = "sold" 
    cy.request('PUT', store_url + endpoint, json_updated).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.name).not.to.equal(json_request.name)
      expect(response.body.status).not.to.equal(json_request.status)
    });
  });
  
  it('Consultar mascota por status', () => {
    let endpoint = `/pet/findByStatus?status=${json_request.status}`
    cy.request('GET', store_url + endpoint).then((response) => {
      expect(response.status).to.equal(200)
      response.body.forEach((element) => {
        expect(element.status).to.equal(json_request.status)
      });
      // expect(response.body.status).to.equal(json_request.status)
    });
  });
});