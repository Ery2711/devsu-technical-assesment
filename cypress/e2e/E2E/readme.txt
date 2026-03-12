Technical assesment - Opción 2 de la sección de E2E

Este proyecto contiene un test de automatización E2E basado en Cypress. El flujo automatizado abarca desde la autenticación del usuario hasta la finalización del proceso de compra.


Características Principales

- Autenticación dinámica: Manejo de credenciales mediante 'cy.fixture'.
- Selección aleatoria: Algoritmo para seleccionar productos del inventario de forma aleatoria sin repetir elementos.
- Procesamiento de datos: Transformación de strings y formateo de precios (Conversión a 'float') para cálculos matemáticos.
- Validaciones de carrito: Verificación de persistencia de datos (El producto seleccionado es el mismo que se visualiza en el checkout).


Estructura del Test

El flujo se divide en las siguientes etapas clave:

1. Uso de 'beforeEach': Autenticación del usuario y validación del título 'Products'.
2. Adición al carrito: Obtención de nombres y precios. Generación de selectores dinámicos ('add-to-cart-...') para realizar la compra.
3. Validación del carrito: Verificación de que el contador del icono del carrito ('shopping-cart-badge') sea correcto y que los productos seleccionados coincidan en la vista 'Your Cart'.
4. Checkout: Llenado del formulario de información de envío mediante datos obtenidos desde el fixture.
5. Finalización: Cálculo matemático del total esperado (Subtotal + 8% tasa) para la verificación de monto subtotal y total de los precios del carrito. Validación final de la página de confirmación 'Checkout: Complete!'.


Configuración

La carpeta 'fixtures' contiene un archivo JSON con variables de prueba generadas, con el objetivo de realizar verificación con variables. La estructura es:

{
    "first_name": "TestUserFirstName",
    "last_name": "TestUserLastName",
    "zipcode": "07001",
    "email": "standard_user",
    "password": "secret_sauce"
}