const express = require("express");
const router = express.Router();
const run = require("../gemini")
const taxcal = require("../calculator/taxcalculator");

// ========================================


router.post("/income", async (req, res) => {
  const d = new Date();
  const year = d.getFullYear();
  const persondata = await req.body;
  const person = {}; // object
  person.stdold = 50000;

  //personal info

  person.fullname = persondata.fullname;
  person.age = parseInt(persondata.age);
  person.parent_age_mother = parseInt(persondata.parentage_m) || 0;
  person.parent_age_father = parseInt(persondata.parentage_f) || 0;
  person.income_salary = parseFloat(persondata.income_salary) || 0;
  person.income_houseproperty =
    parseFloat(persondata.income_houseproperty) * 0.7 || 0;
  person.income_buisness = parseFloat(persondata.income_buisness) || 0;
  person.income_side = parseFloat(persondata.income_side) || 0;
  person.income_capitalgain = parseFloat(persondata.income_capitalgain) || 0;

  // 80C section => {maximum limit : 1.5 lakhs}
  person.EPF = parseFloat(persondata.EPF) || 0; //employee provident fund
  person.PPF = parseFloat(persondata.PPF) || 0; // public provident fund
  person.NSC = parseFloat(persondata.NSC) || 0; // national saving Certificates

  person.lifeinsurancepremium =
    parseFloat(persondata.lifeinsurancepremium) || 0;
  person.fixeddp_5 = parseFloat(persondata.fixeddp_5) || 0;
  person.ELSS = parseFloat(persondata.ELSS) || 0; // Equity linked saving scheme
  person.children_tution = parseFloat(persondata.children_tution) || 0;
  person.homeloan_principal = parseFloat(persondata.homeloan_principal) || 0; //percentage home loan principal interest/yr
  person.POTD = parseFloat(persondata.POTD) || 0;
  person.sukanyasamridhi = parseFloat(persondata.sukanyasamridhi) || 0;

  //80D section =>{maximum limit below 60 : 25000, senior citizen = 50000}
  person.healthinsurance1 = parseFloat(persondata.healthinsurance1) || 0; // for self,spouse,children
  person.healthinsurance2 = parseFloat(persondata.healthinsurance2) || 0; // for parents

  //Section 80TTA/80TTB: Savings and Fixed Deposits
  person.saving_interst = parseFloat(persondata.saving_interst) || 0;
  person.fixed_deposit = parseFloat(persondata.fixed_deposit) || 0;

  // Section 80E: Education Loan
  person.educationloan = parseFloat(persondata.educationloan) || 0; // This must contain the interst per year
  person.edloan_year = parseFloat(persondata.edloan_year) || 0;

  //Section 80G: Donations
  person.donationtype1 = parseFloat(persondata.donation1) || 0; // for 100% deduction pm care or national defence fund
  person.donationtype2 = parseFloat(persondata.donation2) || 0; // for 40% deuction local ngo
  //HRA (House Rent Allowance)
  const rentPaid = parseFloat(persondata.rentpaid) || 0;
  person.hra = 0;
  if (persondata.income_salary && parseFloat(persondata.hra)) {
    if (persondata.metro) {
      person.hra = Math.min(
        0.5 * person.income_salary,
        rentPaid - 0.1 * person.income_salary,
        parseFloat(persondata.hra)
      );
    } else {
      person.hra = Math.min(
        0.4 * person.income_salary,
        rentPaid - 0.1 * person.income_salary,
        parseFloat(persondata.hra)
      );
    }
  }

  // leave travel allowance
  person.LTA = parseFloat(persondata.LTA) || 0;
  person.travelactualcost = parseFloat(persondata.travelactualcost) || 0;
  LTA =
    person.LTA > person.travelactualcost ? person.travelactualcost : person.LTA;

  //Section 80EE/80EEA: First-Time Homebuyers
  person.eeoreea = 0;
  if (
    (parseInt(persondata.sancyear) >= 2016 &&
      parseInt(persondata.sancyear) <= 2017 &&
      parseInt(persondata.propertyvalue) <= 5000000 &&
      parseInt(persondata.loanamt)) <= 3500000
  ) {
    person.eeoreea = 50000; // for section80EE
  } else if (
    parseInt(persondata.sancyear) >= 2019 &&
    parseInt(persondata.sancyear) <= 2024 &&
    parseInt(persondata.stampduty) <= 4500000
  ) {
    person.eeoreea = 150000; //FOR SECTION 80EEA
  } else {
    person.eeoreea = 0;
  }

  //Disabilities -----
  person.disability = 0;
  if (
    parseInt(persondata.disability) >= 40 &&
    parseInt(persondata.disability) <= 80
  ) {
    person.disability = 75000;
  }
  if (parseInt(persondata.disability) >= 80) {
    person.disability = 125000;
  }

  //National Pension Sceme
  person.NPS = parseFloat(persondata.NPS);

  //All data of Income tax are analysed here
  let taxabinc =
    person.income_salary +
    person.income_buisness +
    person.income_houseproperty +
    person.income_side;

  let sec80 = Math.min(
    person.EPF +
      person.PPF +
      person.NSC +
      person.lifeinsurancepremium +
      person.fixeddp_5 +
      person.ELSS +
      person.homeloan_principal +
      person.children_tution +
      person.sukanyasamridhi,
    150000
  );

  // Health Insurance
  let health_insurance = 0;
  if (person.age < 60) {
    health_insurance =
      person.healthinsurance1 <= 25000 ? person.healthinsurance1 : 25000;
    if (person.parent && (person.parentage_m > 60 || person.parentage_f > 60)) {
      health_insurance +=
        person.healthinsurance2 <= 50000 ? person.healthinsurance2 : 50000;
    }
    if (person.parent && person.parentage_m < 60 && person.parentage_f < 60) {
      health_insurance +=
        person.healthinsurance2 <= 25000 ? person.healthinsurance2 : 25000;
    }
  } else {
    health_insurance =
      person.healthinsurance1 <= 50000 ? person.healthinsurance1 : 50000;
    if ((person.parent && person.parentage_m > 60) || person.parentage_f > 60) {
      health_insurance +=
        person.healthinsurance2 <= 50000 ? person.healthinsurance2 : 50000;
    }
    if (person.parent && person.parentage_m < 60 && person.parentage_f < 60) {
      health_insurance +=
        person.healthinsurance2 <= 25000 ? person.healthinsurance2 : 25000;
    }
  }

  // ===== For Section 80TTA or 80TTB
  let TTA_TTB = 0;
  if (person.age >= 60) {
    TTA_TTB =
      person.fixed_deposit +
      (person.saving_interst < 10000 ? person.saving_interst : 10000);
  } else {
    TTA_TTB = person.saving_interst < 10000 ? person.saving_interst : 10000;
  }

  let edloansection80 = 0;
  if (person.edloan_year - year <= 8) {
    edloansection80 = person.educationloan;
  }

  let donation = 0.5 * person.donationtype1 + person.donationtype2; // first is local 50 percent second is goverment donation

  let taxable =
    taxabinc -
    (sec80 +
      health_insurance +
      TTA_TTB +
      edloansection80 +
      donation +
      person.stdold +
      person.hra +
      LTA +
      person.eeoreea +
      person.disability +
      person.NPS);
  let promt = `As an experienced and approachable tax advisor specializing in Indian tax law, provide clear and actionable tax advice. Limit your response to 200 words, focusing on practical tax-saving strategies, deductions, credits, and important deadlines. Prioritize the most beneficial and relevant strategies for the individual’s financial situation, while highlighting any key changes in Indian tax law that could affect their filings. Avoid technical jargon and explain concepts in a simple, friendly manner suitable for all taxpayers. Include a reminder to seek personalized advice from a professional for the best results.

The user data is as follows:

Personal Info: ${person}
Old Tax Calculation: ${taxcal.income_taxcalcold(taxable, person.age)}
New Tax Calculation for AY 2024-25: ${taxcal.income_taxcalcnew_ay2425(taxabinc)}
New Tax Calculation for AY 2025-26: ${taxcal.income_taxcalcnew_ay2526(taxabinc)}`;


  
      let result = await run(promt);
  res.json({
    old: taxcal.income_taxcalcold(taxable, person.age),
    new24: taxcal.income_taxcalcnew_ay2425(taxabinc),
    new25: taxcal.income_taxcalcnew_ay2526(taxabinc),
    statement : result.response.text()
  });
});

module.exports = router;
