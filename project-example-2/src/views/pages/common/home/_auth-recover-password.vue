<template>
  <form @submit.prevent="submitForm" method="post">
    <b-field
      :label="$t('block-auth.email')"
      :message="emailErrorMessages"
      :type="emailErrorMessages.length ? 'is-danger' : null"
    >
      <b-input
        name="email"
        icon="email"
        type="email"
        inputmode="email"
        :placeholder="$t('block-auth.placeholder-email')"
        :disabled="isFormProcessing"
        v-model="email"
        @change="handleInput"
      >
      </b-input>
    </b-field>

    <b-notification
      v-if="formErrorMessages.length"
      type="is-danger"
      role="alert"
    >
      <ul v-if="formErrorMessages.length > 1">
        <li v-for="(item, key) in formErrorMessages" :key="key">
          {{ item }}
        </li>
      </ul>
      <span v-else>{{ formErrorMessages[0] }}</span>
    </b-notification>

    <div class="auth__footer">
      <b-button
        native-type="submit"
        :disabled="isFormProcessing"
        :loading="isFormProcessing"
        type="is-primary"
      >
        Сбросить
      </b-button>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;

export default {
  name: "HomePageAuthRecoverPassword",

  data() {
    return {
      email: ""
    };
  },

  validations: {
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH)
    }
  },

  computed: {
    ...mapState("auth/recover-password", {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing
    }),

    emailErrorMessages() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.required)
        errors.push(this.$t("block-errors.email-is-required"));
      if (!this.$v.email.email)
        errors.push(this.$t("block-errors.email-must-be-valid"));
      if (!this.$v.email.minLength) {
        errors.push(
          this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.email.$params.minLength.min
          })
        );
      }
      if (!this.$v.email.maxLength) {
        errors.push(
          this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.email.$params.maxLength.max
          })
        );
      }

      return errors;
    },

    formErrorMessages() {
      const errors = [];

      if (this.formErrors.indexOf("user-not-found") > -1)
        errors.push(this.$t("block-errors.user-not-found"));
      if (this.formErrors.indexOf("user-disabled") > -1)
        errors.push(this.$t("block-errors.user-disabled"));
      if (this.formErrors.indexOf("invalid-email") > -1)
        errors.push(this.$t("block-errors.invalid-email"));
      if (this.formErrors.indexOf("operation-not-allowed") > -1)
        errors.push(this.$t("block-errors.operation-not-allowed"));
      if (this.formErrors.indexOf("network-request-failed") > -1)
        errors.push(this.$t("block-errors.network-request-failed"));
      if (this.formErrors.indexOf("missing-continue-uri") > -1)
        errors.push(this.$t("block-errors.unknown-error"));
      if (this.formErrors.indexOf("invalid-continue-uri") > -1)
        errors.push(this.$t("block-errors.unknown-error"));
      if (this.formErrors.indexOf("unauthorized-continue-uri") > -1)
        errors.push(this.$t("block-errors.unknown-error"));
      if (this.formErrors.indexOf("unknown-error") > -1)
        errors.push(this.$t("block-errors.unknown-error"));

      return errors;
    }
  },

  methods: {
    ...mapActions("auth/recover-password", {
      sendPasswordResetEmail: "SEND_PASSWORD_RESET_EMAIL"
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.sendPasswordResetEmail(this.email).then(() => {
          this.$v.$reset();
          this.email = "";
        });
      }
    },

    handleInput(key) {
      this.clearError(key);
      this.$v[key].$reset();
    }
  }
};
</script>
