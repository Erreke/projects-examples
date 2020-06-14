<template>
  <error-splash-screen
    :title="$t('block-errors.email-not-verified-title')"
    :subtitle="$t('block-errors.email-not-verified-subtitle')"
  >
    <div
      v-if="
        isEmailVerificationCodeSended && emailVerificationErrors.length === 0
      "
      class="verification-code-send-result"
    >
      <p>
        На адрес {{ $_user.email }} отправлена ссылка для подтверждения Вашей
        электронной почты.<br />
        Не забудьте также проверить папку "Спам".
      </p>
      <p>Новую ссылку Вы можете запросить через: {{ countdown }}</p>
    </div>

    <p
      class="verification-code-send-error"
      v-if="emailVerificationErrors.length > 0"
    >
      Произошла ошибка... Повторите попытку позднее
    </p>

    <b-button
      v-if="
        !isEmailVerificationCodeSended || emailVerificationErrors.length > 0
      "
      type="is-primary"
      size="is-medium"
      :rounded="true"
      :loading="isEmailVerificationCodeSending"
      :disabled="isEmailVerificationCodeSending"
      @click.prevent="sendVerificationCode({ uid: $_user.uid })"
    >
      {{ $t("block-global.send-link-again") }}
    </b-button>

    <p class="verification-code-send-quit">
      <a href="#" @click.prevent="handleSignOut">
        {{ $t("block-global.sign-out-from-cabinet") }}
      </a>
    </p>
  </error-splash-screen>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

const VERIFICATION_CODE_SENDING_INTERVAL = 180;

export default {
  components: {
    ErrorSplashScreen: () => import("@/views/blocks/error-splash-screen.vue")
  },

  data() {
    return {
      timer: null,
      countdown: this.getCountDown(VERIFICATION_CODE_SENDING_INTERVAL),
      leftSeconds: VERIFICATION_CODE_SENDING_INTERVAL
    };
  },

  computed: {
    ...mapState("auth/email-verification", {
      isEmailVerificationCodeSending: state => state.isProcessing,
      isEmailVerificationCodeSended: state => state.isCodeSended,
      emailVerificationErrors: state => state.errors
    })
  },

  methods: {
    ...mapActions("auth", {
      signOut: "SIGN_OUT"
    }),

    ...mapActions("auth/email-verification", {
      sendVerificationCode: "SEND_VERIFICATION_CODE"
    }),

    ...mapMutations("auth/email-verification", {
      setVerificationCodeSendResult: "SET_CODE_SENDING_RESULT"
    }),

    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.countdown = this.getCountDown(VERIFICATION_CODE_SENDING_INTERVAL);
      this.leftSeconds = VERIFICATION_CODE_SENDING_INTERVAL;
      this.setVerificationCodeSendResult(false);
    },

    padByZero(val) {
      const valString = `${val}`;

      if (valString.length < 2) {
        return `0${valString}`;
      }

      return valString;
    },

    getCountDown(leftSeconds) {
      const seconds = this.padByZero(leftSeconds % 60);
      const minutes = this.padByZero(parseInt(leftSeconds / 60, 10));
      const hours = this.padByZero(parseInt(leftSeconds / 3600, 10));

      return `${hours}:${minutes}:${seconds}`;
    },

    handleSignOut() {
      this.signOut()
        .then(() => {
          this.$router.push({
            name: "home"
          });
        })
        .then(() => {
          document.dispatchEvent(new CustomEvent("userSignedOut"));
        });
    }
  },

  watch: {
    isEmailVerificationCodeSended(value) {
      if (value) {
        const countdown = () => {
          this.leftSeconds -= 1;
          this.countdown = this.getCountDown(this.leftSeconds);

          if (this.leftSeconds < 1 && this.timer) {
            this.clearTimer();
          }
        };

        this.timer = setInterval(countdown, 1000);
      } else if (this.timer) {
        this.clearTimer();
      }
    }
  }
};
</script>

<style lang="scss">
.verification-code-send {
  &-result {
    text-align: center;
    color: #fff;

    p {
      margin-bottom: 1em;
    }
  }

  &-error {
    color: red;
    margin-bottom: 2em;
  }

  &-quit {
    margin-top: 1em;

    a:hover {
      color: #fff;
    }
  }
}
</style>
