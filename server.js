const express = require('express');
const get = require('./router/get')
const PORT = 8040;
const app = express();

//middleware
app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.use("/",get);


app.get("/",(req,res)=>{
    res.send("Home Pages");
})
app.listen(PORT,()=>{
    console.log(`The Server is Running in http://localhost:${PORT}/`)
})
