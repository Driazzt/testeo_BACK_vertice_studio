const express = require("express");
const PORT = process.env.POSTGRES_PORT || 5432; // 5432 puerto postgres // 3000 recommended for MONGODB
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


app.use("/login", loginRouter);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = {app, pool};