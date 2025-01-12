const express = require('express')
const router = express.Router();

router.use("/getstarted",express.static("./public/started"))
router.use("/contacts",express.static("./public/contacts"))
router.use("/login",express.static("./public/login"))
router.use("/signup",express.static("./public/signup"))
router.use("/404",express.static("./public/404"))


module.exports = router;