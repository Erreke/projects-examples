const {
  VALID_EMAIL_REGEX,
  VALID_PHONE_REGEX,
  VALID_NICKNAME_REGEX,
  VALID_LOCALE_REGEX,
  VALID_NAME_REGEX,
} = require('../../../config');

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 32;

export default async function validate(firstName, secondName, phone, whatsapp, email, city) {
  const errors = [];

  if (!firstName) {
    errors.push('required-first-name');
  }

  if (!phone) {
    errors.push('required-phone');
  }

  if (firstName && phone) {
    const validNameRegex = new RegExp(VALID_NAME_REGEX);
    const validPhoneRegex = new RegExp(VALID_PHONE_REGEX);

    if (!validNameRegex.test(firstName)) {
      errors.push('invalid-first-name');
    }

    if (!validPhoneRegex.test(phone)) {
      errors.push('invalid-phone');
    }

    if (firstName.length < NAME_MIN_LENGTH) {
      errors.push('invalid-first-name-minimum-length');
    }

    if (firstName.length > NAME_MAX_LENGTH) {
      errors.push('invalid-first-name-maximum-length');
    }

    if (phone.length < PHONE_MIN_LENGTH) {
      errors.push('invalid-phone-minimum-length');
    }

    if (phone.length > PHONE_MAX_LENGTH) {
      errors.push('invalid-phone-maximum-length');
    }
  }

  return errors;
};
