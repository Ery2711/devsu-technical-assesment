Technical assesment - Opción 2 de la sección de API

Este proyecto realiza pruebas automatizadas para API basado en Cypress. El objetivo es validar los endpoints de la API para cumplir con los requisitos solicitados del tech assesment propuesto


Estructura del Código

El archivo de prueba contiene declarado una variable llamada "json_request" que contiene una esctructura de valores similar a la requerida en la API de Swagger. Los tests creados son los siguientes:

1. Agregar una nueva mascota: Se ejecuta usando el comando "cy.request()" con el método POST apuntando al endpoint "/pet" y enviando el json_request para crear un nuevo registro de mascota. El resultado esperado es un response code 200 para asegurar que el post se realizó correctamente
2. Consultar mascota por ID: Se solicita con el comando "cy.request()" y el método GET los datos de la mascota creada previamente a través del ID enviado en la variable json_request
3. Actualizar nombre y status de una mascota existente: Se crea una copia de json_request para modificar name y status y se almacena en una nueva variable llamada json_updated. Se actualiza con el comando "cy.request()" y el método PUT enviando json_updated. Luego, se valida que el nombre y status de json_request no sea igual a los valores de json_updated
4. Consultar mascota por status: Se solicita con el comando "cy.request()" y el método GET los datos de todas las mascotas registradas y que contengan el status indicado. Se realiza el recorrido de todo el array obtenido y se verifica que para cada mascota creada, todas tengan el status enviado como parámetro. Para este ejemplo, se utilizó el valor "available" que estaba creado en json_request