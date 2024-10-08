const express = require ("express");
const PORT = 3000;
const mongoose = require("mongoose");
const swaggerConfig = require("./swaggerConfig");
const swaggerUI = require("swagger-ui-express");
const { Client } = require ("pg")
require("dotenv").config();
const app = express();
app.use(express.json());


// Connect MongoDB

const url_mongodb = process.env.DATA_URL_MONGO;
mongoose.connect(url_mongodb);

const db = mongoose.connection;

db.on("error", (error) => {
    console.log("Error connecting with Mongo")
});

db.on("connected", () => {
    console.log("Success connect")
});

db.on("disconnected", () => {
    console.log("Mongo is disconnected")
});

app.use("/login", loginRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})

//Connect PostgresSql

const client = new Client({
  host: process.env.POSTGRES_HOST,     
  port: process.env.POSTGRES_URL,      
  user: process.env.POSTGRES_USER,      
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE, 
});

client.connect()
  .then(() => console.log('Conectado a la base de datos!'))
  .catch(err => console.error('Error de conexión', err.stack));


module.exports = app;
