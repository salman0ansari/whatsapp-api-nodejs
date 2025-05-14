const swagger = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Free Whatsapp API',
            version: '1.0.0',
            description: 'API documentation',
            contact: {
                name: 'Jeanluca FP',
                url: 'https://github.com/Jean1dev',
                email: 'jeanlucafp@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3333',
                description: 'Local server'
            },
            {
                url: 'https://whatsapp-api-da7eccbe4a89.herokuapp.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: "Enter 'Bearer' [space] and then your token"
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['./src/api/routes/*.js'], // Adjust the path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocs));
};