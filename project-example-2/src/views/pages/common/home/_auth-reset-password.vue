<template>
  <form
    @submit.prevent="submitForm"
    method="post"
    class="modal-card"
    style="width: 25vw"
  >
    <header class="modal-card-head">
      <p class="modal-card-title">Восстановление пароля</p>
    </header>

    <section class="modal-card-body">
      <b-field
        :label="$t('block-auth.new-password')"
        :message="passwordErrorMessages"
        :type="passwordErrorMessages.length ? 'is-danger' : null"
      >
        <b-input
          type="password"
          name="password"
          icon="lock"
          password-reveal
          autocomplete="new-password"
          v-model="password"
          :disabled="isFormProcessing"
          :autofocus="true"
          :placeholder="$t('block-auth.placeholder-new-password')"
          @change="clearError"
        >
        </b-input>
      </b-field>

      <b-field
        :label="$t('block-auth.new-password')"
        :message="passwordConfirmErrorMessages"
        :type="passwordConfirmErrorMessages.length ? 'is-danger' : null"
      >
        <b-input
          type="password"
          name="confirmPassword"
          icon="lock"
          password-reveal
          autocomplete="new-password"
          v-model="confirmPassword"
          :disabled="isFormProcessing || formErrorMessages.length > 0"
          :autofocus="true"
          :placeholder="$t('block-auth.placeholder-new-password-confirmation')"
          @change="clearError"
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
    </section>

    <footer class="modal-card-foot">
      <b-button
        native-type="submit"
        :disabled="isFormProcessing"
        :loading="isFormProcessing"
        type="is-primary"
        >Отправить</b-button
      >
      <b-button
        native-type="button"
        :disabled="isFormProcessing"
        :loading="isFormProcessing"
        @click.prevent="cancel"
        >{{ $t("block-global.cancel") }}</b-button
      >
    </footer>
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  required,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
import weakPassword from "@/utils/validators/weak-password";

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 32;

export default {
  name: "HomePageAuthResetPassword",

  props: {
    actionCode: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      password: "",
      confirmPassword: ""
    };
  },

  validations: {
    password: {
      required,
      weakPassword,
      minLength: minLength(PASSWORD_MIN_LENGTH),
      maxLength: maxLength(PASSWORD_MAX_LENGTH)
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs("password")
    }
  },

  computed: {
    ...mapState("auth/reset-password", {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing
    }),

    passwordErrorMessages() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required)
        errors.push(this.$t("block-errors.field-is-required"));
      if (!this.$v.password.weakPassword)
        errors.push(this.$t("block-errors.weak-password"));
      if (!this.$v.password.minLength) {
        errors.push(
          this.$t("block-errors.first-name-must-be-min-length", {
            length: this.$v.password.$params.minLength.min
          })
        );
      }
      if (!this.$v.password.maxLength) {
        errors.push(
          this.$t("block-errors.first-name-must-be-max-length", {
            length: this.$v.password.$params.maxLength.max
          })
        );
      }

      return errors;
    },

    passwordConfirmErrorMessages() {
      const errors = [];

      if (!this.$v.confirmPassword.$dirty) return errors;
      if (!this.$v.confirmPassword.required)
        errors.push(this.$t("block-errors.field-is-required"));
      if (!this.$v.confirmPassword.sameAsPassword)
        errors.push(this.$t("block-errors.passwords-not-equal"));

      return errors;
    },

    formErrorMessages() {
      return this.formErrors.map(item =>
        this.$t(`block-errors.reset-password.${item}`)
      );
    }
  },

  methods: {
    ...mapActions("auth/reset-password", {
      verifyPasswordResetCode: "VERIFY_PASSWORD_RESET_CODE",
      confirmPasswordReset: "CONFIRM_PASSWORD_RESET"
    }),

    ...mapMutations("auth/reset-password", {
      clearResetPasswordFormErrors: "CLEAR_ALL_ERRORS",
      setResetPasswordPopupOpenedStatus: "SET_POPUP_OPENED_STATUS"
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.confirmPasswordReset({
          actionCode: this.actionCode,
          password: this.password
        }).then(response => {
          if (response) {
            this.setResetPasswordPopupOpenedStatus(false);
            this.$router.push({
              name: "home"
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
        name: "home"
      });
    }
  },

  created() {
    this.verifyPasswordResetCode(this.actionCode);
  }
};
</script>
