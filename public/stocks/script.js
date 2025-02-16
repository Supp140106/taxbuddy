async function fetchdata(playload) {
    try {
        const response = await fetch("/stock/calculate", {
            method: "POST", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Set the content type
            },
            body: JSON.stringify(playload), // Convert data to JSON format for the request body
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

document.addEventListener("DOMContentLoaded", () => {
    const animationContainer = document.querySelector(".background-animation");

    function createFallingSymbol() {
        const symbol = document.createElement("div");
        symbol.classList.add("money-symbol");
        symbol.style.left = `${Math.random() * 100}vw`; // Use template literals correctly
        symbol.style.animationDelay = `${Math.random() * 3}s`; // Use template literals correctly
        symbol.textContent = "₹";

        animationContainer.appendChild(symbol);

        // Remove symbol after animation
        symbol.addEventListener("animationend", () => {
            symbol.remove();
        });
    }

    // Generate falling symbols every 500ms
    setInterval(createFallingSymbol, 500);
});

document.getElementById("calculateBtn").addEventListener("click", async function () {
    // Get form values
    const purchasePrice = document.getElementById("purchasePrice").value;
    const sellingPrice = document.getElementById("sellingPrice").value;
    const numStocks = document.getElementById("numStocks").value;
    const listed = document.querySelector('input[name="listed"]:checked').value;
    const date = document.getElementById("DateStock").value;

    // Check if all fields are filled
    if (purchasePrice && sellingPrice && numStocks && listed) {
        // Prepare payload
        const payload = {
            purchasePrice: purchasePrice,
            salePrice: sellingPrice,
            numberOfStocks: numStocks,
            listedShare: listed,
            purchaseDate: date,
        };

        // Fetch data using the global fetchdata function
        const result = await fetchdata(payload);

        if (result) {
            // Update the DOM with the received data
            const capitalGainsTax = document.getElementById("capital-gains-tax");
            const statement = document.getElementById("statement");

            // Extract values from result safely
            const longCapitalGainsTax = result.longCapitalGainsTax || 0;
            const securitiesTransactionTax = result.securitiesTransactionTax || 0;
            const taxSavingsAmount = result.taxSavingsAmount || 0;
            const message = result.message || "Details not available.";

            // Update the DOM
            capitalGainsTax.textContent = `₹${longCapitalGainsTax}`; // Update tax value
            statement.innerText = `${message} Securities Transaction Tax is ₹${securitiesTransactionTax} and tax savings amount is ₹${taxSavingsAmount}.`;
        }
    } else {
        console.error("Please fill in all required fields.");
    }
});
