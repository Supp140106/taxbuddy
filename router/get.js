const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
 // Use an environment variable in production



 const checkCookie = (req, res, next) => {
  // Check if the token exists in cookies
  if (req.cookies.token) {
    // Verify the token using the secret key
    jwt.verify(req.cookies.token, process.env.secretkey, (err, user) => {
      if (err) {
        // If token is invalid, redirect to the login page
        return res.status(403).redirect("/auth");
      }
      // If token is valid, proceed to the next middleware or route
      req.user = user; // Optionally attach the decoded user to the request object
      next();
    });
  } else {
    // If no token is present, redirect to the login page
    return res.status(403).redirect("/auth");
  }
};

router.use("/getstarted",express.static("./public/started"))
router.use("/contacts",express.static("./public/contacts"))
router.use("/login",express.static("./public/login"))
router.use("/signup",express.static("./public/signup"))
router.use("/auth",express.static("./public/auth"))
router.use("/404",express.static("./public/404"))
router.use("/chat",express.static("./public/chat"))
router.use("/sec/changepassword",express.static("./public/changepassword"))
router.use("/test",express.static("./public/test"))
router.use("/account", checkCookie, express.static("./public/account"));




module.exports = router;