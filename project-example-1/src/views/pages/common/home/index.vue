<template>
  <div class="home">

    <b-modal :active.sync="isAuthPopupOpened" has-modal-card :can-cancel="false">
      <auth />
    </b-modal>

    <b-modal :active.sync="isEmailVerificationPopupOpened" has-modal-card :can-cancel="false">
      <verify-email
        :action-code="actionCode"
        :continue-url="continueUrl"
      />
    </b-modal>

    <b-modal :active.sync="isRecoverEmailPopupOpened" has-modal-card :can-cancel="false">
      <recover-email
        :action-code="actionCode"
      />
    </b-modal>

    <b-modal :active.sync="isResetPasswordPopupOpened" has-modal-card :can-cancel="false">
      <reset-password
        :action-code="actionCode"
      />
    </b-modal>

    <div class="body_wrap">
      <div class="page_wrap">
        <app-header
          :navigation="navigation"
          @click-to-menu-item="clickToMenuItem"
          @open-menu="openMenu"
        />

        <app-menu
          :is-active="isMenuOpened"
          :navigation="navigation"
          :social-media-links="socialMediaLinks"
          @click-to-menu-item="clickToMenuItem"
          @close-menu="closeMenu"
        />

        <div class="page_content_wrap">
          <div class="content_wrap">
            <div class="content">
              <div class="post_content entry-content">
                <jumbotron ref="jumbotron" />
                <benefits ref="jumbotron" />
                <!-- <roadmap ref="roadmap" /> -->
                <!-- <feedbacks ref="feedbacks" /> -->
                <!-- <how-it-works ref="howItWorks" /> -->
                <!-- <faq ref="faq" /> -->
                <history ref="history" />
                <team ref="team" />
              </div>
            </div>
          </div>
        </div>

        <app-footer
          :social-media-links="socialMediaLinks"
        />
      </div>
    </div>

    <a
      id="scrollToTop"
      href="#"
      title="Наверх"
      @click.prevent="scrollToTop"
      :class="[
        'trx_addons_scroll_to_top trx_addons_icon-up inited',
        { 'show': isTimeToShowScroller }
      ]"
    >Наверх</a>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import Auth from './_auth.vue';
import VerifyEmail from './_auth-verify-email.vue';
import RecoverEmail from './_auth-recover-email.vue';
import ResetPassword from './_auth-reset-password.vue';
import AppHeader from './_header.vue';
import AppMenu from './_menu.vue';
import Jumbotron from './_jumbotron.vue';
import Benefits from './_benefits.vue';
// import Faq from './_faq.vue';
// import HowItWorks from './_how-it-works.vue';
// import Feedbacks from './_feedbacks.vue';
// import Roadmap from './_roadmap.vue';
import History from './_history.vue';
import Team from './_team.vue';
import AppFooter from './_footer.vue';

export default {
  name: 'HomePage',

  metaInfo() {
    return {
      title: this.$t('page-home.meta-title'),
    };
  },

  data() {
    return {
      isTimeToShowScroller: false,
      isThisTimeToAuth: false,
      isMenuOpened: false,
      navigation: {
        // roadmap: 'Дорожная карта',
        // feedbacks: 'Отзывы',
        // howItWorks: 'Как работаем',
        // faq: 'Вопросы и ответы',
        history: 'Путь развития',
        team: 'Команда',
      },
      socialMediaLinks: {
        // facebook: 'https://business.facebook.com/host/',
        instagramm: 'https://instagram.com/host.com/',
        youtube: 'https://www.youtube.com/host/',
        // twitter: 'https://twitter.com/host/',
      },
    };
  },

  computed: {
    ...mapState('auth', [
      'isAuthPopupOpened',
    ]),

    ...mapState('auth/email-verification', {
      isEmailVerificationPopupOpened: state => state.isPopupOpened,
    }),

    ...mapState('auth/reset-password', {
      isResetPasswordPopupOpened: state => state.isPopupOpened,
    }),

    ...mapState('auth/recover-email', {
      isRecoverEmailPopupOpened: state => state.isPopupOpened,
    }),

    mode() {
      return this.$route.query.mode;
    },

    actionCode() {
      return this.$route.query.oobCode || '';
    },

    continueUrl() {
      return this.$route.query.continueUrl || '';
    },

    lang() {
      return this.$route.query.lang;
    },

    apiKey() {
      return this.$route.query.apiKey;
    },
  },

  components: {
    Auth,
    VerifyEmail,
    RecoverEmail,
    ResetPassword,
    AppHeader,
    AppMenu,

    Jumbotron,
    Benefits,
    // Faq,
    // HowItWorks,
    // Roadmap,
    // Feedbacks,
    History,
    Team,

    AppFooter,
  },

  methods: {
    ...mapMutations('auth/email-verification', {
      setEmailVerificationPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    ...mapMutations('auth/recover-email', {
      setRecoverEmailPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    ...mapMutations('auth/reset-password', {
      setResetPasswordPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    scrollTo(value) {
      window.scrollTo({
        top: value,
        behavior: 'smooth',
      });
    },

    scrollToTop() {
      this.scrollTo(0);
    },

    clickToMenuItem(value) {
      this.closeMenu();

      const rect = this.$refs[value].$el.getBoundingClientRect();

      this.scrollTo(rect.y);
    },

    openMenu() {
      this.isMenuOpened = true;
    },

    closeMenu() {
      this.isMenuOpened = false;
    },
  },

  created() {
    if (this.mode === 'verifyEmail') {
      this.setEmailVerificationPopupOpenedStatus(true);
    }

    if (this.mode === 'recoverEmail') {
      this.setRecoverEmailPopupOpenedStatus(true);
    }

    if (this.mode === 'resetPassword') {
      this.setResetPasswordPopupOpenedStatus(true);
    }
  },

  mounted() {
    window.addEventListener('scroll', () => {
      this.isTimeToShowScroller = window.innerHeight < window.pageYOffset;
    });
  },
};
</script>

<style lang="scss">
  @import './css/fonts.css';
  @import './css/style.scss';
</style>
