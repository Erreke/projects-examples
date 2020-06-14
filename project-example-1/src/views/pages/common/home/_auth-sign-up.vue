<template>
  <form v-if="isActive" @submit.prevent="submitForm"
   class="trx_addons_popup_form trx_addons_popup_form_login
    sc_input_hover_iconed" method="post">
    <auth-input
      name="firstName"
      icon="user-alt"
      type="text"
      inputmode="search"
      :placeholder="$t('block-auth.placeholder-first-name')"
      :has-errors="firstNameErrorMessages.length > 0"
      :is-disabled="isFormProcessing"
      :is-required="true"
      :is-autofocused="true"
      v-model="firstName"
      @change="handleInput"
    />

    <auth-input
      name="email"
      icon="mail"
      type="email"
      inputmode="email"
      :placeholder="$t('block-auth.placeholder-email')"
      :has-errors="emailErrorMessages.length > 0"
      :is-disabled="isFormProcessing"
      :is-required="true"
      v-model="email"
      @change="handleInput"
    />

    <auth-input
      name="phone"
      icon="phone-2"
      type="tel"
      inputmode="tel"
      :placeholder="$t('block-auth.placeholder-phone')"
      :has-errors="phoneErrorMessages.length > 0"
      :is-disabled="isFormProcessing"
      :is-required="true"
      v-model="phone"
      v-phone
      @change="handleInput"
    />

    <!-- <auth-input
      name="bonusHolderNick"
      icon="user-alt"
      type="text"
      inputmode="search"
      :placeholder="$t('block-auth.placeholder-bonusholder')"
      :has-errors="bonusHolderNickErrorMessages.length > 0
       || bonusHolderNickOnMountErrorMessages.length > 0"
      :is-loading="isBonusHolderValidating"
      :is-disabled="isFormProcessing || isBonusHolderNickDefined"
      v-model="bonusHolderNick"
      @change="handleInput"
    /> -->

    <b-field>
      <b-switch
        v-model="isAgree"
        :disabled="isFormProcessing"
      ><span v-html="$t('block-auth.agreement')"></span></b-switch>
    </b-field>

    <div class="trx_addons_message_box is-fail" v-if="formErrorMessages.length">
      <ul v-if="formErrorMessages.length > 1">
        <li v-for="(item, key) in formErrorMessages" :key="key">{{ item }}</li>
      </ul>
      <span v-else>{{ formErrorMessages[0] }}</span>
    </div>

    <div class="trx_addons_popup_form_field trx_addons_popup_form_field_submit">
      <input
        type="submit"
        value="Регистрация"
        :disabled="isFormProcessing || formErrorMessages.length > 0"
        :class="['submit_button', {'loading': isFormProcessing }]"
      />
    </div>
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, minLength, maxLength, email,
} from 'vuelidate/lib/validators';

import i18nAlpha from '@/utils/validators/i18n-alpha';
import nickname from '@/utils/validators/nickname';
import phone from '@/utils/validators/phone';
import locale from '@/utils/validators/locale';
import alreadyInUse from '@/utils/validators/already-in-use';
import bonusHolderFound from '@/utils/validators/bonus-holder-found';
import requiredFromServer from '@/utils/validators/required-from-server';
import invalidFromServer from '@/utils/validators/invalid-from-server';
import minLengthFromServer from '@/utils/validators/min-length-from-server';
import maxLengthFromServer from '@/utils/validators/max-length-from-server';

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;
const BONUS_HOLDER_NICK_MIN_LENGTH = 2;
const BONUS_HOLDER_NICK_MAX_LENGTH = 32;

