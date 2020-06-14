<template>
  <div class="wpb_wrapper sign-up-to-webinar">
    <div class="sc_layouts_item">
      <div class="
        widget_area sc_widget_contacts
        vc_widget_contacts wpb_content_element
        vc_custom_1521451773786
      ">
        <aside class="widget widget_contacts">
          <div class="contacts_wrap">
            <div class="contacts_description" :style="`text-align: ${textAlign}`">
              <p v-html="text"></p>
            </div>
          </div>
        </aside>
      </div>
    </div>
    <div class="wpb_text_column wpb_content_element sign-up-to-webinar__form">
      <div class="wpb_wrapper">
        <form class="mc4wp-form mc4wp-form-331" method="post" @submit.prevent="submitForm">
          <div class="mc4wp-form-fields">
            <input
              @input="clearFieldError('firstName')"
              :disabled="isFormProcessing"
              type="text"
              name="firstName"
              placeholder="Имя"
              class="fill_inited"
              v-model="firstName"
            />
            <input
              @input="clearFieldError('phone')"
              :disabled="isFormProcessing"
              type="tel"
              name="phone"
              placeholder="Телефон"
              class="fill_inited"
              v-model="phone"
              inputmode="tel"
            />
            <button
              :disabled="isFormProcessing"
              :class="['hoverex-button submit', { 'loading': isFormProcessing }]"
            >
              Записаться
            </button>
          </div>
        </form>
        <div v-if="formErrorsMessages.length" class="sign-up-to-webinar__errors">
          <ul v-if="formErrorsMessages.length > 1">
            <li v-for="(value, key) in formErrorsMessages" :key="key">{{ value }}</li>
          </ul>
          <p v-else>{{ formErrorsMessages[0] }}</p>
        </div>
        <div v-if="isSignUpSuccessfully" class="sign-up-to-webinar__result">
          <p>
            Поздравляем! Вы успешно записаны.
            Ссылка на вебинар будет отправлена на указанный телефон.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, minLength, maxLength,
} from 'vuelidate/lib/validators';

import phone from '@/utils/validators/phone';
import i18nAlpha from '@/utils/validators/i18n-alpha';
import requiredFromServer from '@/utils/validators/required-from-server';
import invalidFromServer from '@/utils/validators/invalid-from-server';
import minLengthFromServer from '@/utils/validators/min-length-from-server';
import maxLengthFromServer from '@/utils/validators/max-length-from-server';

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;

export default {
  name: 'HomePageSignUpForWebinar',

  props: {
    text: {
      type: String,
      required: true,
    },
    textAlign: {
      type: String,
      default: 'center',
    },
  },

  data() {
    return {
      firstName: '',
      phone: '',
    };
  },

  validations: {
    firstName: {
      required,
      i18nAlpha,
      minLength: minLength(FIRST_NAME_MIN_LENGTH),
      maxLength: maxLength(FIRST_NAME_MAX_LENGTH),
      requiredFromServer: requiredFromServer('first-name', ['auth', 'sign-up-to-webinar', 'errors']),
      invalidFromServer: invalidFromServer('first-name', ['auth', 'sign-up-to-webinar', 'errors']),
      minLengthFromServer: minLengthFromServer('first-name', ['auth', 'sign-up-to-webinar', 'errors'], FIRST_NAME_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('first-name', ['auth', 'sign-up-to-webinar', 'errors'], FIRST_NAME_MAX_LENGTH),
    },
    phone: {
      required,
      phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
      requiredFromServer: requiredFromServer('phone', ['auth', 'sign-up-to-webinar', 'errors']),
      invalidFromServer: invalidFromServer('phone', ['auth', 'sign-up-to-webinar', 'errors']),
      minLengthFromServer: minLengthFromServer('phone', ['auth', 'sign-up-to-webinar', 'errors'], PHONE_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('phone', ['auth', 'sign-up-to-webinar', 'errors'], PHONE_MAX_LENGTH),
    },
  },

  computed: {
    ...mapState('auth/sign-up-to-webinar', {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing,
      isSignUpSuccessfully: state => state.isSuccess,
    }),

    firstNameErrorMessages() {
      const errors = [];

      if (!this.$v.firstName.$dirty) return errors;

      if (!this.$v.firstName.required) errors.push(this.$t('block-errors.first-name-is-required'));
      if (!this.$v.firstName.i18nAlpha) errors.push(this.$t('block-errors.first-name-must-be-valid'));
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

    phoneConfirmErrorMessages() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      if (!this.$v.phone.required) errors.push(this.$t('block-errors.phone-is-required'));
      if (!this.$v.phone.phone) errors.push(this.$t('block-errors.phone-must-be-valid'));
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

    formErrorsMessages() {
      const errors = [
        ...this.firstNameErrorMessages,
        ...this.phoneConfirmErrorMessages,
      ];

      if (this.formErrors.indexOf('unknown-error') > -1) errors.push(this.$t('block-errors.sign-up-to-webinar.unknown-error'));

      return errors;
    },
  },

  methods: {
    ...mapActions('auth/sign-up-to-webinar', {
      signUp: 'SIGN_UP',
    }),

    ...mapMutations('auth/sign-up-to-webinar', {
      clearError: 'CLEAR_ERROR',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.signUp({
          firstName: this.firstName,
          phone: this.phone,
        })
          .then(() => {
            this.$v.$touch();
          });
      }
    },

    clearFieldError(key) {
      this.clearError(key);
      this.$v[key].$reset();
      this.$v[key].$touch();
    },
  },

  watch: {
    $_user(value) {
      if (value && value.firstName && value.email && value.phone) {
        this.firstName = value.firstName;
        this.phone = value.phone;
      }
    },
  },
};
</script>
