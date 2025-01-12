document.addEventListener("DOMContentLoaded", () => {
    const transactionTypeRadios = document.querySelectorAll("input[name='transactionType']");
    const buyingOptions = document.getElementById("buying-options");
    const sellingOptions = document.getElementById("selling-options");
    const calculateTaxButton = document.getElementById("calculate-tax");

    transactionTypeRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.value === "buying") {
                buyingOptions.classList.remove("hidden");
                sellingOptions.classList.add("hidden");
            } else if (radio.value === "selling") {
                sellingOptions.classList.remove("hidden");
                buyingOptions.classList.add("hidden");
            }
        });
    });

    calculateTaxButton.addEventListener("click", (e) => {
        e.preventDefault();
        const transactionType = document.querySelector("input[name='transactionType']:checked");
        if (!transactionType) {
            alert("Please select if you are buying or selling a property.");
            return;
        }

        if (transactionType.value === "buying") {
            const propertyValue = document.getElementById("property-value").value;
            const underConstruction = document.querySelector("input[name='underConstruction']:checked");
            const propertyType = document.getElementById("property-type").value;

            if (!propertyValue || !underConstruction || !propertyType) {
                alert("Please fill all the fields for buying a property.");
                return;
            }

        } else if (transactionType.value === "selling") {
            const purchasePrice = document.getElementById("purchase-price").value;
            const improvementCost = document.getElementById("improvement-cost").value;
            const purchaseDate = document.getElementById("purchase-date").value;

            if (!purchasePrice || !improvementCost || !purchaseDate) {
                alert("Please fill all the fields for selling a property.");
                return;
            }

        }
    });
});