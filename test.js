const express = require("express");
const router = express.Router();
const {income_taxcalcnew,income_taxcalcold} = require('../calculator/taxcalculator')
const d = new Date();
const year = d.getFullYear();

router.post("/incometax", (req, res) => {
  const persondata = req.body;

  const person = {}; // object
  person.stddeduc = 50000;
  //personal info

  person.fullname = persondata.fullname;
  person.age = parseInt(persondata.age);
  person.parent = Boolean(persondata.isparent);
  person.parentage_m = parseInt(persondata.parentage_m);
  person.parentage_f = parseInt(persondata.parentage_f);
  person.income_salary = parseFloat(persondata.income_salary);
  person.income_houseproperty = parseFloat(persondata.income_houseproperty);
  person.income_buisness = parseFloat(persondata.income_buisness);
  person.income_side = parseFloat(persondata.income_side);

  // 80C section => {maximum limit : 1.5 lakhs}
  person.EPF = parseFloat(persondata.EPF); //employee provident fund
  person.PPF = parseFloat(persondata.PPF); // public provident fund
  person.NSC = parseFloat(persondata.NSC); // national saving Certificates

  person.lifeinsurancepremium = parseFloat(persondata.lifeinsurancepremium);
  person.fixeddp_5 = parseFloat(persondata.fixeddp_5);
  person.ELSS = parseFloat(persondata.ELSS); // Equity linke dsaving scheme

  person.homeloan_principal = parseFloat(persondata.homeloan_principal);

  person.children_tution = parseFloat(persondata.children_tution);

  //80D section =>{maximum limit below 60 : 25000, senior citizen = 50000}
  person.healthinsurance1 = parseFloat(persondata.healthinsurance1); // for self,spouse,children
  person.healthinsurance2 = parseFloat(persondata.healthinsurance2); // for parents

  //Section 80TTA/80TTB: Savings and Fixed Deposits
  person.saving_interst = parseFloat(persondata.saving_interst);
  person.fixed_deposit = parseFloat(persondata.fixed_deposit);

  // Section 80E: Education Loan
  person.educationloan = parseFloat(persondata.educationloan); // This must contain the interst per year
  person.edloan_year = parseFloat(persondata.edloan_year);

  //Section 80G: Donations
  person.donationtype1 = parseFloat(persondata.donation1); // for 100% deduction pm care or national defence fund
  person.donationtype2 = parseFloat(persondata.donation2); // for 40% deuction local ngo
  //HRA (House Rent Allowance)
  
  if (persondata.income_salary && persondata.hra) {
    if (persondata.metro) {
      person.hra = Math.min(
        0.5 * person.income_salary,
        parseFloat(persondata.rentpaid) - 0.1 * person.income_salary,
        parseFloat(persondata.hra)
      );
    }
    else{
        person.hra = Math.min(
            0.4 * person.income_salary,
            parseFloat(persondata.rentpaid) - 0.1 * person.income_salary,
            parseFloat(persondata.hra)
          );
    }
  }

  // leave travel allowance
  person.LTA = parseFloat(persondata.LTA);

  //Section 80EE/80EEA: First-Time Homebuyers
  if (persondata.fisrthome) {
    if (
      (parseIntpersondata.sancyear) >= 2016 &&
      parseInt(persondata.sancyear) <= 2017 &&
      parseInt(persondata.propertyvalue) <= 5000000 &&
      parseInt(persondata.loanamt) <= 3500000
    ) {
      person.eeoreea = 50000; // for section80EE
    }
    if (
        parseInt(persondata.sancyear) >= 2019 &&
        parseInt(persondata.sancyear) <= 2024 &&
        parseInt(persondata.stampduty) <= 4500000
    ) {
      person.eeoreea = 150000; //FOR SECTION 80EEA
    }
  } else {
    person.eeoreea = 0;
  }

  //Disabilities -----
  person.disability = 0;
  if (parseInt(persondata.disability) >= 40 && parseInt(persondata.disability) <= 80) {
    person.disability = 75000;
  }
  if (parseInt(persondata.disability) >= 80) {
    person.disability = 125000;
  } 
  
  
  //National Pension Sceme
  person.NPS = parseFloat(persondata.NPS);
//All data of Income tax are analysed here
  let taxabinc = person.income_salary + person.income_buisness +person.income_houseproperty + person.income_side;
  let sec80 = Math.min(person.EPF + person.PPF +person.NSC + person.lifeinsurancepremium + person.fixeddp_5 + person.ELSS + person.homeloan_principal + person.children_tution, 150000);
  
  // Health Insurance
  let health_insurance = 0;
  if (person.age<60) {
    health_insurance = (person.healthinsurance1<= 25000)? person.healthinsurance1 : 25000;
    if (person.parent && (person.parentage_m>60 || person.parentage_f>60)) {
        health_insurance+=(person.healthinsurance2<= 50000)? person.healthinsurance2 : 50000;
    }
    if (person.parent &&( person.parentage_m<60 && person.parentage_f<60)) {
        health_insurance+=(person.healthinsurance2<= 25000)? person.healthinsurance2 : 25000;
    }
  }
  else{
    health_insurance = (person.healthinsurance1<= 50000)? person.healthinsurance1 : 50000;
    if (person.parent && person.parentage_m>60 || person.parentage_f>60) {
        health_insurance+=(person.healthinsurance2<= 50000)? person.healthinsurance2 : 50000;
    }
    if (person.parent && person.parentage_m<60 && person.parentage_f<60) {
        health_insurance+=(person.healthinsurance2<= 25000)? person.healthinsurance2 : 25000;
    }
  }
  // ===== For Section 80TTA or 80TTB
  let TTA_TTB;
  if (person.age >= 60) {
    TTA_TTB = person.fixed_deposit + ((person.saving_interst<10000)?person.saving_interst:10000);
  }
  else{
   TTA_TTB =  (person.saving_interst<10000)?person.saving_interst:10000;
  }
  
  let edloansection80 = 0;
  if ((person.edloan_year - year )<=8) {
    edloansection80 = person.educationloan;
  }

  let donation = (0.4*person.donationtype2)+person.donationtype1;
  taxabinc = taxabinc - (sec80 + health_insurance + TTA_TTB + edloansection80 + donation + person.hra + person.LTA + person.eeoreea+person.disability+ person.NPS);
  console.log(income_taxcalcold(taxabinc,person.age));
  console.log(income_taxcalcnew(taxabinc));
  res.end("See your console")
  
});


module.export = router;