const { db } = require('../../../admin');
const { PRICES } = require('../../../config');

module.exports = function changeSelectedPackage(selectedPackage, hasDiscount, instimePaymentUrl) {
  const packageName = selectedPackage.packageName.toUpperCase();
  let regularPrice;
  let discountedPrice;

  regularPrice = PRICES[`${packageName}_REGULAR_PRICE`];
  discountedPrice = PRICES[`${packageName}_DISCOUNTED_PRICE`];

  return db
    .collection('business_places')
    .doc(selectedPackage.id)
    .update({
      hasDiscount,
      regularPrice,
      discountedPrice,
      instimePaymentUrl,
    });
}
