<template>
  <div class="modal-card">
    <div class="trx_addons_popup reset-password-popup">
      <div class="trx_addons_tabs ui-tabs ui-widget ui-widget-content ui-corner-all">

        <ul class="trx_addons_tabs_titles ui-tabs-nav
         ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
          <li class="trx_addons_tabs_title ui-state-default
           ui-corner-top ui-tabs-active" tabindex="0">
            <a class="ui-tabs-anchor" tabindex="-1">
              <i class="trx_addons_icon-lock-open"></i>Восстановление пароля</a>
          </li>
        </ul>

        <div class="trx_addons_tabs_content trx_addons_login_content ui-tabs-panel
         ui-widget-content ui-corner-bottom">
          <div class="trx_addons_popup_form_wrap trx_addons_popup_form_wrap_login">
            <form @submit.prevent="submitForm" class="trx_addons_popup_form
             trx_addons_popup_form_login sc_input_hover_iconed" method="post">
              <auth-input
                name="password"
                icon="lock"
                type="password"
                :placeholder="$t('block-global.new-password-placeholder')"
                :has-errors="passwordErrorMessages.length > 0"
                :is-disabled="isFormProcessing"
                :is-required="true"
                :is-autofocused="true"
                v-model="password"
                autocomplete="new-password"
                @change="clearError"
              />

              <auth-input
                name="confirmPassword"
                icon="lock"
                type="password"
                :placeholder="$t('block-global.new-password-confirmation-placeholder')"
                :has-errors="passwordConfirmErrorMessages.length > 0"
                :is-disabled="isFormProcessing"
                :is-required="true"
                v-model="confirmPassword"
                autocomplete="new-password"
                @change="clearError"
              />

              <div class="trx_addons_message_box is-fail" v-if="formErrorsMessages.length">
                <ul v-if="formErrorsMessages.length > 1">
                  <li v-for="(item, key) in formErrorsMessages" :key="key">{{ item }}</li>
                </ul>
                <span v-else>{{ formErrorsMessages[0] }}</span>
              </div>

              <div class="trx_addons_popup_form_field trx_addons_popup_form_field_submit">
                <input
                  type="submit"
                  :disabled="isFormProcessing || formErrorsMessages.length > 0"
                  :class="['submit_button', {'loading': isFormProcessing }]"
                  value="Отправить"
                >
                <a
                  class="trx_addons_popup_form_field_forgot_password"
                  href="/"
                  @click.prevent="cancel"
                >
                  {{ $t('block-global.cancel')}}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button @click.prevent="cancel" type="button" class="mfp-close">×</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, minLength, maxLength, sameAs,
} from 'vuelidate/lib/validators';
import weakPassword from '@/utils/validators/weak-password';

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 32;

export default {
  name: 'HomePageAuthResetPassword',

  components: {
    AuthInput: () => import('@/views/pages/common/home/_auth-input.vue'),
  },

  props: {
    actionCode: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      password: '',
      confirmPassword: '',
    };
  },

  validations: {
    password: {
      required,
      weakPassword,
      minLength: minLength(PASSWORD_MIN_LENGTH),
      maxLength: maxLength(PASSWORD_MAX_LENGTH),
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },

  computed: {
    ...mapState('auth/reset-password', {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing,
    }),

    passwordErrorMessages() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.password.weakPassword) errors.push(this.$t('block-errors.weak-password'));
      if (!this.$v.password.minLength) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.password.$params.minLength.min,
        }));
      }
      if (!this.$v.password.maxLength) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.password.$params.maxLength.max,
        }));
      }

      return errors;
    },

    passwordConfirmErrorMessages() {
      const errors = [];

      if (!this.$v.confirmPassword.$dirty) return errors;
      if (!this.$v.confirmPassword.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.confirmPassword.sameAsPassword) errors.push(this.$t('block-errors.passwords-not-equal'));

      return errors;
    },

    formErrorsMessages() {
      const formErrors = this.formErrors.map(item => this.$t(`block-errors.reset-password.${item}`));

      const errors = [
        ...this.passwordErrorMessages,
        ...this.passwordConfirmErrorMessages,
        ...formErrors,
      ];

      return errors;
    },
  },

  methods: {
    ...mapActions('auth/reset-password', {
      verifyPasswordResetCode: 'VERIFY_PASSWORD_RESET_CODE',
      confirmPasswordReset: 'CONFIRM_PASSWORD_RESET',
    }),

    ...mapMutations('auth/reset-password', {
      clearResetPasswordFormErrors: 'CLEAR_ALL_ERRORS',
      setResetPasswordPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.confirmPasswordReset({
          actionCode: this.actionCode,
          password: this.password,
        })
          .then((response) => {
            if (response) {
              this.setResetPasswordPopupOpenedStatus(false);
              this.$router.push({
                name: 'home',
              });
            }
          });
      }
    },

    clearError(key) {
      this.clearResetPasswordFormErrors();
      this.$v[key].$reset();
    },

    cancel() {
      this.setResetPasswordPopupOpenedStatus(false);
      this.$router.push({
        name: 'home',
      });
    },
  },

  created() {
    this.verifyPasswordResetCode(this.actionCode);
  },
};
</script>
