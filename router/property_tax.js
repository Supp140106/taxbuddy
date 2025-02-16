const express = require("express");
const stampdata = require("../json/stampdatabase.json");
const run = require("../gemini");
const router = express.Router();

const roadTaxData = {
  "Andhra Pradesh": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 10.0 : 15.0 },
  "Arunachal Pradesh": { "otherThanTwoWheeler": 10.0 },
  "Assam": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 8.0 : 12.0 },
  "Bihar": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 10.0 : 12.0 },
  "Delhi": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 12.0 : 15.0 },
  "Goa": { "otherThanTwoWheeler": 10.0 },
  "Gujarat": { "otherThanTwoWheeler": (vehicleType) => vehicleType === "Luxury" ? 15.0 : 10.0 },
  "Haryana": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 600000 ? 8.0 : exShowroomPrice <= 1000000 ? 10.0 : 12.0 },
  "Himachal Pradesh": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 12.0 },
  "Jammu & Kashmir": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 10.0 },
  "Jharkhand": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 8.0 : 12.0 },
  "Karnataka": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 500000 ? 13.0 : exShowroomPrice <= 1000000 ? 14.0 : 18.0 },
  "Kerala": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 500000 ? 9.0 : 12.0 },
  "Madhya Pradesh": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 10.0 },
  "Maharashtra": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 10.0 : 15.0 },
  "Manipur": { "otherThanTwoWheeler": 10.0 },
  "Meghalaya": { "otherThanTwoWheeler": 10.0 },
  "Nagaland": { "otherThanTwoWheeler": 10.0 },
  "Tripura": { "otherThanTwoWheeler": 10.0 },
  "Mizoram": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 10.0 },
  "Odisha": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 12.0 },
  "Punjab": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 600000 ? 8.0 : exShowroomPrice <= 1000000 ? 10.0 : 12.0 },
  "Rajasthan": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 12.0 },
  "Sikkim": { "otherThanTwoWheeler": 8.0 },
  "Tamil Nadu": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 10.0 : 12.0 },
  "Telangana": { "otherThanTwoWheeler": 10.0 },
  "Uttar Pradesh": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 10.0 : 12.0 },
  "Uttarakhand": { "otherThanTwoWheeler": (engineCapacity) => engineCapacity <= 1500 ? 8.0 : 10.0 },
  "West Bengal": { "otherThanTwoWheeler": (exShowroomPrice) => exShowroomPrice <= 1000000 ? 10.0 : 12.0 },
  "Default": { "otherThanTwoWheeler": 10.0 }
};



function getStampDutyPercentages(stateName) {
  // Find the state in the data
  const stateData = stampdata.find((item) => item.state === stateName);

  // Check if the state exists
  if (!stateData) {
    return `State "${stateName}" not found in the data.`;
  }

  // Return the percentages
  return stateData.male_stamp_duty_percentage;
}

function getStampdutysaving(stateName) {
  const stateData = stampdata.find((item) => item.state === stateName);

  // Check if the state exists
  if (!stateData) {
    return `State "${stateName}" not found in the data.`;
  }

  // Return the percentages
  return (
    (stateData.male_stamp_duty_percentage -
      stateData.female_stamp_duty_percentage) /
    100
  );
}

router.post("/house/buying", async (req, res) => {
  // Destructure inputs from req.body
  const { propertycost, type, underconstruction, state } = req.body;

  // Validate inputs
  if (
    typeof propertycost !== "number" ||
    propertycost <= 0 ||
    !["residential", "affordable", "commercial", "land"].includes(type) ||
    typeof underconstruction !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide valid propertycost, type, and underconstruction values.",
    });
  }

  // Calculations
  let stampduty = propertycost * (getStampDutyPercentages(state) / 100); // Stamp duty at 5.5%
  let registration = propertycost * 0.01; // Registration at 1%
  let GST = 0;
  let add = ""
  if (underconstruction) {
    if (type === "residential") GST = propertycost * 0.05;
    if (type === "affordable") GST = propertycost * 0.01;
    if (type === "commercial") GST = propertycost * 0.12;
    if (type === "land") GST = 0;
    add = `We noticed that you are buying a under-construction property. We would recommend you to not buy a under-construction property, doing so you can save upto Rs ${propertycost*0.055} (5-6% GST) on the property value.\n`
    
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

  let st = `If You register the propert in name of a Woman You have to give 1% less stampduty than the previous saving upto Rs ${(
    propertycost*0.01
  ).toFixed(2)}`;
  let prompt = `${st} make this in 100 words as profetional friendly expert tax advisor`;
  // Response
  let aianswer = await run(prompt);

  res.status(200).json({
    statement: statement,
    stampduty: stampduty.toFixed(2),
    registration: registration.toFixed(2),
    GST: GST.toFixed(2),
    TDS: TDS.toFixed(2),
    totalPayable: payable.toFixed(2),
    optimisation: `${add} ${aianswer.response.text()}`,
  });
});

