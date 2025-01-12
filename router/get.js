const express = require('express')
const router = express.Router();

router.use("/getstarted",express.static("./public/started"))
router.use("/contacts",express.static("./public/contacts"))
router.use("/login",express.static("./public/login"))

module.exports = router;