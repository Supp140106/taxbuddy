// Function to check if the user lives in a metro city
function checkMetroCity() {
    const metroYes = document.getElementById("metro-yes");
    const metroNo = document.getElementById("metro-no");

    if (metroYes && metroYes.checked) {
        console.log("User lives in a metro city: true");
        return true; // return true for metro city
    } else if (metroNo && metroNo.checked) {
        console.log("User lives in a metro city: false");
        return false; // return false for non-metro city
    } else {
        console.log("No selection made.");
        return null; // or handle accordingly
    }
}

// Function to gather all data from form fields
function getData() {
    const personalDetails = {
        fullName: document.getElementById("full-name")?.value || "",
        age: Number(document.getElementById("age")?.value) || 0,
        occupation: document.getElementById("occupation")?.value || "",
        income_salary: Number(document.getElementById("salary-income")?.value) || 0,
        income_houseproperty:
            Number(document.getElementById("house-income")?.value) || 0,
        income_buisness:
            Number(document.getElementById("business-income")?.value) || 0,
        income_side: Number(document.getElementById("other-income")?.value) || 0,
        income_capitalgain:
            Number(document.getElementById("capital-gain")?.value) || 0,

        EPF: Number(document.getElementById("epf")?.value) || 0,
        PPF: Number(document.getElementById("ppf")?.value) || 0,
        NSC: Number(document.getElementById("nsc")?.value) || 0,
        fixeddp_5: Number(document.getElementById("fd")?.value) || 0,
        lifeinsurancepremium:
            Number(document.getElementById("life-insurance")?.value) || 0,
        ElSS: Number(document.getElementById("elss")?.value) || 0,
        homeloan_principal:
            Number(document.getElementById("home-loan")?.value) || 0,
        sukanyasamridhi: Number(document.getElementById("sukanya")?.value) || 0,
        children_tution:
            Number(document.getElementById("children-tuition")?.value) || 0,

        parentage_f: Number(document.getElementById("father-age")?.value) || 0,
        parentage_m: Number(document.getElementById("mother-age")?.value) || 0,
        healthinsurance1:
            Number(document.getElementById("self-health-insurance")?.value) || 0,
        healthinsurance2:
            Number(document.getElementById("parents-health-insurance")?.value) || 0,

        saving_interst:
            Number(document.getElementById("savings-interest")?.value) || 0,
        fixed_deposit: Number(document.getElementById("fd-interest")?.value) || 0,

        educationloan: Number(document.getElementById("loan-amount")?.value) || 0,
        edloan_year: Number(document.getElementById("loan-year")?.value) || 0,

        donation1: Number(document.getElementById("pm-cares-fund")?.value) || 0,
        donation2:
            Number(document.getElementById("local-ngo-donations")?.value) || 0,

        hra: Number(document.getElementById("hra")?.value) || 0,
        LTA: Number(document.getElementById("lta")?.value) || 0,
        rentpaid: Number(document.getElementById("rentpaid")?.value) || 0,
        metro: checkMetroCity(),

        sancyear: document.getElementById("loan-sanction-year")?.value || 0,
        propertyvalue: document.getElementById("Property-value-input")?.value || 0,
        loanamt: Number(document.getElementById("loan-time-input")?.value) || 0,

        disability:
            Number(document.getElementById("disability-percent")?.value) || 0,

        NPS: document.getElementById("nps-info")?.value || 0,
    };

    return personalDetails;
}

async function fetchdata() {
    try {
        const response = await fetch("/submit/income", {
            method: "POST", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Set the content type
            },
            body: JSON.stringify(getData()), // Convert data to JSON format for the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        return data; // Handle the data
    } catch (error) {
        console.error("Error posting data:", error); // Handle errors
    }
}

// Event listener for the submit button
document
    .getElementById("submit-btn")
    .addEventListener("click", async function () {
        const sectionsToHide = document.querySelectorAll(
            ".form-section"
        );
        sectionsToHide.forEach((section) => {
            section.style.display = "none";
        });

        // Show only the Personal Details section
        // document.getElementById("personal-details").style.display = "block";
        const personData = await getData();
        console.log(personData);
        let data = await fetchdata();
        console.log(data)
        // Log the data to the console
    });
