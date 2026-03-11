const { allowCypressEnv } = require("../../cypress.config")

describe('Automatizacion E2E - Opcion 2', () => {
  beforeEach('Autenticación válida de usuario', () => {
    // Abriendo navegador
    cy.visit('https://www.saucedemo.com')
    // Declarando variables y autenticando usuario
    cy.fixture('variables').then((data) => {
      cy.get('#user-name').type(data.email);
      cy.get('#password').type(data.password);
      cy.get('#login-button').click()
    });
    // Validacion de Log In correcto
    cy.get("[data-test='secondary-header']>span[data-test=title]").invoke('text').then((value) => {
      expect(value).to.equal('Products')
    });
  });

  let products_list = []
  let selected_products = []
  it('Adición de productos al carrito', () => {
    // ************************* Adición de productos al carrito **************************
    // Inicialización de variables locales
    let max_products = 0

    // Obtención de productos: Transformación de valores de atributos
    cy.get('#inventory_container .inventory_item').each((product_detail) => {
      const product = {
        name: product_detail.children().find('.inventory_item_name').text(),
        price: parseFloat(product_detail.children().find('.inventory_item_price').text().replace('$',''))
      }
      products_list.push(product)
    }).then(() => {
      // Bucle While para seleccionar máximo 2 productos con el atributo name
      while (max_products < 2){
        let random_number = Math.floor((Math.random() * products_list.length))
        let id_format = "add-to-cart-".concat(products_list[random_number].name.toLowerCase().split(' ').join('-'))
        cy.get(`div button[name='${id_format}']`).click()
        selected_products.push(products_list[random_number])
        products_list.splice(random_number,random_number)
        max_products++
      }
    });
      
    cy.get("[data-test='shopping-cart-badge']").invoke('text').then((value) => {
    expect(value).to.equal('2')
    });
    
    // ************************* Visualización de productos del carrito **************************
    cy.get("[data-test='shopping-cart-link']").click()
    cy.get("[data-test='secondary-header']>span[data-test=title]").invoke('text').then((value) => {
      expect(value).to.equal('Your Cart')
    });
    
    let cart_items = []
    
    cy.get('#cart_contents_container .cart_item').each((cart_selected) => {
      const item = {
        name: cart_selected.children().find('.inventory_item_name').text(),
        price: parseFloat(cart_selected.children().find('.inventory_item_price').text().replace('$',''))
      }
      cart_items.push(item)
    }).then(() => {
      for (let i=0; i<cart_items.length; i++){
        expect(cart_items[i].name).to.equal(selected_products[i].name)
      }
      cy.get('#checkout').click()
    });

    // ************************* Checkout de productos **************************
    cy.fixture('variables').then((data) => {
      cy.get('div .checkout_info #first-name').type(data.first_name)
      cy.get('div .checkout_info #last-name').type(data.last_name)
      cy.get('div .checkout_info #postal-code').type(data.zipcode)
      cy.get('.checkout_buttons #continue').click()
    });
  });
});