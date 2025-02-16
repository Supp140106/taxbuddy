let cook = document.cookie.split(";");
console.log(cook);
let username;

for (let index = 0; index < cook.length; index++) {
  const element = cook[index];
  let t = element.split("=");
  
  if (t[0].trim() === "name") {
    username = t[1] ? t[1].split("%20") : null;
  }
}

let user = document.getElementById("profile-name");
let t = "";

if (username) {
  username.forEach((value) => {
    t = t + `${value} `;
  });
  user.innerText = t;
} else {
  user.innerText = "User"; // Default value
}



let logout = document.getElementById("logout")

logout.addEventListener("click",async (e)=>{
  e.preventDefault()
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
});
  localStorage.clear();
  window.location.href = "/logout"
})


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
if (income) {
  income = JSON.parse(income);
  oldTax.innerText = income.old || 0; // Default to 0 if null or undefined
  newTax2024.innerText = income.new24 || 0;
  newTax2025.innerText = income.new25 || 0;
  statement.innerText = getTwentySentences(income.statement || ""); // Use empty string if null
} else {
  oldTax.innerText = 0;
  newTax2024.innerText = 0;
  newTax2025.innerText = 0;
  statement.innerText = "No income data available.";
}

let stampDuty = document.getElementById("payment-stamp-duty");
let registrationCharge = document.getElementById("payment-registration-charge");
let gst = document.getElementById("payment-gst");
let tds = document.getElementById("payment-tds");
let totalPayable = document.getElementById("payment-total-payable");
let paymentStatement = document.getElementById("payment-statement");
paymentStatement.replaceAll("*","")

let propertybuy = localStorage.getItem("propertybuy");
if (propertybuy) {
  propertybuy = JSON.parse(propertybuy);
  stampDuty.innerText = propertybuy.stampduty || 0; // Default to 0 if null or undefined
  registrationCharge.innerText = propertybuy.registration || 0;
  gst.innerText = propertybuy.GST || 0;
  tds.innerText = propertybuy.TDS || 0;
  totalPayable.innerText = propertybuy.totalPayable || 0;
  paymentStatement.innerText = propertybuy.optimisation || "No payment data available.";
} else {
  stampDuty.innerText = 0;
  registrationCharge.innerText = 0;
  gst.innerText = 0;
  tds.innerText = 0;
  totalPayable.innerText = 0;
  paymentStatement.innerText = "No payment data available.";
}

