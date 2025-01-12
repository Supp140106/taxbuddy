require("dotenv").config(); // using .env file
const express = require("express");
const mongoose = require("mongoose");
const get = require("./router/get");
const post = require("./router/post");
const form = require("./router/form")
const authorization = require("./router/authorization");
const property = require('./router/property_tax')
const PORT = process.env.PORT|| 3000;
const app = express();

// mongoconnect(process.env.MONGOID) // MAKING CONECTION WITH THE DATA BASE

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route Definitions
app.use("/submit", post);
 // This will handle all routes

app.use("/auth", authorization); // This is for Sign up and Sign in
app.use("/property",property);
app.use("/form",form);

app.use("/",express.static("./public/home"))
app.use("/",get);

//connection mongo db
mongoose
  .connect(process.env.MONGOID)
  .then(() => console.log("Mongo db conected"))
  .catch((err) => console.log(` error : ${err}`));

app.listen(PORT, () => {
  console.log(`The Server is Running in http://localhost:${PORT}/`);
});
