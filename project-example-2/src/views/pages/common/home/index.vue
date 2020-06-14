<template>
  <default-layout>
    <b-modal :active.sync="isAuthPopupActive" has-modal-card>
      <auth />
    </b-modal>

    <b-modal
      :active.sync="isEmailVerificationPopupOpened"
      has-modal-card
      :can-cancel="false"
    >
      <verify-email :action-code="actionCode" :continue-url="continueUrl" />
    </b-modal>

    <b-modal
      :active.sync="isRecoverEmailPopupOpened"
      has-modal-card
      :can-cancel="false"
    >
      <recover-email :action-code="actionCode" />
    </b-modal>

    <b-modal
      :active.sync="isResetPasswordPopupOpened"
      has-modal-card
      :can-cancel="false"
    >
      <reset-password :action-code="actionCode" />
    </b-modal>

    <section class="hero is-primary is-large is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Primary title
          </h1>
          <h2 class="subtitle">
            Primary subtitle
          </h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Пользователей</p>
              <p class="title">3,456</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Курсов</p>
              <p class="title">123</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Followers</p>
              <p class="title">456K</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Likes</p>
              <p class="title">789</p>
            </div>
          </div>
        </nav>
      </div>
    </section>

    <section class="hero is-primary is-large is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Primary title
          </h1>
          <h2 class="subtitle">
            Primary subtitle
          </h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Пользователей</p>
              <p class="title">3,456</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Курсов</p>
              <p class="title">123</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Followers</p>
              <p class="title">456K</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Likes</p>
              <p class="title">789</p>
            </div>
          </div>
        </nav>
      </div>
    </section>

    <section class="hero is-primary is-large is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Primary title
          </h1>
          <h2 class="subtitle">
            Primary subtitle
          </h2>
        </div>
      </div>
    </section>
  </default-layout>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import Auth from "./_auth.vue";
import VerifyEmail from "./_auth-verify-email.vue";
import RecoverEmail from "./_auth-recover-email.vue";
import ResetPassword from "./_auth-reset-password.vue";

export default {
  name: "HomePage",

  metaInfo() {
    return {
      title: this.$t("page-home.meta-title")
    };
  },

  computed: {
    ...mapState("auth", ["isAuthPopupOpened"]),

    ...mapState("auth/email-verification", {
      isEmailVerificationPopupOpened: state => state.isPopupOpened
    }),

    ...mapState("auth/reset-password", {
      isResetPasswordPopupOpened: state => state.isPopupOpened
    }),

    ...mapState("auth/recover-email", {
      isRecoverEmailPopupOpened: state => state.isPopupOpened
    }),

    isAuthPopupActive: {
      get() {
        return this.isAuthPopupOpened;
      },

      set(value) {
        if (!value) {
          this.setAuthPopupOpenedStatus(value);
        }
      }
    },

    mode() {
      return this.$route.query.mode;
    },

    actionCode() {
      return this.$route.query.oobCode || "";
    },

    continueUrl() {
      return this.$route.query.continueUrl || "";
    },

    lang() {
      return this.$route.query.lang;
    },

    apiKey() {
      return this.$route.query.apiKey;
    }
  },

  components: {
    Auth,
    VerifyEmail,
    RecoverEmail,
    ResetPassword
  },

  created() {
    if (this.mode === "verifyEmail") {
      this.setEmailVerificationPopupOpenedStatus(true);
    }

    if (this.mode === "recoverEmail") {
      this.setRecoverEmailPopupOpenedStatus(true);
    }

    if (this.mode === "resetPassword") {
      this.setResetPasswordPopupOpenedStatus(true);
    }
  },

  methods: {
    ...mapMutations("auth", {
      setAuthPopupOpenedStatus: "SET_POPUP_OPENED_STATUS"
    }),

    ...mapMutations("auth/email-verification", {
      setEmailVerificationPopupOpenedStatus: "SET_POPUP_OPENED_STATUS"
    }),

    ...mapMutations("auth/recover-email", {
      setRecoverEmailPopupOpenedStatus: "SET_POPUP_OPENED_STATUS"
    }),

    ...mapMutations("auth/reset-password", {
      setResetPasswordPopupOpenedStatus: "SET_POPUP_OPENED_STATUS"
    }),

    clickToMenuItem(value) {
      this.closeMenu();

      const rect = this.$refs[value].$el.getBoundingClientRect();

      this.scrollTo(rect.y);
    }
  }
};
</script>
