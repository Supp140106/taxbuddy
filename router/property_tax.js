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


function calculateCII(purchase, sale, improvement, ciisaleYear, ciipurchaseYear) {
    const indexedPurchase = (ciisaleYear / ciipurchaseYear) * purchase;
    const capitalGainsTax = 0.2 * (sale - (indexedPurchase + improvement));
    return capitalGainsTax;
}


router.post("/house/selling", (req, res) => {
    const { purchasePrice, salePrice, improvementCost, purchaseDate } = req.body;

    // Input validation
    if (
        typeof purchasePrice !== "number" ||
        typeof salePrice !== "number" ||
        typeof improvementCost !== "number" ||
        !purchaseDate
    ) {
        return res.status(400).json({
            error: "Invalid input. Ensure purchasePrice, salePrice, improvementCost are numbers and purchaseDate is provided in 'yyyy-MM-dd' format.",
        });
    }

    const currentDate = new Date();
    const purchaseDateObj = new Date(purchaseDate);
    const yearsDifference = currentDate.getFullYear() - purchaseDateObj.getFullYear();

    let tax = 0;
    let taxType = "";

    if (yearsDifference < 2) {
        // Short-term capital gains tax
        tax = 0.3 * (salePrice - (improvementCost + purchasePrice));
        taxType = "Short-Term Capital Gains Tax";
    } else {
        // Long-term capital gains tax with CII
        const ciiValues = {
            2023: { saleYear: 363, purchaseYear: 340 },
            2022: { saleYear: 363, purchaseYear: 324 },
            2021: { saleYear: 363, purchaseYear: 309 },
            2020: { saleYear: 363, purchaseYear: 295 },
            2019: { saleYear: 363, purchaseYear: 285 },
        };

        const purchaseYear = purchaseDateObj.getFullYear();
        if (ciiValues[purchaseYear]) {
            const { saleYear, purchaseYear: ciiPurchaseYear } = ciiValues[purchaseYear];
            tax = calculateCII(purchasePrice, salePrice, improvementCost, saleYear, ciiPurchaseYear);
        } else {
            return res.status(400).json({
                error: "CII values are not available for the provided purchase year.",
            });
        }

        taxType = "Long-Term Capital Gains Tax";
    }

    res.status(200).json({
        taxType: taxType,
        capitalGainsTax: tax.toFixed(2),
        message:
            taxType === "Long-Term Capital Gains Tax"
                ? "By optimizing this data, we calculated your tax with indexation (CII). Without indexation, you would pay an extra tax."
                : "Short-term capital gains tax applied based on the provided details.",
    });
});
module.exports = router;
