const swaggerJSDoc = require("swagger-jsdoc");

const swaggerConfigMongo = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Vertice Studio - MongoDB - PostgreSQL",
      version: "1.0.0",
      description: "API para gestionar usuarios, cursos y autenticaciones en PostgreSQL y MongoDB",
    },
    server: {
      url: "http://localhost:8000",
      description: "Local Server MongoDB",
    },
  },
  apis: ["./Routes/*.js"],
};

const swaggerConfigPostgreSQL = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Vertice Studio - MongoDB - PostgreSQL",
      version: "1.0.0",
      description: "API para gestionar usuarios, cursos y autenticaciones en PostgreSQL y MongoDB",
    },
    server: {
      url: "http://localhost:5432",
      description: "Local Server PostgreSQL"
    }
  },
  apis: ["./Routes/*.js"],
};

const swaggerSpecMongo = swaggerJSDoc(swaggerConfigMongo);
const swaggerSpecPostgreSQL = swaggerJSDoc(swaggerConfigPostgreSQL);

module.exports = { swaggerSpecMongo, swaggerSpecPostgreSQL };