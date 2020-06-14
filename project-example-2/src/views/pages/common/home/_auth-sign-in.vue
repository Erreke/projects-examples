<template>
  <div>
    <b-notification
      type="is-success"
      has-icon
      v-if="isRecoverPasswordEmailSent"
    >
      {{ $t("block-auth.check-mail") }}
    </b-notification>

    <b-notification
      type="is-success"
      has-icon
      v-if="isPasswordResettedSuccessfully"
    >
      <h3>{{ $t("block-auth.success-reset-password-title") }}</h3>
      <p>{{ $t("block-auth.success-reset-password-text") }}</p>
    </b-notification>

    <b-notification type="is-success" has-icon v-if="isSignedUpSuccessfully">
      <h3>{{ $t("block-auth.success-registered-title") }}</h3>
      <p>{{ $t("block-auth.success-registered-text") }}</p>
    </b-notification>

    <b-notification
      type="is-success"
      has-icon
      v-if="isEmailVerifiedSuccessfully"
    >
      <h3>{{ $t("block-auth.success-email-verified") }}</h3>
    </b-notification>

    <b-notification type="is-success" has-icon v-if="isVerificationCodeSended">
      <h3>{{ $t("block-auth.success-email-changed-title") }}</h3>
      <p>{{ $t("block-auth.success-email-changed-text") }}</p>
    </b-notification>

    <b-notification
      type="is-success"
      has-icon
      v-if="isEmailRecoveredSuccessfully"
    >
      <h3>{{ $t("block-auth.success-email-recovered-title") }}</h3>
      <p>{{ $t("block-auth.success-email-recovered-text") }}</p>
    </b-notification>

    <form @submit.prevent="submitForm" method="post">
      <b-field
        :label="$t('block-auth.email')"
        :message="emailErrorMessages"
        :type="emailErrorMessages.length ? 'is-danger' : null"
      >
        <b-input
          type="email"
          name="email"
          icon="email"
          inputmode="email"
          v-model="email"
          :disabled="isFormProcessing"
          :placeholder="$t('block-auth.placeholder-email')"
          @change="handleInput"
        >
        </b-input>
      </b-field>

      <b-field
        :label="$t('block-auth.password')"
        :message="passwordErrorMessages"
        :type="passwordErrorMessages.length ? 'is-danger' : null"
      >
        <b-input
          type="password"
          name="password"
          icon="lock"
          v-model="password"
          :disabled="isFormProcessing"
          :placeholder="$t('block-auth.placeholder-password')"
          @change="handleInput"
          password-reveal
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
          Войти
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 32;

export default {
  name: "HomePageAuthSignIn",

  data() {
    return {
      email: "",
      password: ""
    };
  },

  validations: {
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH)
    },
    password: {
      required,
      minLength: minLength(PASSWORD_MIN_LENGTH),
      maxLength: maxLength(PASSWORD_MAX_LENGTH)
    }
  },

  computed: {
    ...mapState("auth/sign-in", {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing
    }),

    ...mapState("auth/sign-up", {
      isSignedUpSuccessfully: state => state.isSuccess
    }),

    ...mapState("auth/recover-password", {
      isRecoverPasswordEmailSent: state => state.isSuccess
    }),

    ...mapState("auth/recover-email", {
      isEmailRecoveredSuccessfully: state => state.isSuccess
    }),

    ...mapState("auth/reset-password", {
      isPasswordResettedSuccessfully: state => state.isSuccess
    }),

    ...mapState("auth/email-verification", {
      isEmailVerifiedSuccessfully: state => state.isSuccess
    }),

    ...mapState("auth/change-email", {
      isVerificationCodeSended: state => state.isSuccess
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

    passwordErrorMessages() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required)
        errors.push(this.$t("block-errors.password-is-required"));
      if (!this.$v.password.minLength) {
        errors.push(
          this.$t("block-errors.password-must-be-min-length", {
            length: this.$v.password.$params.minLength.min
          })
        );
      }
      if (!this.$v.password.maxLength) {
        errors.push(
          this.$t("block-errors.password-must-be-max-length", {
            length: this.$v.password.$params.maxLength.max
          })
        );
      }

      return errors;
    },

    formErrorMessages() {
      const errors = [];

      if (this.formErrors.indexOf("invalid-email") > -1)
        errors.push(this.$t("block-errors.invalid-email"));
      if (this.formErrors.indexOf("user-disabled") > -1)
        errors.push(this.$t("block-errors.user-disabled"));
      if (this.formErrors.indexOf("user-not-found") > -1)
        errors.push(this.$t("block-errors.user-not-found"));
      if (this.formErrors.indexOf("wrong-password") > -1)
        errors.push(this.$t("block-errors.wrong-password-or-login"));
      if (this.formErrors.indexOf("operation-not-allowed") > -1)
        errors.push(this.$t("block-errors.operation-not-allowed"));
      if (this.formErrors.indexOf("network-request-failed") > -1)
        errors.push(this.$t("block-errors.network-request-failed"));
      if (this.formErrors.indexOf("unknown-error") > -1)
        errors.push(this.$t("block-errors.unknown-error"));

      return errors;
    }
  },

  methods: {
    ...mapActions("auth/sign-in", {
      signIn: "SIGN_IN"
    }),

    ...mapMutations("auth/sign-in", {
      clearError: "CLEAR_ERROR"
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.signIn({
          email: this.email,
          password: this.password
        }).then(user => {
          if (user) {
            if (user.isAdmin) {
              this.$router.push({
                name: "admin"
              });
            } else {
              this.$router.push({
                name: "courses"
              });
            }
          }
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
