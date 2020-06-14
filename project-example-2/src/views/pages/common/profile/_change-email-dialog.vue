<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <form @submit.prevent="submitForm" name="email-change" method="post">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ $t("block-global.email-changing") }}
          </p>
        </header>

        <section class="modal-card-body">
          <b-field
            :type="{ 'is-danger': currentPasswordErrorMessages.length }"
            :message="currentPasswordErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="current-password"
              password-reveal
              v-model="currentPassword"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.current-password-placeholder')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': emailErrorMessages.length }"
            :message="emailErrorMessages"
          >
            <b-input
              icon="email"
              type="email"
              name="email"
              v-model="email"
              autocomplete="new-email"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.new-email-placeholder')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': emailConfirmErrorMessages.length }"
            :message="emailConfirmErrorMessages"
          >
            <b-input
              icon="email"
              type="email"
              name="confirmEmail"
              v-model="confirmEmail"
              autocomplete="new-email"
              :disabled="isFormProcessing"
              :placeholder="
                $t('block-global.new-email-confirmation-placeholder')
              "
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': formErrorsMessages.length }"
            :message="formErrorsMessages"
          >
          </b-field>
        </section>

        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            :disabled="isFormProcessing"
            @click="isOpened = false"
          >
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
            <span>{{ $t("block-global.cancel") }}</span>
          </button>
          <button
            :class="['button is-primary', { 'is-loading': isFormProcessing }]"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t("block-global.change") }}</span>
          </button>
        </footer>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  required,
  minLength,
  maxLength,
  sameAs,
  email
} from "vuelidate/lib/validators";

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;

export default {
  name: "ProfilePageChangeEmailDialog",

  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      currentPassword: "",
      email: "",
      confirmEmail: ""
    };
  },

  validations: {
    currentPassword: {
      required
    },
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH)
    },
    confirmEmail: {
      required,
      sameAsPassword: sameAs("email")
    }
  },

  computed: {
    ...mapState("auth/change-email", {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing
    }),

    isOpened: {
      get() {
        return this.isActive;
      },

      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },

    currentPasswordErrorMessages() {
      const errors = [];

      if (!this.$v.currentPassword.$dirty) return errors;
      if (!this.$v.currentPassword.required)
        errors.push(this.$t("block-errors.field-is-required"));

      return errors;
    },

    emailErrorMessages() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required)
        errors.push(this.$t("block-errors.field-is-required"));
      if (!this.$v.email.minLength) {
        errors.push(
          this.$t("block-errors.email-must-be-min-length", {
            length: this.$v.email.$params.minLength.min
          })
        );
      }
      if (!this.$v.email.maxLength) {
        errors.push(
          this.$t("block-errors.email-must-be-max-length", {
            length: this.$v.email.$params.maxLength.max
          })
        );
      }

      return errors;
    },

    emailConfirmErrorMessages() {
      const errors = [];

      if (!this.$v.confirmEmail.$dirty) return errors;
      if (!this.$v.confirmEmail.required)
        errors.push(this.$t("block-errors.field-is-required"));
      if (!this.$v.confirmEmail.sameAsPassword)
        errors.push(this.$t("block-errors.email-not-equal"));

      return errors;
    },

    formErrorsMessages() {
      return this.formErrors.map(item =>
        this.$t(`block-errors.change-email.${item}`)
      );
    }
  },

  methods: {
    ...mapActions("auth/change-email", {
      changeEmail: "CHANGE_USER_EMAIL",
      sendVerificationCodeToNewEmail: "SEND_VERIFICATION_CODE_TO_NEW_EMAIL"
    }),

    ...mapActions("auth", {
      signOut: "SIGN_OUT"
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.changeEmail({
          currentPassword: this.currentPassword,
          email: this.email
        }).then(response => {
          if (response) {
            return this.sendVerificationCodeToNewEmail({
              uid: this.$_user.uid,
              loader: "auth/change-email/SET_PROCESSING"
            }).then(() => {
              this.isOpened = false;

              this.signOut()
                .then(() => {
                  this.$router.push({
                    name: "home"
                  });
                })
                .then(() => {
                  document.dispatchEvent(new CustomEvent("userSignedOut"));
                });
            });
          }

          return null;
        });
      }
    }
  }
};
</script>
