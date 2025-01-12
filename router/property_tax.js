const express = require("express");
const stampdata = require("../json/stampdatabase.json")
const run = require("../gemini");
const router = express.Router();

function getStampDutyPercentages(stateName) {
  // Find the state in the data
  const stateData = stampdata.find(item => item.state === stateName);

  // Check if the state exists
  if (!stateData) {
      return `State "${stateName}" not found in the data.`;
  }

  // Return the percentages
  return stateData.male_stamp_duty_percentage;
      
 
}

router.post("/house/buying", async (req, res) => {
  // Destructure inputs from req.body
  const { propertycost, type, underconstruction, state } = req.body;
  
  // Validate inputs
  if (
    typeof propertycost !== "number" ||
    propertycost <= 0 ||
    !["residential", "affordable", "commercial"].includes(type) ||
    typeof underconstruction !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide valid propertycost, type, and underconstruction values.",
    });
  }




  // Calculations
  let stampduty = propertycost * getStampDutyPercentages(state); // Stamp duty at 5.5%
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
  if (TDS) {
    tds_st = "You can claim the TDS in the Income Tax.";
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

  let prompt = `${statement} make this in 100 words as profetional friendly expert tax advisor`;
  // Response
  let aianswer = await run(prompt);
  
  res.status(200).json({
    aianswer : aianswer.response.text(),
    statement: statement,
    stampduty: stampduty.toFixed(2),
    registration: registration.toFixed(2),
    GST: GST.toFixed(2),
    TDS: TDS.toFixed(2),
    totalPayable: payable.toFixed(2),
  });
});










function calculateCII(
  purchase,
  sale,
  improvement,
  ciisaleYear,
  ciipurchaseYear
) {
  const indexedPurchase = (ciisaleYear / ciipurchaseYear) * purchase;
  const capitalGainsTax = 0.2 * (sale - (indexedPurchase + improvement));
  return capitalGainsTax;
}

router.post("/house/selling", async (req, res) => {
  const { purchasePrice, salePrice, improvementCost, purchaseDate } = req.body;

  // Input validation
  if (
    typeof purchasePrice !== "number" ||
    typeof salePrice !== "number" ||
    typeof improvementCost !== "number" ||
    !purchaseDate
  ) {
    return res.status(400).json({
      error:
        "Invalid input. Ensure purchasePrice, salePrice, improvementCost are numbers and purchaseDate is provided in 'yyyy-MM-dd' format.",
    });
  }

  const currentDate = new Date();
  const purchaseDateObj = new Date(purchaseDate);
  const yearsDifference =
    currentDate.getFullYear() - purchaseDateObj.getFullYear();

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
      const { saleYear, purchaseYear: ciiPurchaseYear } =
        ciiValues[purchaseYear];
      tax = calculateCII(
        purchasePrice,
        salePrice,
        improvementCost,
        saleYear,
        ciiPurchaseYear
      );
    } else {
      return res.status(400).json({
        error: "CII values are not available for the provided purchase year.",
      });
    }

    taxType = "Long-Term Capital Gains Tax";
  }

  let prompt = `Suppose You are a professional Tax Adviser .Analyze the following JavaScript data object and provide professional and easy-to-understand advice for the buyer regarding tax obligations and potential optimizations:

javascript
Copy code
{
    taxType: "${taxType}",
    capitalGainsTax: ${tax.toFixed(2)},
    message: "${taxType === 'Long-Term Capital Gains Tax' 
      ? 'By optimizing this data, we calculated your tax with indexation (CII). Without indexation, you would pay an extra tax.' 
      : 'Short-term capital gains tax applied based on the provided details.'}"
}
Based on this data, explain what the tax type (Long-Term or Short-Term Capital Gains Tax) means for the buyer, how capital gains tax is calculated,
 and how indexation benefits long-term capital gains. Provide actionable advice on tax optimization strategies
  specific to their tax type. For example, suggest investment options, exemptions, or planning techniques that
   can minimize the tax burden within the regulatory framework. Avoid suggesting consultation with a professional; 
   focus on empowering the buyer with practical steps they can implement on their own.Write it in 100 words pointwise.`


  console.log((await run(prompt)).response.text());
  res.status(200).json({
    taxType: taxType,
    capitalGainsTax: tax.toFixed(2),
    message:
      taxType === "Long-Term Capital Gains Tax"
        ? "By optimizing this data, we calculated your tax with indexation (CII). Without indexation, you would pay an extra tax."
        : "Short-term capital gains tax applied based on the provided details.",
  });
});

