<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-3">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{ $t("block-auth.auth") }}</v-toolbar-title>
          </v-toolbar>

          <form @submit.prevent="signIn">
            <v-alert v-model="hasFormError" dismissible type="error">
              {{ formError }}
            </v-alert>

            <v-card-text>
              <v-text-field
                v-model.trim="$v.email.$model"
                prepend-icon="mdi-account"
                autocomplete="email"
                type="text"
                name="login"
                :label="$t('block-auth.email')"
                :error-messages="emailErrors"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              >
              </v-text-field>

              <v-text-field
                v-model.trim="$v.password.$model"
                prepend-icon="mdi-lock"
                autocomplete="current-password"
                name="password"
                :label="$t('block-auth.password')"
                :type="isShowPassword ? 'text' : 'password'"
                :error-messages="passwordErrors"
                :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="isShowPassword = !isShowPassword"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              >
              </v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                color="primary"
                :loading="isSignInProcess"
                :disabled="isSignInProcess"
              >
                {{ $t("block-auth.sign-in") }}
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>mdi-loading mdi-spin</v-icon>
                  </span>
                </template>
              </v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";

export default {
  name: "SingInForm",

  data() {
    return {
      email: null,
      password: null,
      isShowPassword: false
    };
  },

  validations: {
    email: {
      required,
      email,
      minLength: minLength(5)
    },
    password: {
      required
    }
  },

  computed: {
    ...mapState(["isSignInProcess", "signInError"]),

    formError() {
      if (this.signInError === "wrong-password")
        return this.$t("block-errors.wrong-password");

      if (this.signInError === "user-not-found")
        return this.$t("block-errors.user-not-found");

      if (this.signInError === "user-disabled")
        return this.$t("block-errors.user-disabled");

      if (this.signInError === "invalid-email")
        return this.$t("block-errors.invalid-email");

      if (this.signInError === "operation-not-allowed")
        return this.$t("block-errors.operation-not-allowed");

      if (this.signInError === "network-request-failed")
        return this.$t("block-errors.network-request-failed");

      if (this.signInError === "error-unknown")
        return this.$t("block-errors.error-unknown");

      return null;
    },

    hasFormError: {
      get() {
        return !!this.formError;
      },
      set() {
        this.clearSignInError();
      }
    },

    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.email) {
        errors.push(this.$t("block-errors.field-must-be-email"));
      }

      if (!this.$v.email.minLength) {
        errors.push(
          this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.email.$params.minLength.min
          })
        );
      }

      if (!this.$v.email.required) {
        errors.push(this.$t("block-errors.field-is-required"));
      }

      return errors;
    },

    passwordErrors() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;

      if (!this.$v.password.required) {
        errors.push(this.$t("block-errors.field-is-required"));
      }

      return errors;
    }
  },

  methods: {
    ...mapMutations({
      setSignInError: "SET_SIGN_IN_ERROR",
      clearSignInError: "CLEAR_SIGN_IN_ERROR"
    }),

    ...mapActions({
      signInRequest: "SIGN_IN_REQUEST"
    }),

    signIn() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.signInRequest({
          email: this.email,
          password: this.password
        })
          .then(() => {
            this.$router.push({
              name: "admin"
            });
          })
          .catch(error => {
            this.setSignInError(error.message.replace("auth/", ""));
          });
      }
    }
  }
};
</script>
