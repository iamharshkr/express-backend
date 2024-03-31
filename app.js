const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
// Swagger Docs
const swaggerJsdoc = require("swagger-jsdoc");
// Swagger UI
const swaggerUi = require("swagger-ui-express");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

// Swagger Options
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Assessment Backend API",
      version: "0.1.0",
      description: "Backend Developer Assessment API Documentation",
    },
    servers: [
      {
        url: "https://demo.quantafile.com/",
      },
      {
        url: "http://localhost:4000/",
      },
    ],
  },
  apis: ["./controllers/*.js"],
};
const specs = swaggerJsdoc(options);
// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Route Imports
const user = require("./routes/userRoute");
const data = require("./routes/dataRoute");
const web3 = require("./routes/web3Route");

app.use("/api/v1", user);
app.use("/api/v1", data);
app.use("/api/v1", web3);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
