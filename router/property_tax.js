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

function getStampdutysaving(stateName) {
  const stateData = stampdata.find(item => item.state === stateName);

  // Check if the state exists
  if (!stateData) {
      return `State "${stateName}" not found in the data.`;
  }

  // Return the percentages
  return (stateData.male_stamp_duty_percentage-stateData.female_stamp_duty_percentage)/100;
}

router.post("/house/buying", async (req, res) => {
  // Destructure inputs from req.body
  const { propertycost, type, underconstruction, state } = req.body;
  
  // Validate inputs
  if (
    typeof propertycost !== "number" ||
    propertycost <= 0 ||
    !["residential", "affordable", "commercial","land"].includes(type) ||
    typeof underconstruction !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide valid propertycost, type, and underconstruction values.",
    });
  }




  // Calculations
  let stampduty = propertycost * (getStampDutyPercentages(state)/100); // Stamp duty at 5.5%
  let registration = propertycost * 0.01; // Registration at 1%
  let GST = 0;

  if (underconstruction) {
    if (type === "residential") GST = propertycost * 0.05;
    if (type === "affordable") GST = propertycost * 0.01;
    if (type === "commercial") GST = propertycost * 0.12;
    if (type ==="land") GST = 0;
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
  )}.
   ${tds_st} `;


  let st = `If You register the propert in name of a Woman You have to give 1% less stampduty than the previous saving upto Rs ${(stampduty*getStampdutysaving(state)).toFixed(2)}`
  let prompt = `${st} make this in 50 words as profetional friendly expert tax advisor`;
  // Response
  let aianswer = await run(prompt);
  
  res.status(200).json({
    statement: statement,
    stampduty: stampduty.toFixed(2),
    registration: registration.toFixed(2),
    GST: GST.toFixed(2),
    TDS: TDS.toFixed(2),
    totalPayable: payable.toFixed(2),
    optimisation :  aianswer.response.text()
  });
});





// Helper function to calculate CII-based capital gains tax
const calculateCii = (purchasePrice, salePrice, improvementCost, ciiSaleYear, ciiPurchaseYear) => {
  const indexed = (ciiSaleYear / ciiPurchaseYear) * purchasePrice;
  const capitalGainsTax = 0.2 * (salePrice - (indexed + improvementCost));
  return capitalGainsTax;
};

// Endpoint to calculate tax
router.post('/house/selling', (req, res) => {
  const { purchaseDate, purchasePrice, salePrice, improvementCost } = req.body;

  if (!purchaseDate || !purchasePrice || !salePrice || !improvementCost) {
      return res.status(400).json({ error: 'Please provide purchaseDate, purchasePrice, salePrice, and improvementCost.' });
  }

  const currentDate = new Date();
  const purchaseDateObj = new Date(purchaseDate);

  if (isNaN(purchaseDateObj)) {
      return res.status(400).json({ error: 'Invalid purchase date format. Use YYYY-MM-DD.' });
  }

  const purchaseYear = purchaseDateObj.getFullYear();

  // Calculate the difference in years between the current date and purchase date
  const yearsDifference = currentDate.getFullYear() - purchaseDateObj.getFullYear();

  // Calculate the date two years ahead of the purchase date
  const twoYearsAhead = new Date(purchaseDateObj);
  twoYearsAhead.setFullYear(purchaseDateObj.getFullYear() + 2);

  const remainingDays = Math.ceil((twoYearsAhead - currentDate) / (1000 * 60 * 60 * 24));

  // Determine the type of capital gains tax
  if (yearsDifference <= 2) {
      const shortTermSavings = 0.1 * (salePrice - (improvementCost + purchasePrice));
      const shortCapitalGainsTax = 0.3 * (salePrice - (improvementCost + purchasePrice));
      return res.json({
          message: `If you sell the property on ${twoYearsAhead.toISOString().split('T')[0]}, you will save an amount of $${shortTermSavings.toFixed(2)} (10% of the purchase price).`,
          shortCapitalGainsTax: shortCapitalGainsTax.toFixed(2),
      });
  } else {
      let ciiPurchaseYear;
      const ciiSaleYear = 363; // Fixed CII value for sale year

      // Determine CII purchase year based on the purchase year
      switch (purchaseYear) {
        case 2023:
            ciiPurchaseYear = 340;
            break;
        case 2022:
            ciiPurchaseYear = 324;
            break;
        case 2021:
            ciiPurchaseYear = 309;
            break;
        case 2020:
            ciiPurchaseYear = 295;
            break;
        case 2019:
            ciiPurchaseYear = 289;
            break;
        case 2018:
            ciiPurchaseYear = 280;
            break;
        case 2017:
            ciiPurchaseYear = 272;
            break;
        case 2016:
            ciiPurchaseYear = 264;
            break;
        case 2015:
            ciiPurchaseYear = 254;
            break;
        case 2014:
            ciiPurchaseYear = 240;
            break;
        case 2013:
            ciiPurchaseYear = 220;
            break;
        case 2012:
            ciiPurchaseYear = 200;
            break;
        case 2011:
            ciiPurchaseYear = 184;
            break;
        case 2010:
            ciiPurchaseYear = 167;
            break;
          default:
              return res.status(400).json({ error: 'CII data is not available for the given purchase year.' }); // Default value for years outside the range
    }
    
          
      

      const longCapitalGainsTax = calculateCii(purchasePrice, salePrice, improvementCost, ciiSaleYear, ciiPurchaseYear);
      return res.json({
          message: 'Long-term capital gains tax has been calculated using indexation (CII values).',
          longCapitalGainsTax: longCapitalGainsTax.toFixed(2),
      });
  }
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
