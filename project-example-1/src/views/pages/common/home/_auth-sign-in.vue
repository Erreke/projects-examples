<template>
  <div v-if="isActive">
    <div class="trx_addons_message_box is-success" v-if="isRecoverPasswordEmailSent">
      {{ $t('block-auth.check-mail') }}
    </div>

    <div class="trx_addons_message_box is-success" v-if="isPasswordResettedSuccessfully">
      <h3>{{ $t('block-auth.success-reset-password-title') }}</h3>
      <p>{{ $t('block-auth.success-reset-password-text') }}</p>
    </div>

    <div class="trx_addons_message_box is-success" v-if="isSignedUpSuccessfully">
      <h3>{{ $t('block-auth.success-registered-title') }}</h3>
      <p>{{ $t('block-auth.success-registered-text') }}</p>
    </div>

    <div class="trx_addons_message_box is-success" v-if="isEmailVerifiedSuccessfully">
      <h3>{{ $t('block-auth.success-email-verified') }}</h3>
    </div>

    <div class="trx_addons_message_box is-success" v-if="isVerificationCodeSended">
      <h3>{{ $t('block-auth.success-email-changed-title') }}</h3>
      <p>{{ $t('block-auth.success-email-changed-text') }}</p>
    </div>

    <div class="trx_addons_message_box is-success" v-if="isEmailRecoveredSuccessfully">
      <h3>{{ $t('block-auth.success-email-recovered-title') }}</h3>
      <p>{{ $t('block-auth.success-email-recovered-text') }}</p>
    </div>

    <recover-password
      v-if="isRecoverPasswordShowed"
      @cancel="hideRecoverPasswordForm"
    />

    <form v-else @submit.prevent="submitForm"
     class="trx_addons_popup_form trx_addons_popup_form_login
      sc_input_hover_iconed" method="post">
      <auth-input
        name="email"
        icon="mail"
        type="email"
        inputmode="email"
        :class="{ filled: email }"
        :placeholder="$t('block-auth.placeholder-email')"
        :is-disabled="isFormProcessing"
        :is-required="true"
        v-model="email"
        @change="handleInput"
      />

      <auth-input
        name="password"
        icon="lock"
        type="password"
        :class="{ filled: password }"
        :placeholder="$t('block-auth.placeholder-password')"
        :is-disabled="isFormProcessing"
        :is-required="true"
        v-model="password"
        @change="handleInput"
      />

      <div class="trx_addons_message_box is-fail" v-if="formErrorMessages.length">
        <ul v-if="formErrorMessages.length > 1">
          <li v-for="(item, key) in formErrorMessages" :key="key">{{ item }}</li>
        </ul>
        <span v-else>{{ formErrorMessages[0] }}</span>
      </div>

      <div class="trx_addons_popup_form_field trx_addons_popup_form_field_submit">
        <input
          type="submit"
          value="Войти"
          :disabled="isFormProcessing || formErrorMessages.length > 0"
          :class="['submit_button', {'loading': isFormProcessing }]"
        />
        <a
          href="#"
          class="trx_addons_popup_form_field_forgot_password"
          @click.prevent="showRecoverPasswordForm"
        >
          Сброс пароля
        </a>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  required, email, minLength, maxLength,
} from 'vuelidate/lib/validators';

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 32;

export default {
  name: 'HomePageAuthSignIn',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    RecoverPassword: () => import('@/views/pages/common/home/_auth-recover-password.vue'),
    AuthInput: () => import('@/views/pages/common/home/_auth-input.vue'),
  },

  data() {
    return {
      email: '',
      password: '',
      isShowPassword: false,
    };
  },

  validations: {
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
    },
    password: {
      required,
      minLength: minLength(PASSWORD_MIN_LENGTH),
      maxLength: maxLength(PASSWORD_MAX_LENGTH),
    },
  },

  computed: {
    ...mapState('auth/sign-in', {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing,
    }),

    ...mapState('auth/sign-up', {
      isSignedUpSuccessfully: state => state.isSuccess,
    }),

    ...mapState('auth/recover-password', {
      isRecoverPasswordShowed: state => state.isPopupOpened,
      isRecoverPasswordEmailSent: state => state.isSuccess,
    }),

    ...mapState('auth/recover-email', {
      isEmailRecoveredSuccessfully: state => state.isSuccess,
    }),

    ...mapState('auth/reset-password', {
      isPasswordResettedSuccessfully: state => state.isSuccess,
    }),

    ...mapState('auth/email-verification', {
      isEmailVerifiedSuccessfully: state => state.isSuccess,
    }),

    ...mapState('auth/change-email', {
      isVerificationCodeSended: state => state.isSuccess,
    }),

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

      return errors;
    },

    passwordErrorMessages() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push(this.$t('block-errors.password-is-required'));
      if (!this.$v.password.minLength) {
        errors.push(this.$t('block-errors.password-must-be-min-length', {
          length: this.$v.password.$params.minLength.min,
        }));
      }
      if (!this.$v.password.maxLength) {
        errors.push(this.$t('block-errors.password-must-be-max-length', {
          length: this.$v.password.$params.maxLength.max,
        }));
      }

      return errors;
    },

    formErrorMessages() {
      const errors = [
        ...this.emailErrorMessages,
        ...this.passwordErrorMessages,
      ];

      if (this.formErrors.indexOf('invalid-email') > -1) errors.push(this.$t('block-errors.invalid-email'));
      if (this.formErrors.indexOf('user-disabled') > -1) errors.push(this.$t('block-errors.user-disabled'));
      if (this.formErrors.indexOf('user-not-found') > -1) errors.push(this.$t('block-errors.user-not-found'));
      if (this.formErrors.indexOf('wrong-password') > -1) errors.push(this.$t('block-errors.wrong-password-or-login'));
      if (this.formErrors.indexOf('operation-not-allowed') > -1) errors.push(this.$t('block-errors.operation-not-allowed'));
      if (this.formErrors.indexOf('network-request-failed') > -1) errors.push(this.$t('block-errors.network-request-failed'));
      if (this.formErrors.indexOf('unknown-error') > -1) errors.push(this.$t('block-errors.unknown-error'));

      return errors;
    },
  },

  methods: {
    ...mapActions('auth/sign-in', {
      signIn: 'SIGN_IN',
    }),

    ...mapMutations('auth/sign-in', {
      clearError: 'CLEAR_ERROR',
    }),

    ...mapMutations('auth/recover-password', {
      setRecoverPasswordFormOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    showRecoverPasswordForm() {
      this.setRecoverPasswordFormOpenedStatus(true);
    },

    hideRecoverPasswordForm() {
      this.setRecoverPasswordFormOpenedStatus(false);
    },

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.signIn({
          email: this.email,
          password: this.password,
        })
          .then((user) => {
            if (user) {
              if (user.isAdmin) {
                this.$router.push({
                  name: 'admin-clients',
                });
              } else {
                this.$router.push({
                  name: 'dashboard',
                });
              }
            }
          });
      }
    },

    handleInput(key) {
      this.clearError(key);
      this.$v[key].$reset();
    },
  },
};
</script>
