const express = require("express");
require('dotenv').config();
const user = require("../database/usermodel"); // Make sure this is the correct import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { fullname, email, phonenumber, password } = req.body;

    // Ensure all fields are provided
    if (!fullname || !email || !phonenumber || !password) {
        return res.status(422).json({ message: "Please enter all the values" });
    }

    try {
        // Check if email or phone number already exists
        const existingUser = await user.findOne({ 
            $or: [{ email: email }, { mobile: phonenumber }]
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Credentials already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await user.create({
            name: fullname,
            email: email,
            mobile: phonenumber,
            password: hashedPassword
        });

        let token = jwt.sign({
            name : fullname,
            email : email,
            mobile : phonenumber,
            role : "user"
        },process.env.secretkey,{expiresIn : '2h'});

        return res.status(201).header("token",token).json({ msg: "Signup successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});



router.put("/login", async (req, res) => {
    try {
        const { emailormobile, password } = req.body;

        if (!emailormobile || !password) {
            return res.status(400).json({ msg: "Email/Mobile and Password are required" });
        }

        let query;
        
        if (emailormobile.indexOf('@') === -1) {
            query = { mobile: emailormobile };
        } else {
            query = { email: emailormobile };
        }

        const checkuser = await user.findOne(query);

        if (!checkuser) {
            return res.status(404).json({ msg: "User does not exist in Database" });
        }

        const isPasswordValid = await bcrypt.compare(password, checkuser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        let token = jwt.sign({
            name : checkuser.name,
            email : checkuser.email,
            mobile : checkuser.mobile,
            role : "user"
        },process.env.secretkey,{expiresIn : '2h'});
        
        // Respond with user data if authentication succeeds
        res.header("token",token).json({
            name : checkuser.name,
            email : checkuser.email,
            mobile : checkuser.mobile
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;



module.exports = router;
