const express = require("express");
const router = express.Router();


router.use("/income",express.static("./public/income"));


module.exports = router;