// Helper function to calculate CII-based capital gains tax
const calculateCii = (
  purchasePrice,
  salePrice,
  improvementCost,
  ciiSaleYear,
  ciiPurchaseYear
) => {
  const indexed = (ciiSaleYear / ciiPurchaseYear) * purchasePrice;
  const capitalGainsTax = 0.2 * (salePrice - (indexed + improvementCost));
  return capitalGainsTax;
};

// Endpoint to calculate tax
router.post("/house/selling", (req, res) => {
  let { purchaseDate, purchasePrice, salePrice, improvementCost } = req.body;
  
  if (!purchaseDate || !purchasePrice || !salePrice || !improvementCost) {
    return res
      .status(400)
      .json({
        error:
          "Please provide purchaseDate, purchasePrice, salePrice, and improvementCost.",
      });
  }

  purchasePrice = parseFloat(purchasePrice);
  salePrice = parseFloat(salePrice);
  improvementCost = parseFloat(improvementCost);
  

  const currentDate = new Date();
  const purchaseDateObj = new Date(purchaseDate);

  if (isNaN(purchaseDateObj)) {
    return res
      .status(400)
      .json({ error: "Invalid purchase date format. Use YYYY-MM-DD." });
  }

  const purchaseYear = purchaseDateObj.getFullYear();

  // Calculate the difference in years between the current date and purchase date
  const yearsDifference =
    currentDate.getFullYear() - purchaseDateObj.getFullYear();

  // Calculate the date two years ahead of the purchase date
  const twoYearsAhead = new Date(purchaseDateObj);
  twoYearsAhead.setFullYear(purchaseDateObj.getFullYear() + 2);

  const remainingDays = Math.ceil(
    (twoYearsAhead - currentDate) / (1000 * 60 * 60 * 24)
  );
  let totalprice = improvementCost + purchasePrice;
  // Determine the type of capital gains tax

  
  if (yearsDifference <= 2) {
    let shortTermSavings = 0;
    let shortCapitalGainsTax;
    if (salePrice <= totalprice) {
      shortCapitalGainsTax = 0;
      return res.json({
        Tax: shortCapitalGainsTax,
        message: `Since there is no profit from the property you sold,
         you are not required to pay any capital gains tax.`,
      });
    } else if (salePrice > totalprice) {
      shortTermSavings = 0.1 * (salePrice - totalprice);
      shortCapitalGainsTax = 0.3 * (salePrice - totalprice);
    }
    return res.json({
      Tax: shortCapitalGainsTax,
      message: `If you sell the property on ${
        twoYearsAhead.toISOString().split("T")[0]
      }, you will save an amount of Rs.${shortTermSavings} (10% of the purchase price).`,
    });
  } else if (yearsDifference > 2) {

    if(totalprice>=salePrice){
      return res.json({
        Tax : 0,
        message: "Since there is no profit from the property you sold, you are not required to pay any capital gains tax."
      })
    }
    let ciiPurchaseYear;
      const ciiSaleYear = 363; // Fixed CII value for sale year
    if (totalprice < salePrice) {
      

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
          ciiPurchaseYear = 285;
          break;
        case 2018:
          ciiPurchaseYear = 276;
          break;
        case 2017:
          ciiPurchaseYear = 268;
          break;
        case 2016:
          ciiPurchaseYear = 259;
          break;
        case 2015:
          ciiPurchaseYear = 247;
          break;
        case 2014:
          ciiPurchaseYear = 230;
          break;
        case 2013:
          ciiPurchaseYear = 210;
          break;
        case 2012:
          ciiPurchaseYear = 192;
          break;
        case 2011:
          ciiPurchaseYear = 176;
          break;
        case 2010:
          ciiPurchaseYear = 158;
          break;
        case 2009:
          ciiPurchaseYear = 143;
          break;
        case 2008:
          ciiPurchaseYear = 133;
          break;
        case 2007:
          ciiPurchaseYear = 126;
          break;
        case 2006:
          ciiPurchaseYear = 120;
          break;
        case 2005:
          ciiPurchaseYear = 115;
          break;
        case 2004:
          ciiPurchaseYear = 111;
          break;
        case 2003:
          ciiPurchaseYear = 107;
          break;
        case 2002:
          ciiPurchaseYear = 103;
          break;
        case 2001:
          ciiPurchaseYear = 103;
          break;
        case 2000:
          ciiPurchaseYear = 103;
          break;
        default:
          return res
            .status(400)
            .json({
              error: "CII data is not available for the given purchase year.",
            }); // Default value for years outside the range
      }
    }
    let longCapitalGainsTax = calculateCii(
      purchasePrice,
      salePrice,
      improvementCost,
      ciiSaleYear,
      ciiPurchaseYear
    );
    if (totalprice > salePrice) {
      return res.json({
        Tax: 0,
        message: `Since there is no profit from the property you sold,
         you are not required to pay any capital gains tax.`,
      });
    }
    return res.json({
      message:
        "We have optimized your tax by using the CII values, which adjust the purchase price for inflation based on the current date. This reduces your Capital Gains Tax, and consequently, your overall tax liability.",
      Tax: longCapitalGainsTax.toFixed(2),
    });
  }
});




