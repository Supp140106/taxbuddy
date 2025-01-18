




function getTwentySentences(inputText) {
    // Split the string into sentences using the period as a delimiter
    let sentences = inputText.split('.').map(sentence => sentence.trim()).filter(sentence => sentence.length > 0);
    
    // If there are fewer than 20 sentences, add filler sentences
    while (sentences.length < 20) {
      sentences.push("This is a filler sentence.");
    }
  
    // If there are more than 20 sentences, truncate the extra ones
    sentences = sentences.slice(0, 15);
    
    // Join the sentences back into a single string
    return sentences.join('. ') + '.'; // Add period at the end of the last sentence
  }


let oldTax = document.getElementById("income-old-tax");
let newTax2024 = document.getElementById("income-new-tax-2024");
let newTax2025 = document.getElementById("income-new-tax-2025");
let statement = document.getElementById("income-statement");

let income = localStorage.getItem("income-result");
income = JSON.parse(income);
oldTax.innerText = income.old;
newTax2024.innerText = income.new24;
newTax2025.innerText = income.new25;
statement.innerText = getTwentySentences(income.statement);

let stampDuty = document.getElementById("payment-stamp-duty");
let registrationCharge = document.getElementById("payment-registration-charge");
let gst = document.getElementById("payment-gst");
let tds = document.getElementById("payment-tds");
let totalPayable = document.getElementById("payment-total-payable");
let paymentStatement = document.getElementById("payment-statement");

let propertybuy = localStorage.getItem("propertybuy")
propertybuy = JSON.parse(propertybuy);
stampDuty.innerText = propertybuy.stampduty
registrationCharge.innerText = propertybuy.registration
gst.innerText = propertybuy.GST
tds.innerText = propertybuy.TDS
totalPayable.innerText = propertybuy.totalPayable
paymentStatement.innerText = propertybuy.optimisation







let cook = document.cookie.split(";")
console.log(cook)
let username;

for (let index = 0; index < cook.length; index++) {
    const element = cook[index];
    
    let t = element.split("=");
    
    if (t[0].trim() == "name") {
        
        username = t[1]
        username = username.split("%20")

    }
}
let user = document.getElementById("profile-name");
let t= "";
username.forEach((value)=>{
    t = t + `${value} `
})

user.innerText = "User";
if(username) user.innerText = t







