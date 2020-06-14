<template>
  <v-container fluid fill-height>
    <v-layout mt-5 justify-center>
      <v-flex xs12 sm10 md8>
        <h1 class="display-1 font-weight-thin mb-4">
          {{ $t("page-quiz.great-last-step") }}
        </h1>
        <v-card>
          <v-card-title primary-title>
            <div class="headline">
              {{ $t("page-quiz.fill-form-and-get-results") }}
            </div>
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="submit">
              <v-text-field
                required
                v-model="name"
                prepend-icon="mdi-account"
                autocomplete="name"
                type="text"
                name="name"
                :error-messages="nameErrors"
                :label="$t('page-quiz.name')"
                @blur="$v.name.$touch()"
              ></v-text-field>

              <v-text-field
                required
                v-model="email"
                prepend-icon="mdi-email"
                autocomplete="email"
                type="text"
                name="email"
                :error-messages="emailErrors"
                label="E-mail"
                @blur="$v.email.$touch()"
              ></v-text-field>

              <v-text-field
                required
                v-model="phone"
                autocomplete="tel"
                type="text"
                name="phone"
                prepend-icon="mdi-phone"
                :error-messages="phoneErrors"
                :label="$t('page-quiz.phone')"
                @blur="$v.phone.$touch()"
              ></v-text-field>

              <v-btn
                round
                type="submit"
                color="primary"
                :large="$device !== 'mobile'"
                :disabled="!isAgree"
              >
                <v-icon light class="mr-1">mdi-check-circle-outline</v-icon>
                {{ $t("page-quiz.get-results") }}
              </v-btn>

              <v-checkbox
                v-model="isAgree"
                color="primary"
                class="quiz__policy"
              >
                <template v-slot:label>
                  <span
                    @click.prevent="openPrivacyPolicyDialog"
                    v-html="$t('page-quiz.read-privacy-policy')"
                  ></span>
                </template>
              </v-checkbox>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { i18nAlpha, phone } from "@/utils/customValidators";

export default {
  name: "QuizLeadCreator",

  data: () => ({
    name: "",
    email: "",
    phone: "",
    isAgree: true
  }),

  validations: {
    name: { required, i18nAlpha },
    email: { required, email },
    phone: { required, phone }
  },

  computed: {
    nameErrors() {
      const errors = [];

      if (!this.$v.name.$dirty) return errors;

      !this.$v.name.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.name.i18nAlpha &&
        errors.push(this.$t("block-errors.field-must-be-alpha"));

      return errors;
    },

    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      !this.$v.email.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.email.email &&
        errors.push(this.$t("block-errors.invalid-email"));

      return errors;
    },

    phoneErrors() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      !this.$v.phone.required &&
        errors.push(this.$t("block-errors.field-is-required"));
      !this.$v.phone.phone &&
        errors.push(this.$t("block-errors.field-must-be-phone"));

      return errors;
    }
  },

  methods: {
    submit() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.$emit("submitForm", {
          name: this.name,
          email: this.email,
          phone: this.phone
        });
      }
    },

    openPrivacyPolicyDialog(event) {
      if (event.target.tagName === "A") {
        event.stopPropagation();
        this.$emit("openPrivacyPolicyDialog");
      }
    }
  }
};
</script>

<style lang="scss">
.quiz__policy {
  .v-label {
    font-size: 12px;
  }
}
</style>
