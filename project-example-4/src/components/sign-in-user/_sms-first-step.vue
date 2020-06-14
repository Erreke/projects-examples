<template>
  <v-form
    @submit.prevent="submitForm"
    v-if="$mode === 'SMS_AUTHORIZING_FIRST_STEP'"
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

      <v-text-field
        required
        color="blue-grey"
        prepend-icon="person"
        type="text"
        name="name"
        v-model.trim="fullname"
        :label="$t('block-signin.fullname')"
        :error-messages="fullNameErrorMessages"
        @blur="$v.fullname.$touch()"
      ></v-text-field>

      <v-text-field
        required
        color="blue-grey"
        prepend-icon="phone"
        type="tel"
        name="tel"
        v-model.trim="phone"
        :label="$t('block-signin.phone')"
        :error-messages="phoneErrorMessages"
        @blur="$v.phone.$touch()"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        id="sign-in-button"
        color="blue-grey"
        type="submit"
        :light="isSignInBySMSFirstStepProcessing"
        :dark="!isSignInBySMSFirstStepProcessing"
        :loading="isSignInBySMSFirstStepProcessing"
        :disabled="isSignInBySMSFirstStepProcessing"
      >
        {{ $t("block-signin.enter") }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { fullname, phone } from "@/utils/customValidators";
import { initRecaptchaVerifier } from "@/api/auth";

export default {
  validations: {
    fullname: {
      required,
      fullname,
      minLength: minLength(2),
      maxLength: maxLength(128)
    },
    phone: {
      required,
      phone,
      minLength: minLength(10),
      maxLength: maxLength(18)
    }
  },

  data() {
    return {
      fullname: "",
      phone: ""
    };
  },

  computed: {
    ...mapState([
      "signInBySMSFirstStepError",
      "isSignInBySMSFirstStepProcessing"
    ]),

    formError() {
      if (this.signInBySMSFirstStepError === "user-not-found")
        return this.$t("block-errors.user-not-found");

      if (this.signInBySMSFirstStepError === "user-disabled")
        return this.$t("block-errors.user-disabled");

      if (this.signInBySMSFirstStepError === "operation-not-allowed")
        return this.$t("block-errors.operation-not-allowed");

      if (this.signInBySMSFirstStepError === "network-request-failed")
        return this.$t("block-errors.network-request-failed");

      if (this.signInBySMSFirstStepError === "too-many-requests")
        return this.$t("block-errors.too-many-requests");

      if (this.signInBySMSFirstStepError)
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

    fullNameErrorMessages() {
      const errors = [];

      if (!this.$v.fullname.$dirty) return errors;

      !this.$v.fullname.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.fullname.fullname &&
        errors.push(this.$t("block-errors.field-must-be-fullname"));
      !this.$v.fullname.minLength &&
        errors.push(
          this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.fullname.$params.minLength.min
          })
        );
      !this.$v.fullname.maxLength &&
        errors.push(
          this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.fullname.$params.maxLength.max
          })
        );

      return errors;
    },

    phoneErrorMessages() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      !this.$v.phone.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.phone.phone &&
        errors.push(this.$t("block-errors.field-must-be-phone"));
      !this.$v.phone.minLength &&
        errors.push(
          this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.phone.$params.minLength.min
          })
        );
      !this.$v.phone.maxLength &&
        errors.push(
          this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.phone.$params.maxLength.max
          })
        );

      return errors;
    }
  },

  methods: {
    ...mapActions({
      sendSMSToPhoneNumber: "SEND_SMS_TO_PHONE_NUMBER"
    }),

    ...mapMutations({
      clearError: "CLEAR_SIGN_IN_BY_SMS_FIRST_STEP_ERROR"
    }),

    submitForm() {
      // this.$v.$touch();

      console.log("submitForm 0");
      console.log("submitForm this.$v.$invalid", this.$v.$invalid);

      // if (!this.$v.$invalid) {
      console.log("submitForm 1");

      this.sendSMSToPhoneNumber({
        fullname: this.$v.fullname.$model,
        phone: this.$v.phone.$model
      });
      // }

      console.log("submitForm N");
    },

    qweqwe() {
      console.log("initRecaptchaVerifier qweqwe");
    }
  },

  mounted() {
    initRecaptchaVerifier({
      buttonId: "sign-in-button",
      callback: this.qweqwe
    });
  }
};
</script>
