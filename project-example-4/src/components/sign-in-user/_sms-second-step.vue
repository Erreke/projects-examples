<template>
  <v-form
    @submit.prevent="submitForm"
    v-if="$mode === 'SMS_AUTHORIZING_SECOND_STEP'"
  >
    <v-toolbar dark color="blue-grey">
      <v-toolbar-title>{{
        $t("block-signin.enter-to-webinar")
      }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-alert v-model="hasFormError" dismissible type="error">
        {{ formError }}
      </v-alert>

      <div class="sign-in-user__icon-email">
        <v-icon>sms</v-icon>
      </div>
      <p>Вам по СМС отправлен код авторизации.</p>
      <p>Введите этот код ниже, чтобы войти в вебинар.</p>

      <v-text-field
        required
        color="blue-grey"
        prepend-icon="perm_phone_msg"
        type="tel"
        name="tel"
        v-model.trim="code"
        :label="$t('block-signin.code')"
        :error-messages="codeErrorMessages"
        @blur="$v.code.$touch()"
      ></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        id="sign-in-button"
        color="blue-grey"
        type="submit"
        :light="isSignInBySMSSecondStepProcessing"
        :dark="!isSignInBySMSSecondStepProcessing"
        :loading="isSignInBySMSSecondStepProcessing"
        :disabled="isSignInBySMSSecondStepProcessing"
      >
        {{ $t("block-signin.send") }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import {
  required,
  numeric,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  validations: {
    code: {
      required,
      numeric,
      minLength: minLength(6),
      maxLength: maxLength(6)
    }
  },

  data() {
    return {
      code: ""
    };
  },

  computed: {
    ...mapState([
      "signInBySMSSecondStepError",
      "isSignInBySMSSecondStepProcessing"
    ]),

    formError() {
      if (this.signInBySMSSecondStepError === "invalid-verification-code")
        return this.$t("block-errors.invalid-verification-code");

      if (this.signInBySMSSecondStepError)
        return this.$t("block-errors.error-unknown");

      return null;
    },

    hasFormError: {
      get() {
        return !!this.formError;
      },
      set() {
        this.clearError();
      }
    },

    codeErrorMessages() {
      const errors = [];

      if (!this.$v.code.$dirty) return errors;

      !this.$v.code.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.code.numeric &&
        errors.push(this.$t("block-errors.field-must-be-numeric"));
      !this.$v.code.minLength &&
        errors.push(
          this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.code.$params.minLength.min
          })
        );
      !this.$v.code.maxLength &&
        errors.push(
          this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.code.$params.maxLength.max
          })
        );

      return errors;
    }
  },

  methods: {
    ...mapActions({
      confirmCode: "CONFIRM_SMS_CODE"
    }),

    ...mapMutations({
      clearError: "CLEAR_SIGN_IN_BY_SMS_SECOND_STEP_ERROR"
    }),

    submitForm() {
      this.$v.$touch();

      console.log("submitForm 0");

      if (!this.$v.$invalid) {
        console.log("submitForm 1");
        this.confirmCode(this.$v.code.$model);
      }

      console.log("submitForm 2");
    }
  }
};
</script>
