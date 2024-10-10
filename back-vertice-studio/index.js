const express = require("express");
const PORT1 = process.env.POSTGRES_PORT || 5432; // 5432 puerto postgres // 3000 recommended for MONGODB
const PORT2 = process.env.PORTMONGO || 8000
const mongoose = require("mongoose");
const loginRouter = require("./Routes/loginRouter");
require("dotenv").config();
const app = express();
app.use(express.json());
const { Pool } = require("pg");


const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));
  app.use(express.json());


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


app.use("/login", loginRouter);

app.listen(PORT1, () => {
    console.log(`Server running at http://localhost:${PORT1}`);
});


app.listen(PORT2, () => {
    console.log(`Server is running at http://localhost:${PORT2}`);
  });

module.exports = {app, pool};