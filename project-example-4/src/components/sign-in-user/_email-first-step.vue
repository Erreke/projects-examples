<template>
  <v-form v-if="$mode === 'EMAIL_AUTHORIZING_FIRST_STEP'">
    <h1>EMAIL_AUTHORIZING_FIRST_STEP</h1>

    <v-toolbar dark color="blue-grey">
      <v-toolbar-title>{{
        $t("block-signin.enter-to-webinar")
      }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-alert v-model="hasFormError" dismissible type="error">
        {{ formError }}
      </v-alert>

      <v-text-field
        required
        color="blue-grey"
        prepend-icon="email"
        type="email"
        name="email"
        v-model.trim="$v.email.$model"
        :label="$t('block-signin.email')"
        :error-messages="emailErrorMessages"
        @blur="$v.email.$touch()"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue-grey"
        type="submit"
        :light="isSignInByEmailFirstStepProcessing"
        :dark="!isSignInByEmailFirstStepProcessing"
        :loading="isSignInByEmailFirstStepProcessing"
        :disabled="isSignInByEmailFirstStepProcessing"
      >
        {{ $t("block-signin.enter") }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  validations: {
    email: {
      required,
      email,
      minLength: minLength(6),
      maxLength: maxLength(128)
    }
  },

  data() {
    return {
      email: ""
    };
  },

  computed: {
    ...mapState([
      "signInByEmailFirstStepError",
      "isSignInByEmailFirstStepProcessing"
    ]),

    formError() {
      if (this.signInByEmailFirstStepError === "wrong-password")
        return this.$t("block-errors.wrong-password");

      if (this.signInByEmailFirstStepError === "user-not-found")
        return this.$t("block-errors.user-not-found");

      if (this.signInByEmailFirstStepError === "user-disabled")
        return this.$t("block-errors.user-disabled");

      if (this.signInByEmailFirstStepError === "invalid-email")
        return this.$t("block-errors.invalid-email");

      if (this.signInByEmailFirstStepError === "operation-not-allowed")
        return this.$t("block-errors.operation-not-allowed");

      if (this.signInByEmailFirstStepError === "network-request-failed")
        return this.$t("block-errors.network-request-failed");

      if (this.signInByEmailFirstStepError === "invalid-action-code")
        return this.$t("block-errors.invalid-action-code");

      if (this.signInByEmailFirstStepError === "expired-action-code")
        return this.$t("block-errors.expired-action-code");

      if (this.signInByEmailFirstStepError)
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

    emailErrorMessages() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      !this.$v.email.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.email.email &&
        errors.push(this.$t("block-errors.invalid-email"));
      !this.$v.email.minLength &&
        errors.push(
          this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.email.$params.minLength.min
          })
        );
      !this.$v.email.maxLength &&
        errors.push(
          this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.email.$params.maxLength.max
          })
        );

      return errors;
    }
  },

  methods: {
    ...mapActions({
      sendSignInLinkToEmail: "SEND_SIGN_IN_LINK_TO_EMAIL",
      signInWithEmailLink: "SIGN_IN_WITH_EMAIL_LINK"
    })
  }
};
</script>
