const express = require('express');
const get = require('./router/get');
const post = require('./router/post')
const PORT = 3000;
const app = express();

// Middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route Definitions
app.use("/submit", post);
app.use("/", get); // This will handle all routes 


app.get("/", (req, res) => {
    res.send("Home Page");
});

app.listen(PORT, () => {
    console.log(`The Server is Running in http://localhost:${PORT}/`);
});