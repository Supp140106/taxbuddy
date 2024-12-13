// Exporting old regime tax calculator as default
function income_taxcalcold(taxableincome, age) {
    if (age < 60) {
        if (taxableincome <= 250000) {
            return 0;
        } else if (taxableincome > 250000 && taxableincome <= 500000) {
            return 0.05 * taxableincome;
        } else if (taxableincome > 500000 && taxableincome <= 1000000) {
            return 0.2 * taxableincome;
        } else {
            return 0.3 * taxableincome;
        }
    } else if (age >= 60 && age < 80) {
        if (taxableincome <= 300000) {
            return 0;
        } else if (taxableincome > 300000 && taxableincome <= 500000) {
            return 0.05 * taxableincome;
        } else if (taxableincome > 500000 && taxableincome <= 1000000) {
            return 0.2 * taxableincome;
        } else {
            return 0.3 * taxableincome;
        }
    } else {
        if (taxableincome <= 500000) {
            return 0;
        } else if (taxableincome > 500000 && taxableincome <= 1000000) {
            return 0.2 * taxableincome;
        } else {
            return 0.3 * taxableincome;
        }
    }
}

// Exporting new regime tax calculator as a named export according to the FY(2024-2025) {AY 2025-26}
function income_taxcalcnew_ay2526(tax) {
    taxableincome=tax-75000;
    if (taxableincome <= 300000) {
        return 0;
    } else if (taxableincome > 300000 && taxableincome <= 700000) {
        return 0.05 * taxableincome;
    } else if (taxableincome > 700000 && taxableincome <= 1000000) {
        return 0.1 * taxableincome;
    } else if (taxableincome > 1000000 && taxableincome <= 1200000) {
        return 0.15 * taxableincome;
    } else if (taxableincome > 1200000 && taxableincome <= 1500000) {
        return 0.2 * taxableincome;
    } else {
        return 0.3 * taxableincome;
    }
}

// Exporting new regime tax calculator as a named export according to the {AY 2024-25}
function income_taxcalcnew_ay2425(tax) {
    taxableincome=tax-50000;
    if (taxableincome <= 300000) {
        return 0;
    } else if (taxableincome > 300000 && taxableincome <= 600000) {
        return 0.05 * taxableincome;
    } else if (taxableincome > 600000 && taxableincome <= 900000) {
        return 0.1 * taxableincome;
    } else if (taxableincome > 900000 && taxableincome <= 1200000) {
        return 0.15 * taxableincome;
    } else if (taxableincome > 1200000 && taxableincome <= 1500000) {
        return 0.2 * taxableincome;
    } else {
        return 0.3 * taxableincome;
    }
}

module.exports = {
    income_taxcalcold,
    income_taxcalcnew_ay2425,
    income_taxcalcnew_ay2526
}