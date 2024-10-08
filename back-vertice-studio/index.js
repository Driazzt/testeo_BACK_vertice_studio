const express = require("express");
const PORT = process.env.POSTGRES_PORT || 5432; // 5432 puerto postgres // 3000 recommended for MONGODB
const mongoose = require("mongoose");
// const swaggerConfig = require("./swaggerConfig");
// const swaggerUI = require("swagger-ui-express");
const { Client } = require("pg");
const loginRouter = require("./Routes/loginRouter");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
// const url_mongodb = process.env.DATA_URL_MONGO;
// mongoose.connect(url_mongodb);

// const db = mongoose.connection;

// db.on("error", (error) => {
//     console.log("Error connecting with Mongo:", error);
// });
 
// db.on("connected", () => {
//     console.log("Successfully connected to MongoDB");
// });

// db.on("disconnected", () => {
//     console.log("MongoDB is disconnected");
// });

// Connect to PostgreSQL
const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: { rejectUnauthorized: false },
});

client.connect()
    .then(() => console.log('Successfully connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL', err.stack));


app.use("/login", loginRouter);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;