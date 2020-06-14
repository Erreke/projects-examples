const getProfileCreatedDateById = require('../../utils/get-profile-created-date-by-id');
const getUserDiscountDeadlineDate = require('../../utils/get-user-discount-deadline-date');
const hasUserDiscount = require('../../utils/has-user-discount');
const getPackageFromQueue = require('../../utils/get-package-from-queue');
const getInstimePaymentUrl = require('../../utils/get-instime-payment-url');
const changeSelectedPackage = require('../../utils/change-selected-package');
const setUserBusinessPackageSelectedState = require('../../utils/set-user-business-package-selected-state');

function validate(uid, packageName) {
  const errors = [];

  if (!uid) {
    errors.push('required-uid');
  }

  if (!packageName) {
    errors.push('required-package-name');
  }

  return errors;
}

module.exports = async function saveSelectedPackageAndGetPayUrl (req, res) {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const uid = req.body.uid || null;
    const packageName = req.body.packageName || null;

    const errors = validate(uid, packageName);

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors,
      };
    } else {
      const profileCreatedDate = await getProfileCreatedDateById(uid);
      const discountDeadlineDate = await getUserDiscountDeadlineDate(uid);
      const hasDiscount = hasUserDiscount(profileCreatedDate, discountDeadlineDate);
      const selectedPackage = await getPackageFromQueue(uid, packageName);
      const instimePaymentUrl = await getInstimePaymentUrl(selectedPackage.referralCode);
      const packageChangingResult = await changeSelectedPackage(selectedPackage, hasDiscount, instimePaymentUrl);
      const packageSelectingResult = await setUserBusinessPackageSelectedState(uid);

      status = 200;
      response = {
        success: true,
        hasDiscount,
        selectedPackage: selectedPackage.id,
        instimePaymentUrl,
        result: packageChangingResult && packageSelectingResult,
      };
    }

    res.status(status).send(response);
  }
  catch (error) {
    console.error(error);

    status = 400;
    response = {
      success: false,
      errors: ['unknown-error'],
    };

    res.status(status).send(response);
  }
}
