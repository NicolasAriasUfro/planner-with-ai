# Actividad: Generación de pruebas de humo

A continuación se detallan las instrucciones como realizar la ejecución de las pruebas de humo en Cypress:

1. **Clonar el repositorio**

    - Se debe clonar el repositorio de Github en vs code o en un IDE compatible con las librerías usadas

2. **Ejecutar npm install**

    - Después de clonar el repositorio se debe ejecutar el comando npm install para instalar todas las dependencias y librerías usadas para ejecutar las pruebas.

3.  Conseguir el Token

    **Requisitos:**

    - cuenta de google
    - acceso al LLM de gemini

    Visitar: https://aistudio.google.com/api-keys

    - crear clave de API
    - crea un proyecto si es necesario
    - click en el botón "Copy API key"

Crear un archivo llamado ".env" con el siguiente contenido:

```
API_KEY_GEMINI = Token de gemini
```

4. Hacer correr el servidor con la API

    - Ejecutar el comando npm run dev para que corra la API creada para la generación de un plan de estudios

5. Ejecutar las pruebas de humo

    Ejecutar el comando:

    ```bash
    npm run smoke
    ```

    Este comando ejecutara las pruebas de humo mediante Cypress.

### Documentación de la API

entrar a http://localhost:3000/docs para visualizar de manera visual la documentación de la API.

![alt text](Screenshot_20251103_224208.png)
