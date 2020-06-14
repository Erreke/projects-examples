<template>
  <div class="modal-card">
    <div class="trx_addons_popup">
      <div class="trx_addons_tabs ui-tabs ui-widget ui-widget-content ui-corner-all">
        <div class="trx_addons_tabs_content trx_addons_login_content ui-tabs-panel
         ui-widget-content ui-corner-bottom">
          <div class="trx_addons_popup_form_wrap trx_addons_popup_form_wrap_login">

            <div :class="['verification', { 'is-loading': !formErrorsMessages.length }]">
              <p class="title" v-if="!formErrorsMessages.length && !isEmailVerifiedSuccessfully">
                {{ $t('block-auth.verification-email') }}
              </p>

              <p class="title" v-if="!formErrorsMessages.length && isEmailVerifiedSuccessfully">
                <span v-html="$t('block-auth.success-email-verified-and-reloading')"></span>
              </p>

              <div class="trx_addons_message_box is-fail" v-if="formErrorsMessages.length">
                <ul v-if="formErrorsMessages.length > 1">
                  <li v-for="(item, key) in formErrorsMessages" :key="key">
                    {{ item }}
                  </li>
                </ul>
                <span v-else>{{ formErrorsMessages[0] }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'HomePageAuthVerifyEmail',

  props: {
    actionCode: {
      type: String,
      required: true,
    },
    continueUrl: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState('auth/email-verification', {
      formErrors: state => state.errors,
      isEmailVerifiedSuccessfully: state => state.isSuccess,
    }),

    formErrorsMessages() {
      return this.formErrors.map(item => this.$t(`block-errors.verify-email.${item}`));
    },
  },

  methods: {
    ...mapActions('auth/email-verification', {
      verifyEmail: 'VERIFY_EMAIL',
      getEmailVerificationInfo: 'GET_EMAIL_VERIFICATION_INFO',
    }),

    ...mapMutations('auth', {
      setActiveTab: 'SET_ACTIVE_TAB',
      setAuthPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),
  },

  mounted() {
    this.verifyEmail(this.actionCode)
      .then((response) => {
        if (response) {
          if (this.$_user) {
            this.getEmailVerificationInfo()
              .then(() => {
                if (this.$_user.isAdmin) {
                  this.$router.push({
                    name: 'admin-clients',
                  });
                } else {
                  this.$router.push({
                    name: 'dashboard',
                  });
                }
              });
          } else {
            this.setActiveTab('login');
            this.setAuthPopupOpenedStatus(true);

            this.$router.push({
              name: 'home',
            });
          }
        }
      });
  },
};
</script>

<style lang="scss">
  .verification {
    position: relative;

    &.is-loading {
      height: 50vh;
    }

    &.is-loading::after {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      border-radius: 100%;
      content: '';
      z-index: 9999;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      box-sizing: border-box;
      border: 0 solid #fff;
      animation: loader-figure 1.15s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      margin: 2em 0 0 0;
      font-size: 1.1em;
      letter-spacing: 0.1em;
      line-height: 1.5em;
      color: #fff;
      white-space: nowrap;
      text-align: center;
    }

    .trx_addons_message_box {
      margin: 0 !important;
    }
  }
</style>
