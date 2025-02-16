let result = document.getElementById("resultpage")
let calc = document.getElementById("calc");
let goback = document.getElementById("goback");
let loading = document.getElementById("loading-wrapper");



async function postFormData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Ensures cookies are included in the request
    });

    // Check if the response is a redirect
    if (response.redirected) {
      // Manually redirect the browser
      window.location.href = response.url;
      return;
    }

    // Parse the JSON response if not redirected
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

document.getElementById("Submit1").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent form submission to server
  
  // Collect form data
  const formData = {
    exShowroomPrice: document.getElementById("price").value,
    state: document.getElementById("state").value,
    fuelType: document.getElementById("fuelType").value,
    engineCapacity: document.getElementById("engineCapacity").value || 0, // Optional
    vehicleCategory: document.getElementById("carCategory").value,
    isSecondHand: document.getElementById("isSecondHand").value,
    carAge: document.getElementById("carAge").value || 0, // Optional
    includeAccessories: document.getElementById("includeAccessories").value,
    includeExtendedWarranty: document.getElementById("includeExtendedWarranty")
      .value,
  };
  calc.style.display = "none"
  loading.style.display = "block"
  let answer = await postFormData("/property/car", formData);
  loading.style.display = "none"
  document.getElementById(
    "exShowroomPrice"
  ).textContent = `₹${answer.exShowroomPrice.toLocaleString()}`;
  document.getElementById(
    "roadTax"
  ).textContent = `₹${answer.roadTax.toLocaleString()}`;
  document.getElementById("gst").textContent = `₹${answer.gst.toLocaleString()}`;
  document.getElementById(
    "insurance"
  ).textContent = `₹${answer.insurance.toLocaleString()}`;
  document.getElementById(
    "additionalCharges"
  ).textContent = `₹${answer.additionalCharges.toLocaleString()}`;
  document.getElementById(
    "totalTax"
  ).textContent = `₹${answer.totalTax.toLocaleString()}`;
  document.getElementById(
    "onRoadPrice"
  ).textContent = `₹${answer.onRoadPrice.toLocaleString()}`;

  // Update the statement
  document.getElementById(
    "statement"
  ).innerText = `${answer.statement.replaceAll("*"," ")}.`;
calc.style.display = "none"
result.style.display = "flex"
answer = JSON.stringify(answer);
localStorage.setItem("vehicle",answer)
});

// Optional: Show/hide car age field based on second-hand selection
document.getElementById("isSecondHand").addEventListener("change", function () {
  const carAgeContainer = document.getElementById("carAgeContainer");
  if (this.value === "true") {
    carAgeContainer.classList.remove("hidden");
  } else {
    carAgeContainer.classList.add("hidden");
    document.getElementById("carAge").value = ""; // Clear car age field
  }
});

// Optional: Show/hide engine capacity field based on fuel type
document.getElementById("fuelType").addEventListener("change", function () {
  const engineCapacityContainer = document.getElementById(
    "engineCapacityContainer"
  );
  if (this.value === "Electric") {
    engineCapacityContainer.style.display = "none";
    document.getElementById("engineCapacity").value = ""; // Clear engine capacity field
  } else {
    engineCapacityContainer.style.display = "block";
  }
});


document.getElementById("goback").addEventListener("click",async (e)=>{
  e.target.style.display = "none";
  calc.style.display = "block"
result.style.display = "none"

})