document.addEventListener("DOMContentLoaded", () => {
    // Handle Parents' Yes/No Toggle
    const parentsYes = document.getElementById("parents-alive-yes");
    const parentsNo = document.getElementById("parents-alive-no");
    const parentsExtraDetails = document.getElementById("parents-extra-details");

    parentsYes.addEventListener("change", () => {
        if (parentsYes.checked) {
            parentsExtraDetails.style.display = "block";
        }
    });

    parentsNo.addEventListener("change", () => {
        if (parentsNo.checked) {
            parentsExtraDetails.style.display = "none";
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // Handle Education Loan Yes/No Toggle
    const loanYes = document.getElementById("education-loan-yes");
    const loanNo = document.getElementById("education-loan-no");
    const loanDetails = document.getElementById("education-loan-details");

    loanYes.addEventListener("change", () => {
        if (loanYes.checked) {
            loanDetails.style.display = "block";
        }
    });

    loanNo.addEventListener("change", () => {
        if (loanNo.checked) {
            loanDetails.style.display = "none";
        }
    });
});
// Show first-time homebuyer question when 'Yes' is selected for loan sanction period
document.getElementById('loan-sanction-yes').addEventListener('click', function() {
    document.getElementById('first-home-question').style.display = 'block';
});

// Hide first-time homebuyer question when 'No' is selected
document.getElementById('loan-sanction-no').addEventListener('click', function() {
    document.getElementById('first-home-question').style.display = 'none';
    document.getElementById('loan-amount').style.display = 'none';
    document.getElementById('loan-time-period').style.display = 'none';
});

// Show loan ongoing question when 'Yes' is selected for first-time homebuyer
document.getElementById('first-home-yes').addEventListener('click', function() {
    document.getElementById('loan-ongoing-question').style.display = 'block';
});

// Hide loan ongoing question when 'No' is selected for first-time homebuyer
document.getElementById('first-home-no').addEventListener('click', function() {
    document.getElementById('loan-ongoing-question').style.display = 'none';
    document.getElementById('loan-amount').style.display = 'none';
    document.getElementById('loan-time-period').style.display = 'none';
});

// Show loan amount and time period when loan is ongoing
document.getElementById('loan-ongoing-yes').addEventListener('click', function() {
    document.getElementById('loan-amount').style.display = 'block';
    document.getElementById('loan-time-period').style.display = 'block';
});

// Hide loan amount and time period when loan is not ongoing
document.getElementById('loan-ongoing-no').addEventListener('click', function() {
    document.getElementById('loan-amount').style.display = 'none';
    document.getElementById('loan-time-period').style.display = 'none';
});




document.addEventListener('DOMContentLoaded', function () {
    const disabilityYes = document.getElementById('disability-yes');
    const disabilityNo = document.getElementById('disability-no');
    const disabilityPercentage = document.getElementById('disability-percentage');

    const npsYes = document.getElementById('nps-yes');
    const npsNo = document.getElementById('nps-no');
    const npsDetails = document.getElementById('nps-details');

    // Show disability percentage field if 'Yes' is selected
    disabilityYes.addEventListener('change', function () {
        disabilityPercentage.style.display = 'block';
    });

    disabilityNo.addEventListener('change', function () {
        disabilityPercentage.style.display = 'none';
    });

    // Show NPS details field if 'Yes' is selected
    npsYes.addEventListener('change', function () {
        npsDetails.style.display = 'block';
    });

    npsNo.addEventListener('change', function () {
        npsDetails.style.display = 'none';
    });
});


// Function to move the cursor to the next input field when "Enter" is pressed
document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll("input, select, textarea"); // Select all input fields

    inputs.forEach((input, index) => {
        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                // Prevent the default "Enter" key action (e.g., form submission)
                event.preventDefault();

                // Move the cursor to the next input field if it exists
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
});

// Function to create a star at the mouse position
let account = document.getElementById("account");
let login = document.getElementById("login");


let cook = document.cookie.split(";")
console.log(cook)
let username;

for (let index = 0; index < cook.length; index++) {
    const element = cook[index];
    
    let t = element.split("=");
    
    if (t[0].trim() == "name") {
        
        login.style.display = "none";
        account.style.display = "block"
        username = t[1]
        username = username.split("%20")

    }
}
   