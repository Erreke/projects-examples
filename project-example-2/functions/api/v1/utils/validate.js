const {
  VALID_EMAIL_REGEX,
  VALID_PHONE_REGEX,
  VALID_NICKNAME_REGEX,
  VALID_LOCALE_REGEX,
  VALID_NAME_REGEX
} = require("../../../config");

const isBonusHolderExist = require("./is-bonus-holder-exist");
const isEmailAlreadyInUse = require("./is-email-already-in-use");
const isPhoneAlreadyInUse = require("./is-phone-already-in-use");

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;
const BONUS_HOLDER_NICK_MIN_LENGTH = 2;
const BONUS_HOLDER_NICK_MAX_LENGTH = 32;

async function validateRegistrationFields(
  firstName,
  email,
  phone,
  bonusHolderNick,
  locale
) {
  const errors = [];

  if (!firstName) {
    errors.push("required-first-name");
  }

  if (!email) {
    errors.push("required-email");
  }

  if (!phone) {
    errors.push("required-phone-number");
  }

  if (!locale) {
    errors.push("required-locale");
  }

  if (firstName) {
    const validFirstNameRegex = new RegExp(VALID_NAME_REGEX);

    if (!validFirstNameRegex.test(firstName)) {
      errors.push("invalid-first-name");
    }

    if (firstName.length < FIRST_NAME_MIN_LENGTH) {
      errors.push("invalid-first-name-minimum-length");
    }

    if (firstName.length > FIRST_NAME_MAX_LENGTH) {
      errors.push("invalid-first-name-maximum-length");
    }
  }

  if (email) {
    const validEmailRegex = new RegExp(VALID_EMAIL_REGEX);

    if (!validEmailRegex.test(email)) {
      errors.push("invalid-email");
    }

    const isInUse = await isEmailAlreadyInUse(email);

    if (isInUse) {
      errors.push("email-already-in-use");
    }

    if (email.length < EMAIL_MIN_LENGTH) {
      errors.push("invalid-email-minimum-length");
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      errors.push("invalid-email-maximum-length");
    }
  }

  if (phone) {
    const validPhoneRegex = new RegExp(VALID_PHONE_REGEX);

    if (!validPhoneRegex.test(phone)) {
      errors.push("invalid-phone-number");
    }

    const isInUse = await isPhoneAlreadyInUse(phone);

    if (isInUse) {
      errors.push("phone-number-already-in-use");
    }

    if (phone.length < PHONE_MIN_LENGTH) {
      errors.push("invalid-phone-number-minimum-length");
    }

    if (phone.length > PHONE_MAX_LENGTH) {
      errors.push("invalid-phone-number-maximum-length");
    }
  }

  if (bonusHolderNick) {
    const validNicknameRegex = new RegExp(VALID_NICKNAME_REGEX);
    const isBonusHolderNickValid = validNicknameRegex.test(bonusHolderNick);
    let isBonusHolderNickLengthValid = true;

    if (!isBonusHolderNickValid) {
      errors.push("invalid-bonus-holder-nick");
    }

    if (bonusHolderNick.length < BONUS_HOLDER_NICK_MIN_LENGTH) {
      errors.push("invalid-bonus-holder-nick-minimum-length");
      isBonusHolderNickLengthValid = false;
    }

    if (bonusHolderNick.length > BONUS_HOLDER_NICK_MAX_LENGTH) {
      errors.push("invalid-bonus-holder-nick-maximum-length");
      isBonusHolderNickLengthValid = false;
    }

    if (isBonusHolderNickValid && isBonusHolderNickLengthValid) {
      const isExist = await isBonusHolderExist(bonusHolderNick);
      if (!isExist) {
        errors.push("does-not-exist-bonus-holder-nick");
      }
    }
  }

  if (locale) {
    const validLocaleRegex = new RegExp(VALID_LOCALE_REGEX);

    if (!validLocaleRegex.test(locale)) {
      errors.push("invalid-locale");
    }
  }

  return errors;
}

async function validateRecoverEmailInProfileFields(email) {
  const errors = [];

  if (!email) {
    errors.push("required-email");
  }

  if (email) {
    const validEmailRegex = new RegExp(VALID_EMAIL_REGEX);

    if (!validEmailRegex.test(email)) {
      errors.push("invalid-email");
    }

    if (email.length < EMAIL_MIN_LENGTH) {
      errors.push("invalid-email-minimum-length");
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      errors.push("invalid-email-maximum-length");
    }
  }

  return errors;
}

module.exports = {
  validateRegistrationFields,
  validateRecoverEmailInProfileFields
};
