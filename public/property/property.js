let goback = document.getElementById("go-back")




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
          // Parse the JSON response if not redirected
          const jsonResponse = await response.json();
          return jsonResponse;
        } catch (error) {
          console.error("Failed to fetch data:", error);
          throw error;
        }
      }

    calculateTaxButton.addEventListener("click",async (e) => {
        e.preventDefault()
        const transactionType = document.querySelector("input[name='transactionType']:checked");
        if (!transactionType) {
            alert("Please select if you are buying or selling a property.");
            return;
        }

        if (transactionType.value === "buying") {
            const propertyValue = document.getElementById("property-value").value;
            let underConstruction = document.querySelector("input[name='underConstruction']:checked").value;
            const propertyType = document.getElementById("property-type").value;
            const statetype = document.getElementById("State").value;
            if (underConstruction == "yes") {
                underConstruction = true;
            } else {
                underConstruction = false;
            }
            if (propertyType == "property") {
                alert("Enter the property")
                return;
            }
            if (statetype == "Enter state") {
                alert("Select the State")
                return;
            }
            if (!propertyValue  || !propertyType || !statetype) {
                alert("Please fill all the fields for buying a property.");
                return;
            }

            let playload = {
                propertycost : parseFloat(propertyValue),
                type : propertyType,
                underconstruction : underConstruction,
                state : statetype
            }
            console.log(playload)
            document.getElementById("propertycal").style.display = "none";
            document.getElementById("loading-wrapper").style.display = "block"
            let a = await postFormData("/property/house/buying",playload);
            document.getElementById("stamp-duty").innerText = `₹${a.stampduty}`;
            document.getElementById("registration-charge").innerText = `₹${a.registration}`
            document.getElementById("gst").innerText = `₹${a.GST}`
            document.getElementById("tds").innerText = `₹${a.TDS}`
            document.getElementById("total-payable").innerText = `₹${a.totalPayable}`;
            document.getElementById("statement").innerText = `₹${a.statement}`
            document.getElementById("suggestion-text").innerText = `₹${a.optimisation}`
            document.getElementById("loading-wrapper").style.display = "none"
            document.getElementById("buyresult").style.display = "flex";
            goback.style.display = "block"
            a = JSON.stringify(a)
            localStorage.setItem("propertybuy",a)
            
        } else if (transactionType.value === "selling") {
            const purchasePrice = document.getElementById("purchase-price").value;
            const improvementCost = document.getElementById("improvement-cost").value;
            const purchaseDate = document.getElementById("purchase-date").value;
            const sellingprice = document.getElementById("selling-price").value;

            if (!purchasePrice || !improvementCost || !purchaseDate || !sellingprice) {
                alert("Please fill all the fields for selling a property.");
                return;
            }
            let playload = {
                purchaseDate :purchaseDate,
                purchasePrice : purchasePrice,
                salePrice : sellingprice,
                improvementCost : improvementCost
            }
            console.log(playload)
            document.getElementById("propertycal").style.display = "none"
            document.getElementById("loading-wrapper").style.display = "block"
            let a = await postFormData("/property/house/selling",playload);
            document.getElementById("total-tax").innerText = `${a.Tax}`
            document.getElementById("statement2").innerText = `${a.message}`
            document.getElementById("loading-wrapper").style.display = "none"
            document.getElementById("sellresult").style.display = "block"
            goback.style.display = "block"
            a = JSON.stringify(a)
            localStorage.setItem("propertysell",a);
            
        }
    });
});



goback.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default button behavior (if needed)
    event.target.style.display = "none"; // Hide the button
    document.getElementById("buyresult").style.display = "none";
    document.getElementById("propertycal").style.display = "block";
    document.getElementById("sellresult").style.display = "none"
});

