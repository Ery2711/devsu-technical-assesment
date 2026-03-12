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
  it('Automatización de flujo E2E - Opcion 2', () => {
    // ************************* Adición de productos al carrito **************************
    // Inicialización de variables locales
    let max_products = 0

    // Obtención de productos: Transformación de valores de atributos
    cy.get('#inventory_container .inventory_item').each((product_detail) => {
      const product = {
        name: product_detail.children().find('.inventory_item_name[data-test="inventory-item-name"]').text(),
        price: parseFloat(product_detail.children().find('.inventory_item_price').text().replace('$',''))
      }
      products_list.push(product)
    }).then(() => {
      // Bucle While para seleccionar máximo 2 productos con el atributo name
      while (max_products < 2){
        let random_number = Math.ceil((Math.random() * products_list.length))
        let id_format = "add-to-cart-".concat(products_list[random_number].name.toLowerCase().split(' ').join('-'))
        cy.get(`div.pricebar button[id='${id_format}']`).click()
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

    // ************************* Finalización de compra **************************
    cy.get("[data-test='secondary-header']>span[data-test=title]").invoke('text').then((value) => {
      expect(value).to.equal('Checkout: Overview')
    });

    // Obteniendo los valores para el subtotal y el total
    let subtotal_price = 0
    let total_price = 0
    cy.get('.cart_list .cart_item').each((cart_selected) => {
      const item = {
        name: cart_selected.children().find('.inventory_item_name').text(),
        price: parseFloat(cart_selected.children().find('.inventory_item_price').text().replace('$',''))
      }
      subtotal_price += item.price
    }).then(() => {
      // Calculando el total con un impuesto de 8%
      total_price = subtotal_price + (subtotal_price * 0.08);
      cy.get('.summary_subtotal_label').invoke('text').then((subtotal) => {
        expect(subtotal).to.equal(`Item total: $${subtotal_price}`);
      })
      cy.get('.summary_total_label').invoke('text').then((total) => {
        expect(total).to.equal(`Total: $${total_price.toFixed(2)}`);
      })
      cy.get('button#finish').click();
    });
    // Validando la página de confirmación
    cy.get("[data-test='secondary-header']>span[data-test=title]").invoke('text').then((value) => {
      expect(value).to.equal('Checkout: Complete!')
    });
    cy.get('#checkout_complete_container h2.complete-header').invoke('text').then((label) =>{
      expect(label).to.equal('Thank you for your order!')
    });
  });
});
});