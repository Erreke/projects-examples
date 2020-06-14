<template>
  <div class="modal-card">
    <b-notification
      v-if="formErrorsMessages.length === 0 && !isEmailVerifiedSuccessfully"
      class="inline-modal"
      :closable="false"
      type="is-info"
    >
      <div class="inline-modal__content content">
        <p class="inline-modal__loading">
          {{ $t("block-global.loading") }}
        </p>
        <p class="inline-modal__text">
          {{ $t("block-auth.verification-email") }}
        </p>
      </div>
    </b-notification>

    <b-notification
      v-if="formErrorsMessages.length === 0 && isEmailVerifiedSuccessfully"
      class="inline-modal"
      :closable="false"
      type="is-info"
    >
      <div class="inline-modal__content content">
        <p class="inline-modal__loading">
          {{ $t("block-global.loading") }}
        </p>
        <p class="inline-modal__text">
          {{ $t("block-auth.success-email-verified-and-reloading") }}
        </p>
      </div>
    </b-notification>

    <b-notification
      v-if="formErrorsMessages.length > 0"
      class="inline-modal"
      :closable="false"
      type="is-danger"
    >
      <div class="inline-modal__content content">
        <p class="inline-modal__icon icon is-large">
          <i class="mdi mdi-alert-circle mdi-48px"></i>
        </p>
        <ul class="inline-modal__text" v-if="formErrorsMessages.length > 1">
          <li v-for="(item, key) in formErrorsMessages" :key="key">
            {{ item }}
          </li>
        </ul>
        <p class="inline-modal__text" v-else>{{ formErrorsMessages[0] }}</p>
      </div>
    </b-notification>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "HomePageAuthVerifyEmail",

  props: {
    actionCode: {
      type: String,
      required: true
    },
    continueUrl: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState("auth/email-verification", {
      formErrors: state => state.errors,
      isEmailVerifiedSuccessfully: state => state.isSuccess
    }),

    formErrorsMessages() {
      return this.formErrors.map(item =>
        this.$t(`block-errors.verify-email.${item}`)
      );
    }
  },

  methods: {
    ...mapActions("auth/email-verification", {
      verifyEmail: "VERIFY_EMAIL",
      getEmailVerificationInfo: "GET_EMAIL_VERIFICATION_INFO"
    })
  },

  mounted() {
    this.verifyEmail(this.actionCode).then(response => {
      if (response) {
        if (this.$_user) {
          this.getEmailVerificationInfo().then(() => {
            if (this.$_user.isAdmin) {
              this.$router.push({
                name: "admin"
              });
            } else {
              this.$router.push({
                name: "courses"
              });
            }
          });
        } else {
          this.$router.push({
            name: "home"
          });
        }
      }
    });
  }
};
</script>
