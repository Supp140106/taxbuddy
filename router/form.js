const express = require("express");
const router = express.Router();


router.use("/income",express.static("./public/income"));

router.use("/property",express.static("./public/property"))


module.exports = router;