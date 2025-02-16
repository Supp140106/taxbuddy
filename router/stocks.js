const express = require('express');
const moment = require('moment'); // Import moment.js
const router = express.Router();

router.post('/calculate', (req, res) => {
  const {
    purchasePrice,
    salePrice,
    numberOfStocks,
    listedShare,
    purchaseDate
  } = req.body;

  // Validate input
  if (!purchasePrice || !salePrice || !numberOfStocks || !purchaseDate || listedShare === undefined) {
    return res.status(400).send({ error: 'All inputs (purchasePrice, salePrice, numberOfStocks, listedShare, purchaseDate) are required.' });
  }

  // Convert inputs to numbers
  const purchasePriceNum = parseFloat(purchasePrice);
  const salePriceNum = parseFloat(salePrice);
  const numberOfStocksNum = parseInt(numberOfStocks);

  if (isNaN(purchasePriceNum) || isNaN(salePriceNum) || isNaN(numberOfStocksNum)) {
    return res.status(400).send({ error: 'Invalid numerical inputs for purchasePrice, salePrice, or numberOfStocks.' });
  }

  // Parse and validate the purchase date
  const currentDate = moment();
  const purchaseDateMoment = moment(purchaseDate, 'YYYY-MM-DD');
  if (!purchaseDateMoment.isValid()) {
    return res.status(400).send({ error: 'Invalid purchase date format. Use YYYY-MM-DD.' });
  }

  const period = moment.duration(currentDate.diff(purchaseDateMoment));
  const yearsHeld = period.asYears();

  // Clone the purchase date moment before adding years
  const oneYearAhead = purchaseDateMoment.clone().add(1, 'years');
  const threeYearsAhead = purchaseDateMoment.clone().add(3, 'years');

  // Define constants
  const shortTermTaxRateListed = 0.15;
  const longTermTaxRateListed = 0.1;
  const shortTermTaxRateUnlisted = 0.3;
  const longTermTaxRateUnlisted = 0.2;
  const securitiesTransactionTax = 0.1;

  // Calculate capital gain
  const capitalGain = numberOfStocksNum * (salePriceNum - purchasePriceNum);

  let taxDetails = {};

  if (listedShare.toLowerCase() === 'yes') {
    if (yearsHeld < 1) {
      const longCapitalGainsTax = +(shortTermTaxRateListed * capitalGain).toFixed(2);
      taxDetails = {
        longCapitalGainsTax,
        message: `You will have to pay Rs ${longCapitalGainsTax} as short-term capital gains tax.`,
        taxSavingsDate: oneYearAhead.format('YYYY-MM-DD'),
        taxSavingsAmount: +(0.05 * capitalGain).toFixed(2),
        securitiesTransactionTax: +(securitiesTransactionTax * salePriceNum).toFixed(2)
      };
    } else {
      if (capitalGain > 100000) {
        const longCapitalGainsTax = +(longTermTaxRateListed * capitalGain).toFixed(2);
        taxDetails = {
          longCapitalGainsTax,
          message: `You will have to pay Rs ${longCapitalGainsTax} as long-term capital gains tax.`,
          securitiesTransactionTax: +(securitiesTransactionTax * salePriceNum).toFixed(2)
        };
      } else {
        taxDetails = {
          message: 'You do not have to pay any type of taxes on this transaction of shares.',
          securitiesTransactionTax: +(securitiesTransactionTax * salePriceNum).toFixed(2)
        };
      }
    }
  } else {
    if (yearsHeld < 3) {
      const longCapitalGainsTax = +(shortTermTaxRateUnlisted * capitalGain).toFixed(2);
      taxDetails = {
        longCapitalGainsTax,
        message: `You will have to pay Rs ${longCapitalGainsTax} as short-term capital gains tax.As You have purchased a unlisted share, we would like to recommend you that from next time buy a listed share as they attract less taxes.`,
        taxSavingsDate: threeYearsAhead.format('YYYY-MM-DD'),
        taxSavingsAmount: +(0.05 * capitalGain).toFixed(2),
        securitiesTransactionTax: +(securitiesTransactionTax * salePriceNum).toFixed(2)
      };
    } else {
      if (capitalGain > 100000) {
        const longCapitalGainsTax = +(longTermTaxRateUnlisted * capitalGain).toFixed(2);
        taxDetails = {
          longCapitalGainsTax,
          message: `You will have to pay Rs ${longCapitalGainsTax} as long-term capital gains tax.As You have purchased a unlisted share, we would like to recommend you that from next time buy a listed share as they attract less taxes.`,
          securitiesTransactionTax: +(securitiesTransactionTax * salePriceNum).toFixed(2)
        };
      } else {
        taxDetails = {
          message: 'You do not have to pay any type of taxes on this transaction of shares.',
          securitiesTransactionTax: +(securitiesTransactionTax * salePriceNum).toFixed(2)
        };
      }
    }
  }

  res.status(200).send(taxDetails);
});

module.exports = router;