function validatePositiveInput(value, fieldName) {
  if (typeof value !== 'number' || value < 0) {
      throw new Error(`${fieldName} must be a positive number.`);
  }
  return value;
}

// Function to calculate road tax
function calculateRoadTax(state, exShowroomPrice, engineCapacity, vehicleCategory, vehicleType, isSecondHand, vehicleAge) {
  let roadTaxPercentage = 10.0; // Default tax rate

  if (isSecondHand) {
      roadTaxPercentage = 5.0; // General reduction for second-hand vehicles
      if (vehicleAge > 10) {
          roadTaxPercentage += 2.0; // Additional green tax for older vehicles
      }
      return (exShowroomPrice * roadTaxPercentage) / 100.0;
  }

  switch (state) {
      case 'Andhra Pradesh':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : engineCapacity <= 500 ? 8.0 : 10.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 10.0 : 15.0;
          }
          break;
  
      case 'Arunachal Pradesh':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 5.0 : 10.0;
          break;
  
      case 'Assam':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : engineCapacity <= 350 ? 7.0 : 8.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 8.0 : 12.0;
          }
          break;
  
      case 'Bihar':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : 7.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 10.0 : 12.0;
          }
          break;
  
      case 'Delhi':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 3.0 : engineCapacity <= 350 ? 4.0 : engineCapacity <= 750 ? 6.0 : 6.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 12.0 : 15.0;
          }
          break;
  
      case 'Goa':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 7.0;
          } else {
              roadTaxPercentage = 10.0;
          }
          break;
  
      case 'Gujarat':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : 7.0;
          } else {
              roadTaxPercentage = vehicleType === 'Luxury' ? 15.0 : 10.0;
          }
          break;
  
      case 'Haryana':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 7.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 600000 ? 8.0 : exShowroomPrice <= 1000000 ? 10.0 : 12.0;
          }
          break;
  
      case 'Himachal Pradesh':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : 7.0;
          } else {
              roadTaxPercentage = engineCapacity <= 1500 ? 8.0 : 12.0;
          }
          break;
  
      case 'Jammu & Kashmir':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 4.0 : engineCapacity <= 1500 ? 8.0 : 10.0;
          break;
  
      case 'Jharkhand':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 7.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 8.0 : 12.0;
          }
          break;
  
      case 'Karnataka':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 8.0 : engineCapacity <= 350 ? 10.0 : 12.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 500000 ? 13.0 : exShowroomPrice <= 1000000 ? 14.0 : 18.0;
          }
          break;
  
      case 'Kerala':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : 8.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 500000 ? 9.0 : 12.0;
          }
          break;
  
      case 'Madhya Pradesh':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : 7.0;
          } else {
              roadTaxPercentage = engineCapacity <= 1500 ? 8.0 : 10.0;
          }
          break;
  
      case 'Maharashtra':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 8.0 : engineCapacity <= 350 ? 10.0 : 12.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 10.0 : 15.0;
          }
          break;
  
      case 'Manipur':
      case 'Meghalaya':
      case 'Nagaland':
      case 'Tripura':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 5.0 : 10.0;
          break;
  
      case 'Mizoram':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 5.0 : engineCapacity <= 1500 ? 8.0 : 10.0;
          break;
  
      case 'Odisha':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 5.0 : engineCapacity <= 1500 ? 8.0 : 12.0;
          break;
  
      case 'Punjab':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : 8.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 600000 ? 8.0 : exShowroomPrice <= 1000000 ? 10.0 : 12.0;
          }
          break;
  
      case 'Rajasthan':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 6.0;
          } else {
              roadTaxPercentage = engineCapacity <= 1500 ? 8.0 : 12.0;
          }
          break;
  
      case 'Sikkim':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 5.0 : 8.0;
          break;
  
      case 'Tamil Nadu':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 8.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 10.0 : 12.0;
          }
          break;
  
      case 'Telangana':
          roadTaxPercentage = vehicleCategory === 'Two-Wheeler' ? 5.0 : 10.0;
          break;
  
      case 'Uttar Pradesh':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 8.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 10.0 : 12.0;
          }
          break;
  
      case 'Uttarakhand':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 4.0 : 7.0;
          } else {
              roadTaxPercentage = engineCapacity <= 1500 ? 8.0 : 10.0;
          }
          break;
  
      case 'West Bengal':
          if (vehicleCategory === 'Two-Wheeler') {
              roadTaxPercentage = engineCapacity <= 150 ? 5.0 : engineCapacity <= 500 ? 8.0 : 10.0;
          } else {
              roadTaxPercentage = exShowroomPrice <= 1000000 ? 10.0 : 12.0;
          }
          break;
  
      default:
          roadTaxPercentage = 10.0; // Default for other states
  }
  

  return (exShowroomPrice * roadTaxPercentage) / 100.0;
}

