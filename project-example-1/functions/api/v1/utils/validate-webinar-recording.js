const {
  VALID_EMAIL_REGEX,
  VALID_PHONE_REGEX,
  VALID_NAME_REGEX,
 } = require('../../../config');

// const isBonusHolderExist = require('./is-bonus-holder-exist');
// const isEmailAlreadyInUse = require('./is-email-already-in-use');
// const isPhoneAlreadyInUse = require('./is-phone-already-in-use');

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;

module.exports = async function validate(firstName, email, phone) {
  const errors = [];

  if (!firstName) {
    errors.push('required-first-name');
  }

  if (!email) {
    errors.push('required-email');
  }

  if (!phone) {
    errors.push('required-phone');
  }

  if (firstName) {
    const validFirstNameRegex = new RegExp(VALID_NAME_REGEX);

    if (!validFirstNameRegex.test(firstName)) {
      errors.push('invalid-first-name');
    }

    if (firstName.length < FIRST_NAME_MIN_LENGTH) {
      errors.push('invalid-first-name-minimum-length');
    }

    if (firstName.length > FIRST_NAME_MAX_LENGTH) {
      errors.push('invalid-first-name-maximum-length');
    }
  }

  if (email) {
    const validEmailRegex = new RegExp(VALID_EMAIL_REGEX);

    if (!validEmailRegex.test(email)) {
      errors.push('invalid-email');
    }

    // const isInUse = await isEmailAlreadyInUse(email);

    // if (isInUse) {
    //   errors.push('email-already-in-use');
    // }

    if (email.length < EMAIL_MIN_LENGTH) {
      errors.push('invalid-email-minimum-length');
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      errors.push('invalid-email-maximum-length');
    }
  }

  if (phone) {
    const validPhoneRegex = new RegExp(VALID_PHONE_REGEX);

    if (!validPhoneRegex.test(phone)) {
      errors.push('invalid-phone');
    }

    // const isInUse = await isPhoneAlreadyInUse(phone);

    // if (isInUse) {
    //   errors.push('phone-already-in-use');
    // }

    if (phone.length < PHONE_MIN_LENGTH) {
      errors.push('invalid-phone-minimum-length');
    }

    if (phone.length > PHONE_MAX_LENGTH) {
      errors.push('invalid-phone-maximum-length');
    }
  }

  return errors;
};
