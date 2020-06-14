<template>
  <div class="modal-card">
    <b-notification
      v-if="formErrorsMessages.length === 0"
      class="inline-modal"
      :closable="false"
      type="is-info"
    >
      <div class="inline-modal__content content">
        <p class="inline-modal__loading">
          {{ $t("block-global.loading") }}
        </p>
        <p class="inline-modal__text">
          {{ $t("block-auth.recovering-email") }}
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
  name: "HomePageAuthRecoverEmail",

  props: {
    actionCode: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState("auth/recover-email", {
      formErrors: state => state.errors
    }),

    formErrorsMessages() {
      return this.formErrors.map(item =>
        this.$t(`block-errors.recover-email.${item}`)
      );
    }
  },

  methods: {
    ...mapActions("auth/recover-email", {
      recoverEmail: "RECOVER_EMAIL"
    })
  },

  created() {
    this.recoverEmail(this.actionCode).then(response => {
      if (response) {
        this.$router.push({
          name: "home"
        });
      }
    });
  }
};
</script>
