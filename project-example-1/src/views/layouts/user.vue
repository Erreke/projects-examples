<template>
  <div :class="classNames">
    <initial-password-changer />

    <sidebar class="layout__sidebar" v-if="$_user && $_user.emailVerified && $_user.isExistInAmo" />

    <div
      v-if="$_user && $_user.emailVerified && $_user.isExistInAmo"
      :class="['layout__content', contentClass]"
    >
      <h1 v-if="title" class="title">{{ title }}</h1>
      <h2 v-if="subtitle" class="subtitle">{{ subtitle }}</h2>

      <div class="layout__alerts" v-if="$route.name !== 'profile'">
        <profile-fill-alert />
      </div>

      <slot v-if="$_user && !$_user.isAdmin" />

      <!-- <slot name="sidebar" /> -->
    </div>

    <error-splash-screen
      v-if="$_user && $_user.emailVerified && !$_user.isExistInAmo"
      :title="$t('block-errors.you-are-not-exist-in-amo')"
      :subtitle="$t('block-errors.please-subscribe-to-bot')"
    >
      <a
        :class="[
          'bbttnn',
           { 'is-loading': isEmailVerificationCodeSending }
        ]"
        href="https://bot.host.com/"
        target="_blank"
      >
        {{ $t('block-errors.subscribe-to-bot') }}
      </a>

      <p class="verification-code-send-quit">
        <a href="#" @click.prevent="handleSignOut">
          {{ $t('block-global.sign-out-from-cabinet') }}
        </a>
      </p>
    </error-splash-screen>

    <error-splash-screen
      v-if="$_user && !$_user.emailVerified"
      :title="$t('block-errors.email-not-verified-title')"
      :subtitle="$t('block-errors.email-not-verified-subtitle')"
    >
      <div v-if="isEmailVerificationCodeSended && emailVerificationErrors.length === 0"
       class="verification-code-send-result">
        <p>На адрес {{ $_user.email }} отправлена ссылка для подтверждения
           Вашей электронной почты.<br> Не забудьте также проверить папку "Спам".</p>
        <p>Новую ссылку Вы можете запросить через: {{ countdown }}</p>
      </div>

      <p class="verification-code-send-error"
       v-if="emailVerificationErrors.length > 0">Произошла ошибка... Повторите попытку позднее</p>

      <button
        v-if="!isEmailVerificationCodeSended || emailVerificationErrors.length > 0"
        :class="[
          'bbttnn',
           { 'is-loading': isEmailVerificationCodeSending }
        ]"
        type="button"
        :disabled="isEmailVerificationCodeSending"
        @click.prevent="sendVerificationCode({ uid: $_user.uid })"
      >
        {{ $t('block-global.send-link-again') }}
      </button>

      <p class="verification-code-send-quit">
        <a href="#" @click.prevent="handleSignOut">
          {{ $t('block-global.sign-out-from-cabinet') }}
        </a>
      </p>
    </error-splash-screen>

    <error-splash-screen
      v-if="$_user && $_user.isAdmin"
      :title="$t('block-errors.err-oops-403-title')"
      :subtitle="$t('block-errors.err-oops-403-subtitle')"
      route-name="admin"
      :link-text="$t('block-errors.err-oops-403-back-admin')"
    />

    <page-loader :is-active="!$_user" />

    <transition name="fade">
      <div class="darker" v-if="isSidebarActive" @click.prevent="toggleOpenState"></div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

const VERIFICATION_CODE_SENDING_INTERVAL = 180;

export default {
  name: 'UserLayout',

  metaInfo() {
    return {
      title: this.$_user && !this.$_user.isAdmin ? this.$t(`page-${this.$route.name}.meta-title`) : this.$t('block-errors.err-oops-403-title'),
    };
  },

  props: {
    title: {
      type: String,
      default: '',
    },

    subtitle: {
      type: String,
      default: '',
    },

    layoutClass: {
      type: String,
      default: '',
    },

    contentClass: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      timer: null,
      countdown: this.getCountDown(VERIFICATION_CODE_SENDING_INTERVAL),
      leftSeconds: VERIFICATION_CODE_SENDING_INTERVAL,
    };
  },

  components: {
    InitialPasswordChanger: () => import('@/views/blocks/initial-password-changer.vue'),
    ProfileFillAlert: () => import('@/views/blocks/profile-fill-alert.vue'),
    Sidebar: () => import('@/views/blocks/sidebar.vue'),
    PageLoader: () => import('@/views/blocks/page-loader.vue'),
    ErrorSplashScreen: () => import('@/views/blocks/error-splash-screen.vue'),
  },

  computed: {
    ...mapState('auth/email-verification', {
      isEmailVerifiedJustNow: state => state.isSuccess,
      isEmailVerificationCodeSending: state => state.isProcessing,
      isEmailVerificationCodeSended: state => state.isCodeSended,
      emailVerificationErrors: state => state.errors,
    }),

    ...mapState('interface', [
      'isSidebarActive',
    ]),

    classNames() {
      return ['layout', `layout_device_${this.$_device}`, this.layoutClass];
    },
  },

  methods: {
    ...mapActions('auth', {
      signOut: 'SIGN_OUT',
    }),

    ...mapActions('auth/email-verification', {
      sendVerificationCode: 'SEND_VERIFICATION_CODE',
    }),

    ...mapMutations('auth/email-verification', {
      setVerificationCodeSendResult: 'SET_CODE_SENDING_RESULT',
    }),

    ...mapMutations('interface', {
      toggleSidebarActiveState: 'TOGGLE_SIDEBAR_ACTIVE_STATE',
    }),

    toggleOpenState() {
      this.toggleSidebarActiveState(!this.isSidebarActive);
    },

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
            name: 'home',
          });
        })
        .then(() => {
          document.dispatchEvent(new CustomEvent('userSignedOut'));
        });
    },
  },

  mounted() {
    if (this.isEmailVerifiedJustNow) {
      this.$buefy.toast.open({
        message: this.$t('block-global.email-successful-verified'),
        type: 'is-success',
        duration: 5000,
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
    },
  },
};
</script>

<style lang="scss">
@import './common.scss';

.verification-code-send-result {
  text-align: center;

  p {
    margin-bottom: 1em;
  }
}

.verification-code-send-error {
  color: red;
  margin-bottom: 2em;
}

.verification-code-send-quit {
  margin-top: 1em;
}

.bbttnn {
  margin: 0;
  transition: all .3s ease;
  cursor: pointer;
  border-radius: 5em;
  font-size: 16px;
  color: #fff;
  background-color: #1aafe9;
  border: none;
  padding: 1em 2em;

  &:focus,
  &:hover {
    outline: none;
    color: #fff;
    background-color :#d2538a;
  }

  &.is-loading {
    background-image: url(~@/views/pages/common/home/images/btn-loading.svg);
    background-size: cover;
    background-color: #1aafe9;
  }
}
</style>
