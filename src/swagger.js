// swagger.js
// import swaggerJSDoc from "swagger-jsdoc";
const swaggerJSDoc=require('swagger-jsdoc')


const options = {
  definition: {
    openapi: "3.0.0", // Version of OpenAPI
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API documentation generated with Swagger UI",
    },
    servers: [
      {
        url: "http://localhost:5000/", 
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