export default {
  name: 'HomePageAuthSignUp',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    AuthInput: () => import('@/views/pages/common/home/_auth-input.vue'),
  },

  data() {
    return {
      firstName: '',
      email: '',
      phone: '',
      // bonusHolderNick: '',
      // isBonusHolderNickDefined: false,
      locale: 'ru',
      isAgree: false,
    };
  },

  validations: {
    firstName: {
      required,
      i18nAlpha,
      minLength: minLength(FIRST_NAME_MIN_LENGTH),
      maxLength: maxLength(FIRST_NAME_MAX_LENGTH),
      requiredFromServer: requiredFromServer('first-name', ['auth', 'sign-up', 'errors']),
      invalidFromServer: invalidFromServer('first-name', ['auth', 'sign-up', 'errors']),
      minLengthFromServer: minLengthFromServer('first-name', ['auth', 'sign-up', 'errors'], FIRST_NAME_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('first-name', ['auth', 'sign-up', 'errors'], FIRST_NAME_MAX_LENGTH),
    },
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
      emailAlreadyInUse: alreadyInUse('email', ['auth', 'sign-up', 'errors']),
      requiredFromServer: requiredFromServer('email', ['auth', 'sign-up', 'errors']),
      invalidFromServer: invalidFromServer('email', ['auth', 'sign-up', 'errors']),
      minLengthFromServer: minLengthFromServer('email', ['auth', 'sign-up', 'errors'], EMAIL_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('email', ['auth', 'sign-up', 'errors'], EMAIL_MAX_LENGTH),
    },
    phone: {
      required,
      phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
      phoneAlreadyInUse: alreadyInUse('phone-number', ['auth', 'sign-up', 'errors']),
      requiredFromServer: requiredFromServer('phone-number', ['auth', 'sign-up', 'errors']),
      invalidFromServer: invalidFromServer('phone-number', ['auth', 'sign-up', 'errors']),
      minLengthFromServer: minLengthFromServer('phone-number', ['auth', 'sign-up', 'errors'], PHONE_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('phone-number', ['auth', 'sign-up', 'errors'], PHONE_MAX_LENGTH),
    },
    locale: {
      required,
      locale,
      requiredFromServer: requiredFromServer('locale', ['auth', 'sign-up', 'errors']),
      invalidFromServer: invalidFromServer('locale', ['auth', 'sign-up', 'errors']),
    },
    // bonusHolderNick: {
    //   nickname,
    //   minLength: minLength(BONUS_HOLDER_NICK_MIN_LENGTH),
    //   maxLength: maxLength(BONUS_HOLDER_NICK_MAX_LENGTH),
    //   bonusHolderFound: bonusHolderFound('bonus-holder-nick', ['auth', 'sign-up', 'errors']),
    //   invalidFromServer: invalidFromServer('bonus-holder-nick', ['auth', 'sign-up', 'errors']),
    //   minLengthFromServer: minLengthFromServer('bonus-holder-nick', ['auth', 'sign-up', 'errors'], BONUS_HOLDER_NICK_MIN_LENGTH),
    //   maxLengthFromServer: maxLengthFromServer('bonus-holder-nick', ['auth', 'sign-up', 'errors'], BONUS_HOLDER_NICK_MAX_LENGTH),
    // },
    // bonusHolderNickOnMount: {
    //   bonusHolderFound: bonusHolderFound('bonus-holder-nick', ['auth', 'sign-up', 'bonusHolderValidatingErrors']),
    //   invalidFromServer: invalidFromServer('bonus-holder-nick', ['auth', 'sign-up', 'bonusHolderValidatingErrors']),
    //   minLengthFromServer: minLengthFromServer('bonus-holder-nick', ['auth', 'sign-up', 'bonusHolderValidatingErrors'], BONUS_HOLDER_NICK_MIN_LENGTH),
    //   maxLengthFromServer: maxLengthFromServer('bonus-holder-nick', ['auth', 'sign-up', 'bonusHolderValidatingErrors'], BONUS_HOLDER_NICK_MAX_LENGTH),
    // },
    isAgree: {
      checked: value => value === true,
    },
  },

  computed: {
    ...mapState('auth/sign-up', {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing,
      isBonusHolderValidating: state => state.isBonusHolderValidating,
      bonusHolderValidatingResult: state => state.bonusHolderValidatingResult,
      bonusHolderValidatingErrors: state => state.bonusHolderValidatingErrors,
    }),

    firstNameErrorMessages() {
      const errors = [];

      if (!this.$v.firstName.$dirty) return errors;

      if (!this.$v.firstName.required) errors.push(this.$t('block-errors.first-name-is-required'));
      if (!this.$v.firstName.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-first-name'));
      if (!this.$v.firstName.minLength) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.firstName.$params.minLength.min,
        }));
      }
      if (!this.$v.firstName.maxLength) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.firstName.$params.maxLength.max,
        }));
      }
      if (!this.$v.firstName.requiredFromServer) errors.push(this.$t('block-errors.first-name-is-required'));
      if (!this.$v.firstName.invalidFromServer) errors.push(this.$t('block-errors.first-name-must-be-valid'));
      if (!this.$v.firstName.minLengthFromServer) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.firstName.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.firstName.maxLengthFromServer) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.firstName.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    emailErrorMessages() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.required) errors.push(this.$t('block-errors.email-is-required'));
      if (!this.$v.email.email) errors.push(this.$t('block-errors.email-must-be-valid'));
      if (!this.$v.email.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.email.$params.minLength.min,
        }));
      }
      if (!this.$v.email.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.email.$params.maxLength.max,
        }));
      }
      if (!this.$v.email.emailAlreadyInUse) errors.push(this.$t('block-errors.email-already-in-use'));
      if (!this.$v.email.requiredFromServer) errors.push(this.$t('block-errors.email-is-required'));
      if (!this.$v.email.invalidFromServer) errors.push(this.$t('block-errors.email-must-be-valid'));
      if (!this.$v.email.minLengthFromServer) {
        errors.push(this.$t('block-errors.email-must-be-min-length', {
          length: this.$v.email.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.email.maxLengthFromServer) {
        errors.push(this.$t('block-errors.email-must-be-max-length', {
          length: this.$v.email.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    phoneErrorMessages() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      if (!this.$v.phone.required) errors.push(this.$t('block-errors.phone-is-required'));
      if (!this.$v.phone.phone) errors.push(this.$t('block-errors.field-must-be-phone'));
      if (!this.$v.phone.minLength) {
        errors.push(this.$t('block-errors.phone-must-be-min-length', {
          length: this.$v.phone.$params.minLength.min,
        }));
      }
      if (!this.$v.phone.maxLength) {
        errors.push(this.$t('block-errors.phone-must-be-max-length', {
          length: this.$v.phone.$params.maxLength.max,
        }));
      }
      if (!this.$v.phone.phoneAlreadyInUse) errors.push(this.$t('block-errors.phone-already-in-use'));
      if (!this.$v.phone.requiredFromServer) errors.push(this.$t('block-errors.phone-is-required'));
      if (!this.$v.phone.invalidFromServer) errors.push(this.$t('block-errors.phone-must-be-valid'));
      if (!this.$v.phone.minLengthFromServer) {
        errors.push(this.$t('block-errors.phone-must-be-min-length', {
          length: this.$v.phone.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.phone.maxLengthFromServer) {
        errors.push(this.$t('block-errors.phone-must-be-max-length', {
          length: this.$v.phone.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    // bonusHolderNickErrorMessages() {
    //   const errors = [];

    //   if (!this.$v.bonusHolderNick.$dirty) return errors;

    //   if (!this.$v.bonusHolderNick.nickname) errors.push(this.$t('block-errors.bonus-holder-must-be-valid'));
    //   if (!this.$v.bonusHolderNick.minLength) {
    //     errors.push(this.$t('block-errors.bonus-holder-must-be-min-length', {
    //       length: this.$v.bonusHolderNick.$params.minLength.min,
    //     }));
    //   }
    //   if (!this.$v.bonusHolderNick.maxLength) {
    //     errors.push(this.$t('block-errors.bonus-holder-must-be-max-length', {
    //       length: this.$v.bonusHolderNick.$params.maxLength.max,
    //     }));
    //   }

    //   if (!this.$v.bonusHolderNick.bonusHolderFound) errors.push(this.$t('block-errors.bonus-holder-not-found'));
    //   if (!this.$v.bonusHolderNick.invalidFromServer) errors.push(this.$t('block-errors.bonus-holder-must-be-valid'));
    //   if (!this.$v.bonusHolderNick.minLengthFromServer) {
    //     errors.push(this.$t('block-errors.bonus-holder-must-be-min-length', {
    //       length: this.$v.bonusHolderNick.$params.minLengthFromServer.min,
    //     }));
    //   }
    //   if (!this.$v.bonusHolderNick.maxLengthFromServer) {
    //     errors.push(this.$t('block-errors.bonus-holder-must-be-max-length', {
    //       length: this.$v.bonusHolderNick.$params.maxLengthFromServer.max,
    //     }));
    //   }

    //   return errors;
    // },

    // bonusHolderNickOnMountErrorMessages() {
    //   const errors = [];

    //   if (!this.$v.bonusHolderNickOnMount.bonusHolderFound) errors.push(this.$t('block-errors.bonus-holder-not-found'));
    //   if (!this.$v.bonusHolderNickOnMount.invalidFromServer) errors.push(this.$t('block-errors.bonus-holder-must-be-valid'));
    //   if (!this.$v.bonusHolderNickOnMount.minLengthFromServer) {
    //     errors.push(this.$t('block-errors.bonus-holder-must-be-min-length', {
    //       length: this.$v.bonusHolderNickOnMount.$params.minLengthFromServer.min,
    //     }));
    //   }
    //   if (!this.$v.bonusHolderNickOnMount.maxLengthFromServer) {
    //     errors.push(this.$t('block-errors.bonus-holder-must-be-max-length', {
    //       length: this.$v.bonusHolderNickOnMount.$params.maxLengthFromServer.max,
    //     }));
    //   }

    //   return errors;
    // },

    localeErrorMessages() {
      const errors = [];

      if (!this.$v.locale.$dirty) return errors;

      if (!this.$v.locale.required) errors.push(this.$t('block-errors.locale-is-required'));
      if (!this.$v.locale.locale) errors.push(this.$t('block-errors.locale-must-be-valid'));
      if (!this.$v.locale.requiredFromServer) errors.push(this.$t('block-errors.locale-is-required'));
      if (!this.$v.locale.invalidFromServer) errors.push(this.$t('block-errors.locale-must-be-valid'));

      return errors;
    },

    isAgreeErrorMessages() {
      const errors = [];

      if (!this.$v.isAgree.$dirty) return errors;
      if (!this.$v.isAgree.checked) errors.push(this.$t('block-errors.is-not-agreed'));

      return errors;
    },

    formErrorMessages() {
      const errors = [
        ...this.firstNameErrorMessages,
        ...this.emailErrorMessages,
        ...this.phoneErrorMessages,
        // ...this.bonusHolderNickErrorMessages,
        // ...this.bonusHolderNickOnMountErrorMessages,
        ...this.localeErrorMessages,
        ...this.isAgreeErrorMessages,
      ];

      if (this.formErrors.indexOf('operation-not-allowed') > -1) errors.push(this.$t('block-errors.operation-not-allowed'));
      if (this.formErrors.indexOf('network-request-failed') > -1) errors.push(this.$t('block-errors.network-request-failed'));
      if (this.formErrors.indexOf('invalid-argument') > -1) errors.push(this.$t('block-errors.invalid-argument'));
      if (this.formErrors.indexOf('unknown-error') > -1) errors.push(this.$t('block-errors.unknown-error'));

      return errors;
    },
  },

  methods: {
    ...mapActions('auth/sign-up', {
      signUp: 'SIGN_UP',
      validateBonusHolder: 'VALIDATE_BONUS_HOLDER',
    }),

    ...mapMutations('auth/sign-up', {
      clearError: 'CLEAR_ERROR',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.signUp({
          email: this.email,
          phone: this.phone,
          firstName: this.firstName,
          // bonusHolderNick: this.bonusHolderNick,
          locale: this.locale,
        })
          .then((result) => {
            if (result.success) {
              this.clearLocalStorage();
              this.clearFields();
            }
          });
      }
    },

    saveToLocalStorage(key) {
      localStorage.setItem(key, this[key]);
    },

    handleInput(key) {
      this.saveToLocalStorage(key);
      this.clearError(key);
      this.$v[key].$reset();
    },

    clearLocalStorage() {
      localStorage.removeItem('firstName');
      localStorage.removeItem('email');
      localStorage.removeItem('phone');
      localStorage.removeItem('locale');
      // localStorage.removeItem('bonusHolderNick');
    },

    clearFields() {
      this.firstName = '';
      this.email = '';
      this.phone = '';
      this.locale = 'ru';
      // this.bonusHolderNick = '';
      // this.isBonusHolderNickDefined = false;
    },

    initFields() {
      this.firstName = localStorage.getItem('firstName') || '';
      this.email = localStorage.getItem('email') || '';
      this.phone = localStorage.getItem('phone') || '';
      this.locale = localStorage.getItem('locale') || 'ru';
      // this.bonusHolderNick = this.$route.params.bonusHolderNick || localStorage.getItem('bonusHolderNick') || '';
      // this.isBonusHolderNickDefined = !!this.$route.params.bonusHolderNick || !!localStorage.getItem('bonusHolderNick') || false;
    },
  },

  mounted() {
    this.initFields();

    // if (this.bonusHolderNick) {
    //   this.validateBonusHolder(this.bonusHolderNick)
    //     .then(() => {
    //       this.$v.bonusHolderNickOnMount.$touch();
    //     });
    // }
  },
};
</script>
