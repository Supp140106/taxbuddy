const express = require('express');
const PORT = 8040;
const app = express();

//middleware
app.use(express.urlencoded({extended : false}));
app.use(express.json());


app.listen(PORT,()=>{
    console.log(`The Server is Running in http://localhost:${PORT}/`)
})
