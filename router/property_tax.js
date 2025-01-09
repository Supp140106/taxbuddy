const express = require("express");
const router = express.Router();

router.post("/house/buying", (req, res) => {
    // Destructure inputs from req.body
    const { propertycost, type, underconstruction } = req.body;

    // Validate inputs
    if (
        typeof propertycost !== "number" ||
        propertycost <= 0 ||
        !["residential", "affordable", "commercial"].includes(type) ||
        typeof underconstruction !== "boolean"
    ) {
        return res.status(400).json({
            error: "Invalid input. Please provide valid propertycost, type, and underconstruction values.",
        });
    }

    // Calculations
    let stampduty = propertycost * 0.055; // Stamp duty at 5.5%
    let registration = propertycost * 0.01; // Registration at 1%
    let GST = 0;

    if (underconstruction) {
        if (type === "residential") GST = propertycost * 0.05;
        if (type === "affordable") GST = propertycost * 0.01;
        if (type === "commercial") GST = propertycost * 0.12;
    }

    let TDS = 0;
    if (propertycost > 5000000) {
        TDS = propertycost * 0.01; // TDS at 1%
    }

    let tds_st = "";
    if(TDS){
        tds_st = "You can claim the TDS in the Income Tax."
    }
    // Total payable
    let payable = stampduty + registration + GST + TDS;

    // Statement
    let statement = `Upon purchasing the property, you will be responsible for paying the amount of ₹${stampduty.toFixed(
        2
    )} for the stamp duty, GST value of ₹${GST.toFixed(
        2
    )}, TDS amount of ₹${TDS.toFixed(
        2
    )}, and an amount of ₹${registration.toFixed(
        2
    )} for the legal transfer of ownership. For you, the total taxes levied on buying the property would be ₹${payable.toFixed(
        2
    )}. ${tds_st} `;

    // Response
    res.status(200).json({
        statement: statement,
        stampduty: stampduty.toFixed(2),
        registration: registration.toFixed(2),
        GST: GST.toFixed(2),
        TDS: TDS.toFixed(2),
        totalPayable: payable.toFixed(2),
    });
});


router.post("/house/selling",(req,res)=>{
    
})

module.exports = router;
