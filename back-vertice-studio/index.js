const express = require ("express");
const PORT = 3000;
const mongoose = require("mongoose");
const swaggerConfig = require("./swaggerConfig");
const swaggerUI = require("swagger-ui-express");

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

module.exports = app;
