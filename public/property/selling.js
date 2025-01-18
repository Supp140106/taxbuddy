  document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("total-tax").textContent = `₹${totalTax.toLocaleString()}`;
    document.getElementById("statement").textContent = statement;
});

// Dialog box functionality
const optimizeButton = document.getElementById("optimize");
const dialogBox = document.getElementById("dialog-box");
const closeDialog = document.getElementById("close-dialog");

optimizeButton.addEventListener("click", () => {
    dialogBox.style.display = "flex";
    document.getElementById("suggestion-text").textContent =
        "Consider consulting a tax advisor to reduce your property sale tax liability.";
});

closeDialog.addEventListener("click", () => {
    dialogBox.style.display = "none";
});