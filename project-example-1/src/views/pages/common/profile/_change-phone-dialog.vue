<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <form @submit.prevent="submitFirstForm" v-if="step === 'first'" method="post">

        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('block-global.phone-changing') }}</p>
        </header>

        <section class="modal-card-body">
          <b-field
            :type="{ 'is-danger': currentPasswordErrorMessages.length }"
            :message="currentPasswordErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="current-password"
              :size="$_interfaceSize"
              password-reveal
              v-model="currentPassword"
              :disabled="isFirstFormProcessing"
              :placeholder="$t('block-global.current-password-placeholder')"
              @input="handleFirstFormInput('currentPassword')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': phoneErrorMessages.length }"
            :message="phoneErrorMessages"
          >
            <b-input
              icon="phone"
              type="tel"
              name="phone"
              :size="$_interfaceSize"
              v-model="phone"
              autocomplete="new-phone"
              inputmode="tel"
              :disabled="isFirstFormProcessing"
              :placeholder="$t('block-global.new-phone-placeholder')"
              @input="handleFirstFormInput('phone')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': phoneConfirmErrorMessages.length }"
            :message="phoneConfirmErrorMessages"
          >
            <b-input
              icon="phone"
              type="tel"
              name="confirmPhone"
              :size="$_interfaceSize"
              v-model="confirmPhone"
              autocomplete="new-phone"
              inputmode="tel"
              :disabled="isFirstFormProcessing"
              :placeholder="$t('block-global.new-phone-confirmation-placeholder')"
              @input="handleFirstFormInput('confirmPhone')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': firstFormErrorsMessages.length }"
            :message="firstFormErrorsMessages"
          >
          </b-field>
        </section>

        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            :disabled="isFirstFormProcessing"
            @click="isOpened = false"
          >
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
            <span>{{ $t("block-global.cancel") }}</span>
          </button>

          <button
            :class="['button is-primary', { 'is-loading': isFirstFormProcessing }]"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t("block-global.change") }}</span>
          </button>
        </footer>
      </form>

      <form @submit.prevent="submitSecondForm" v-if="step === 'second'" method="post">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('block-global.phone-changing') }}</p>
        </header>

        <section class="modal-card-body">
          <div class="content">
            <p>{{ $t('block-global.you-have-to-enter-code') }}</p>
          </div>

          <b-field
            :type="{ 'is-danger': smsCodeErrorMessages.length }"
            :message="smsCodeErrorMessages"
          >
            <b-input
              icon="cellphone-message"
              type="text"
              name="smsCode"
              :size="$_interfaceSize"
              v-model="smsCode"
              inputmode="tel"
              autocomplete="off"
              :disabled="isSecondFormProcessing"
              :placeholder="$t('block-global.sms-code-placeholder')"
              @input="handleSecondFormInput('smsCode')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': secondFormErrorsMessages.length }"
            :message="secondFormErrorsMessages"
          >
          </b-field>
        </section>

        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            :disabled="isSecondFormProcessing"
            @click="isOpened = false"
          >
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
            <span>{{ $t("block-global.cancel") }}</span>
          </button>

          <button
            :class="['button is-primary', { 'is-loading': isSecondFormProcessing }]"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t("block-global.send") }}</span>
          </button>
        </footer>
      </form>

      <div id="recaptcha-placeholder"></div>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, minLength, maxLength, sameAs,
} from 'vuelidate/lib/validators';

const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;

export default {
  name: 'ProfilePageChangePhoneDialog',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      currentPassword: '',
      phone: '',
      confirmPhone: '',
      smsCode: '',
      step: 'first',
      isRecaptchaVerifierInited: false,
    };
  },

  validations: {
    currentPassword: {
      required,
    },
    phone: {
      required,
      // phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
    },
    confirmPhone: {
      required,
      sameAsPassword: sameAs('phone'),
    },
  },

  computed: {
    ...mapState('auth/change-phone', [
      'firstFormErrors',
      'secondFormErrors',
      'isFirstFormProcessing',
      'isSecondFormProcessing',
    ]),

    isOpened: {
      get() {
        return this.isActive;
      },

      set(value) {
        if (!value) {
          this.resetForms();
          this.$emit('close');
        }
      },
    },

    currentPasswordErrorMessages() {
      const errors = [];

      if (!this.$v.currentPassword.$dirty) return errors;
      if (!this.$v.currentPassword.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    phoneErrorMessages() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;
      if (!this.$v.phone.required) errors.push(this.$t('block-errors.field-is-required'));
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

      return errors;
    },

    phoneConfirmErrorMessages() {
      const errors = [];

      if (!this.$v.confirmPhone.$dirty) return errors;
      if (!this.$v.confirmPhone.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.confirmPhone.sameAsPassword) errors.push(this.$t('block-errors.change-phone.phone-not-equal'));

      return errors;
    },

    firstFormErrorsMessages() {
      return this.firstFormErrors.map(item => this.$t(`block-errors.change-phone.${item}`));
    },

    smsCodeErrorMessages() {
      const errors = [];

      return errors;
    },

    secondFormErrorsMessages() {
      return this.secondFormErrors.map(item => this.$t(`block-errors.change-phone.${item}`));
    },
  },

  methods: {
    ...mapActions('auth/change-phone', {
      startChangingPhone: 'START_CHANGING_USER_PHONE',
      completeChangingPhone: 'COMPLETE_CHANGING_USER_PHONE',
    }),

    ...mapMutations('auth/change-phone', {
      clearFirstFormError: 'CLEAR_FIRST_FORM_ERROR',
      clearSecondFormError: 'CLEAR_SECOND_FORM_ERROR',
    }),

    ...mapActions('user', {
      saveUserInfo: 'SAVE_USER_INFO',
    }),

    submitFirstForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.startChangingPhone({
          phoneNumber: this.phone,
          recaptchaContainerId: 'recaptcha-placeholder',
        })
          .then((response) => {
            if (response) {
              this.step = 'second';
            }
          });
      }
    },

    submitSecondForm() {
      this.completeChangingPhone({
        currentPassword: this.currentPassword,
        smsCode: this.smsCode,
      })
        .then((response) => {
          if (response) {
            return this.saveUserInfo({
              uid: this.$_user.uid,
              fields: [
                'phone',
              ],
              values: [
                this.phone,
              ],
              loader: 'auth/change-phone/SET_PROCESSING',
            })
              .then(() => {
                this.isOpened = false;
                this.$buefy.toast.open({
                  message: this.$t('block-global.phone-changed-successfully'),
                  type: 'is-success',
                });
              });
          }

          return null;
        });
    },

    handleFirstFormInput(key) {
      this.clearFirstFormError(key);
      this.$v[key].$reset();
    },

    handleSecondFormInput(key) {
      this.clearSecondFormError(key);
      //  this.$v[key].$reset();
    },

    resetForms() {
      this.currentPassword = '';
      this.phone = '';
      this.confirmPhone = '';
      this.smsCode = '';
      this.step = 'first';
    },
  },
};
</script>
