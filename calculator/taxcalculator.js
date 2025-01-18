// Exporting old regime tax calculator as default
function income_taxcalcold(taxableincome, age) {
    if (age < 60) {
        if (taxableincome <= 250000) {
            return 0;
        } else if (taxableincome > 250000 && taxableincome <= 500000) {
            return 1.044*(0.05 * (taxableincome-250000));
        } else if (taxableincome > 500000 && taxableincome <= 1000000) {
            return 1.044*(12500+(0.2 * (taxableincome-500000)));
        } else if (taxableincome > 1000000 && taxableincome <= 5000000){
            return 1.044*(112500+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 5000000 && taxableincome <= 10000000){
            return 1.144*(112500+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 10000000 && taxableincome <= 20000000){
            return 1.194*(112500+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 20000000 && taxableincome <= 50000000){
            return 1.294*(112500+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 50000000 && taxableincome <= 100000000){
            return 1.414*(112500+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 100000000){
            return 1.414*(112500+(0.3 * (taxableincome-1000000)));
        }

    } else if (age >= 60 && age < 80) {
        if (taxableincome <= 300000) {
            return 0;
        } else if (taxableincome > 300000 && taxableincome <= 500000) {
            return 1.044*(0.05 * (taxableincome-300000));
        } else if (taxableincome > 500000 && taxableincome <= 1000000) {
            return 1.044*(10000+(0.2 *( taxableincome-50000)));
        } else if (taxableincome > 1000000 && taxableincome <= 5000000){
            return 1.044*(110000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 5000000 && taxableincome <= 10000000){
            return 1.144*(110000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 10000000 && taxableincome <= 20000000){
            return 1.194*(110000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 20000000 && taxableincome <= 50000000){
            return 1.294*(110000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 50000000 && taxableincome <= 100000000){
            return 1.414*(110000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 100000000){
            return 1.414*(110000+(0.3 * (taxableincome-1000000)));
        }
    } else {
        if (taxableincome <= 500000) {
            return 0;
        } else if (taxableincome > 500000 && taxableincome <= 1000000) {
            return 0.2 * (taxableincome-500000);
        } else if (taxableincome > 1000000 && taxableincome <= 5000000){
            return 1.044*(100000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 5000000 && taxableincome <= 10000000){
            return 1.144*(100000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 10000000 && taxableincome <= 20000000){
            return 1.194*(100000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 20000000 && taxableincome <= 50000000){
            return 1.294*(100000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 50000000 && taxableincome <= 100000000){
            return 1.414*(100000+(0.3 * (taxableincome-1000000)));
        } else if (taxableincome > 100000000){
            return 1.414*(100000+(0.3 * (taxableincome-1000000)));
        
    }
}}

// Exporting new regime tax calculator as a named export according to the FY(2024-2025) {AY 2025-26}
function income_taxcalcnew_ay2526(taxableincome) {
    
    if (taxableincome <= 300000) {
        return 0;
    } else if (taxableincome > 300000 && taxableincome <= 700000) {
        return 1.044*(0.05 * (taxableincome-300000));
    } else if (taxableincome > 700000 && taxableincome <= 1000000) {
        return 1.044*(20000+(0.1 *( taxableincome-700000)));
    } else if (taxableincome > 1000000 && taxableincome <= 1200000) {
        return 1.044*(50000+(0.15 * (taxableincome-1000000)));
    } else if (taxableincome > 1200000 && taxableincome <= 1500000 ) {
        return 1.044*((80000+(0.2 * (taxableincome-1200000))));
    } else if (taxableincome > 1500000 && taxableincome<5000000){
        return 1.044*(140000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 5000000 && taxableincome <= 10000000){
        return 1.144*(140000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 10000000 && taxableincome <= 20000000){
        return 1.194*(140000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 20000000 && taxableincome <= 50000000){
        return 1.294*(140000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 50000000 && taxableincome <= 100000000){
        return 1.294*(140000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 100000000){
        return 1.294*(140000+(0.3 * (taxableincome-1500000)));
    }}


// Exporting new regime tax calculator as a named export according to the {AY 2024-25}
function income_taxcalcnew_ay2425(taxableincome) {
    
    if (taxableincome <= 300000) {
        return 0;
    } else if (taxableincome > 300000 && taxableincome <= 600000) {
        return 1.044*(0.05 * (taxableincome-300000));
    } else if (taxableincome > 600000 && taxableincome <= 900000) {
        return 1.044*(15000+(0.1 *( taxableincome-600000)));
    } else if (taxableincome > 900000 && taxableincome <= 1200000) {
        return 1.044*(45000+(0.15 * (taxableincome-900000)));
    } else if (taxableincome > 1200000 && taxableincome <= 1500000 ) {
        return 1.044*((90000+(0.2 * (taxableincome-1200000))));
    } else if (taxableincome > 1500000 && taxableincome<5000000){
        return 1.044*(150000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 5000000 && taxableincome <= 10000000){
        return 1.144*(150000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 10000000 && taxableincome <= 20000000){
        return 1.194*(150000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 20000000 && taxableincome <= 50000000){
        return 1.294*(150000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 50000000 && taxableincome <= 100000000){
        return 1.294*(150000+(0.3 * (taxableincome-1500000)));
    } else if (taxableincome > 100000000){
        return 1.294*(150000+(0.3 * (taxableincome-1500000)));
    }
}

module.exports = {
    income_taxcalcold,
    income_taxcalcnew_ay2425,
    income_taxcalcnew_ay2526
}
