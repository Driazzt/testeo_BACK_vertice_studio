const express = require("express");
const mongoose = require("mongoose");
const swaggerConfig = require("./swaggerConfig");
const swaggerUI = require("swagger-ui-express");
const loginRouter = require("./Routes/loginRouter");
const userRouter = require("./Routes/userRouter");
const coursesRouter = require("./Routes/coursesRouter");
require("dotenv").config();
const PORT1 = process.env.POSTGRES_PORT || 5432;
const PORT2 = process.env.PORTMONGO || 8000;
const appPostgres = express();
const appMongo = express();
const { Pool } = require("pg");


const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
};
  appPostgres.use(express.json());
  appMongo.use(express.json());

  appPostgres.use(cors(corsOptions));
  appMongo.use(cors(corsOptions));


// Connect to PostgreSQL

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    url: process.env.POSTGRES_URL_NO_SSL,
    ssl: { rejectUnauthorized: false },
});
console.log("POSTGRES_URL:", process.env.POSTGRES_URL);
console.log("POSTGRES_USER:", process.env.POSTGRES_USER);
console.log("POSTGRES_PASSWORD:", process.env.POSTGRES_PASSWORD);

pool.connect()
    .then(() => console.log('Successfully connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL', err.stack));


// Connect to MongoDB

const url_mongodb = process.env.DATA_URL_MONGO;
mongoose.connect(url_mongodb);

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("Error en la conexión con Mongo");
});

db.on("connected", () => {
  console.log("Success connect");
});

db.on("disconnected", () => {
  console.log("Mongo is disconnected");
});

// Rutas:

appPostgres.use("/login", loginRouter);
appPostgres.use("/user", userRouter);
appMongo.use("/courses", coursesRouter);
appMongo.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerConfig));


// Puertos:

appPostgres.listen(PORT1, () => {
    console.log(`Server running at http://localhost:${PORT1}`);
});


appMongo.listen(PORT2, () => {
    console.log(`Server is running at http://localhost:${PORT2}`);
  });

module.exports = {appPostgres, appMongo, pool};