// Function to calculate GST
function calculateGST(fuelType, exShowroomPrice, engineCapacity, vehicleCategory, vehicleType, isSecondHand) {
  let gstPercentage = 18.0;

  if (isSecondHand) {
      gstPercentage = 18.0;
  } else {
      if (vehicleCategory === 'Two-Wheeler') {
          gstPercentage = engineCapacity <= 150 ? 12.0 : 18.0;
      } else {
          if (fuelType === 'Electric') {
              gstPercentage = 5.0;
          } else if (fuelType === 'Petrol' || fuelType === 'Diesel') {
              gstPercentage = engineCapacity > 1500 ? 28.0 : 18.0;
          }
          if (vehicleType === 'Luxury') gstPercentage += 3.0;
      }
  }

  return (exShowroomPrice * gstPercentage) / 100.0;
}

// Function to calculate insurance
function calculateInsurance(exShowroomPrice, vehicleCategory, isSecondHand) {
  const insurancePercentage = isSecondHand ? 2.0 : vehicleCategory === 'Two-Wheeler' ? 2.0 : 3.0;
  return (exShowroomPrice * insurancePercentage) / 100.0;
}

// Function to calculate additional charges
function calculateAdditionalCharges(includeAccessories, includeExtendedWarranty, exShowroomPrice) {
  
  const extendedWarrantyCost = includeExtendedWarranty ? (exShowroomPrice * 2.0) / 100.0 : 0.0;
  return  extendedWarrantyCost;
}

// Route to calculate taxes and on-road price
router.post('/car', async(req, res) => {
  try {
      let {
          state,
          fuelType,
          vehicleCategory,
          vehicleType,
          exShowroomPrice,
          engineCapacity,
          isSecondHand,
          vehicleAge,
          includeAccessories,
          includeExtendedWarranty
      } = req.body;

      exShowroomPrice = parseFloat(exShowroomPrice)
      engineCapacity = parseInt(engineCapacity)
      vehicleAge = parseFloat(vehicleAge)
      
      // Validate inputs
      validatePositiveInput(exShowroomPrice, 'Ex-showroom Price');
      validatePositiveInput(engineCapacity, 'Engine Capacity');
      if (isSecondHand) validatePositiveInput(vehicleAge, 'Vehicle Age');

      // Calculate components
      const roadTax = calculateRoadTax(state, exShowroomPrice, engineCapacity, vehicleCategory, vehicleType, isSecondHand, vehicleAge);
      const gst = calculateGST(fuelType, exShowroomPrice, engineCapacity, vehicleCategory, vehicleType, isSecondHand);
      const insurance = calculateInsurance(exShowroomPrice, vehicleCategory, isSecondHand);
      const additionalCharges = calculateAdditionalCharges(includeAccessories, includeExtendedWarranty, exShowroomPrice);

      const totalTax = roadTax + gst + insurance + additionalCharges;
      const onRoadPrice = exShowroomPrice + totalTax;
      let x = ""
      if(state == "West Bengal") x = "Considering you are buying the vehicle in West Bengal, we would suggest you to buy the vehicle in Jharkhand doing so you will pay less taxes."
      // Send response
      res.status(200).json({
          exShowroomPrice,
          roadTax,
          gst,
          insurance,
          additionalCharges,
          totalTax,
          onRoadPrice,
          statement : (fuelType != "Electric")?`Buying an electric vehicle can save you upto 23% of taxes in GST which will reduce your Ex-Showroom price as well as fuel cost economy.\n ` : `You saved 23% of your GST taxes by opting for an electric vehicle`
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});









module.exports = router;
