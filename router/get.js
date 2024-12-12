const express = require('express')
const router = express.Router();

router.get("/about",(req,res)=>{
    res.end("About");//Waiting for frontend
})

module.exports = router;