const express = require('express');
const PORT = 8040;
const app = express();

app.listen(PORT,()=>{
    console.log(`The Server is Running in http://localhost:${PORT}/`)
})