const stateTaxRates = {
  Karnataka: {
    petrolTaxBelow1000: 13,
    petrolTaxAbove1500: 18,
    dieselTaxAbove1500: 18,
    electricTax: 0,
  },
  Maharashtra: {
    petrolTaxBelow1000: 11,
    petrolTaxAbove1500: 13,
    dieselTaxAbove1500: 13,
    electricTax: 0,
  },
  Delhi: {
    petrolTaxBelow1000: 4,
    petrolTaxAbove1500: 12.5,
    dieselTaxAbove1500: 12.5,
    electricTax: 4,
  },
  TamilNadu: {
    petrolTaxBelow1000: 10,
    petrolTaxAbove1500: 15,
    dieselTaxAbove1500: 15,
    electricTax: 0,
  },
  Kerala: {
    petrolTaxBelow1000: 12,
    petrolTaxAbove1500: 16,
    dieselTaxAbove1500: 16,
    electricTax: 0,
  },
  UttarPradesh: {
    petrolTaxBelow1000: 8,
    petrolTaxAbove1500: 14,
    dieselTaxAbove1500: 14,
    electricTax: 0,
  },
  AndhraPradesh: {
    petrolTaxBelow1000: 10,
    petrolTaxAbove1500: 14,
    dieselTaxAbove1500: 14,
    electricTax: 0,
  },
  Gujarat: {
    petrolTaxBelow1000: 9,
    petrolTaxAbove1500: 12,
    dieselTaxAbove1500: 12,
    electricTax: 0,
  },
  WestBengal: {
    petrolTaxBelow1000: 7,
    petrolTaxAbove1500: 12,
    dieselTaxAbove1500: 12,
    electricTax: 2,
  },
  Rajasthan: {
    petrolTaxBelow1000: 5,
    petrolTaxAbove1500: 10,
    dieselTaxAbove1500: 10,
    electricTax: 0,
  },
  MadhyaPradesh: {
    petrolTaxBelow1000: 8,
    petrolTaxAbove1500: 13,
    dieselTaxAbove1500: 13,
    electricTax: 0,
  },
  Bihar: {
    petrolTaxBelow1000: 6,
    petrolTaxAbove1500: 11,
    dieselTaxAbove1500: 11,
    electricTax: 0,
  },
  Haryana: {
    petrolTaxBelow1000: 9,
    petrolTaxAbove1500: 14,
    dieselTaxAbove1500: 14,
    electricTax: 0,
  },
  Punjab: {
    petrolTaxBelow1000: 10,
    petrolTaxAbove1500: 15,
    dieselTaxAbove1500: 15,
    electricTax: 0,
  },
  Odisha: {
    petrolTaxBelow1000: 8,
    petrolTaxAbove1500: 12,
    dieselTaxAbove1500: 12,
    electricTax: 0,
  },
  Chhattisgarh: {
    petrolTaxBelow1000: 7,
    petrolTaxAbove1500: 11,
    dieselTaxAbove1500: 11,
    electricTax: 0,
  },
  Uttarakhand: {
    petrolTaxBelow1000: 6,
    petrolTaxAbove1500: 10,
    dieselTaxAbove1500: 10,
    electricTax: 0,
  },
  Assam: {
    petrolTaxBelow1000: 5,
    petrolTaxAbove1500: 9,
    dieselTaxAbove1500: 9,
    electricTax: 0,
  },
  Goa: {
    petrolTaxBelow1000: 6,
    petrolTaxAbove1500: 10,
    dieselTaxAbove1500: 10,
    electricTax: 0,
  },
  JammuAndKashmir: {
    petrolTaxBelow1000: 4,
    petrolTaxAbove1500: 8,
    dieselTaxAbove1500: 8,
    electricTax: 0,
  },
  HimachalPradesh: {
    petrolTaxBelow1000: 6,
    petrolTaxAbove1500: 11,
    dieselTaxAbove1500: 11,
    electricTax: 0,
  },
  Tripura: {
    petrolTaxBelow1000: 5,
    petrolTaxAbove1500: 10,
    dieselTaxAbove1500: 10,
    electricTax: 0,
  },
  Nagaland: {
    petrolTaxBelow1000: 7,
    petrolTaxAbove1500: 13,
    dieselTaxAbove1500: 13,
    electricTax: 0,
  },
};

// Calculate road tax
const calculateRoadTax = (exShowroomPrice, rates, fuelType, engineCapacity) => {
  if (fuelType === "Electric") {
    return exShowroomPrice * (rates.electricTax / 100);
  } else if (fuelType === "Petrol") {
    if (engineCapacity <= 1000)
      return exShowroomPrice * (rates.petrolTaxBelow1000 / 100);
    if (engineCapacity > 1500)
      return exShowroomPrice * (rates.petrolTaxAbove1500 / 100);
  } else if (fuelType === "Diesel") {
    if (engineCapacity > 1500)
      return exShowroomPrice * (rates.dieselTaxAbove1500 / 100);
  }
  return 0;
};

// Calculate TCS
const calculateTCS = (exShowroomPrice) => {
  const tcsThreshold = 1000000; // ₹10 lakh
  const tcsRate = 1; // 1% TCS
  return exShowroomPrice > tcsThreshold ? exShowroomPrice * (tcsRate / 100) : 0;
};

// Calculate insurance
const calculateInsurance = (exShowroomPrice) => {
  const insuranceRate = 4; // 4% of ex-showroom price
  return exShowroomPrice * (insuranceRate / 100);
};

// API Endpoint
router.post("/car/selling", (req, res) => {
  const { state, exShowroomPrice, fuelType, engineCapacity } = req.body;

  // Validate input
  if (!stateTaxRates[state]) {
    return res.status(400).json({ error: "Invalid state provided" });
  }

  // Retrieve state-specific tax rates
  const rates = stateTaxRates[state];

  // Calculate components
  const roadTax = calculateRoadTax(
    exShowroomPrice,
    rates,
    fuelType,
    engineCapacity
  );
  const tcs = calculateTCS(exShowroomPrice);
  const insurance = calculateInsurance(exShowroomPrice);
  const registrationFee = 1000; // Fixed cost
  const fastagFee = 500; // Fixed cost
  const totalCost =
    exShowroomPrice + roadTax + tcs + insurance + registrationFee + fastagFee;

  // Response object
  const response = {
    state,
    exShowroomPrice,
    fuelType,
    engineCapacity,
    breakdown: {
      roadTax,
      registrationFee,
      insurance,
      fastagFee,
      tcs,
    },
    totalOnRoadPrice: totalCost,
  };

  res.json(response);
});

module.exports = router;
