<template>
  <form
    method="post"
    class="trx_addons_popup_form trx_addons_popup_form_login sc_input_hover_iconed"
    @submit.prevent="submitForm"
  >
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

    <div class="trx_addons_message_box is-fail" v-if="formErrorsMessages.length">
      <ul v-if="formErrorsMessages.length > 1">
        <li v-for="(item, key) in formErrorsMessages" :key="key">{{ item }}</li>
      </ul>
      <span v-else>{{ formErrorsMessages[0] }}</span>
    </div>

    <div class="trx_addons_popup_form_field trx_addons_popup_form_field_submit">
      <input
        type="submit"
        value="Напомнить"
        :disabled="isFormProcessing || formErrorsMessages.length > 0"
        :class="['submit_button', {'loading': isFormProcessing }]"
      />
      <a
        href="#"
        :disabled="isFormProcessing"
        class="trx_addons_popup_form_field_forgot_password"
        @click.prevent="$emit('cancel')"
      >
        Авторизация
      </a>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, email, minLength, maxLength,
} from 'vuelidate/lib/validators';

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;

export default {
  name: 'HomePageAuthRecoverPassword',

  components: {
    AuthInput: () => import('@/views/pages/common/home/_auth-input.vue'),
  },

  data() {
    return {
      email: '',
    };
  },

  validations: {
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
    },
  },

  computed: {
    ...mapState('auth/recover-password', {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing,
    }),

    formErrorsMessages() {
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

      if (this.formErrors.indexOf('user-not-found') > -1) errors.push(this.$t('block-errors.user-not-found'));
      if (this.formErrors.indexOf('user-disabled') > -1) errors.push(this.$t('block-errors.user-disabled'));
      if (this.formErrors.indexOf('invalid-email') > -1) errors.push(this.$t('block-errors.invalid-email'));
      if (this.formErrors.indexOf('operation-not-allowed') > -1) errors.push(this.$t('block-errors.operation-not-allowed'));
      if (this.formErrors.indexOf('network-request-failed') > -1) errors.push(this.$t('block-errors.network-request-failed'));
      if (this.formErrors.indexOf('missing-continue-uri') > -1) errors.push(this.$t('block-errors.unknown-error'));
      if (this.formErrors.indexOf('invalid-continue-uri') > -1) errors.push(this.$t('block-errors.unknown-error'));
      if (this.formErrors.indexOf('unauthorized-continue-uri') > -1) errors.push(this.$t('block-errors.unknown-error'));
      if (this.formErrors.indexOf('unknown-error') > -1) errors.push(this.$t('block-errors.unknown-error'));

      return errors;
    },
  },

  methods: {
    ...mapActions('auth/recover-password', {
      sendPasswordResetEmail: 'SEND_PASSWORD_RESET_EMAIL',
    }),

    ...mapMutations('auth/recover-password', {
      clearError: 'CLEAR_ERROR',
    }),

    ...mapMutations('auth', {
      setActiveTab: 'SET_ACTIVE_TAB',
      setAuthPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.sendPasswordResetEmail(this.email)
          .then((response) => {
            if (response) {
              this.email = '';
              this.setActiveTab('login');
              this.setAuthPopupOpenedStatus(true);
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
