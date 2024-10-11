const swaggerJSDoc = require("swagger-jsdoc");

const swaggerConfig = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Vertice Studio",
      version: "1.0.0",
      description: "Update Vertice Studio App",
    },
    server: {
      url: "http://localhost:8000",
      description: "Local Server MongoDB",
    },
  },
  apis: ["./Routes/*.js"],
};

const swagger = swaggerJSDoc(swaggerConfig);

module.exports = swagger;