<template>
  <div class="modal-card">
    <div class="trx_addons_popup">
      <div class="trx_addons_tabs ui-tabs ui-widget ui-widget-content ui-corner-all">
        <ul class="trx_addons_tabs_titles ui-tabs-nav ui-helper-reset
         ui-helper-clearfix ui-widget-header ui-corner-all">
          <li :class="['trx_addons_tabs_title ui-state-default ui-corner-top',
           { 'ui-tabs-active': activeTab === 'login' }]" tabindex="0">
            <a @click.prevent="changeTab('login')" href="#" class="ui-tabs-anchor" tabindex="-1">
              <i class="trx_addons_icon-lock-open"></i>
                <span v-if="isRecoverPasswordShowed">Сброс пароля</span>
                <span v-else>Авторизация</span>
             </a>
          </li>
          <li :class="['trx_addons_tabs_title ui-state-default ui-corner-top',
           { 'ui-tabs-active': activeTab === 'register' }]" tabindex="-1">
            <a @click.prevent="changeTab('register')" href="#" class="ui-tabs-anchor"
             tabindex="-1"><i class="trx_addons_icon-user-plus"></i>Регистрация</a>
          </li>
        </ul>
        <div class="trx_addons_tabs_content trx_addons_login_content
         ui-tabs-panel ui-widget-content ui-corner-bottom">
          <div class="trx_addons_popup_form_wrap trx_addons_popup_form_wrap_login">
            <auth-sign-in :is-active="activeTab === 'login'" />
            <auth-sign-up :is-active="activeTab === 'register'" />
          </div>
        </div>
      </div>
      <button @click.prevent="closeAuthPopup" type="button" class="mfp-close">×</button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

import AuthSignIn from './_auth-sign-in.vue';
import AuthSignUp from './_auth-sign-up.vue';

export default {
  name: 'HomePageAuthDialog',

  components: {
    AuthSignIn,
    AuthSignUp,
  },

  computed: {
    ...mapState('auth', [
      'activeTab',
    ]),

    ...mapState('auth/recover-password', {
      isRecoverPasswordShowed: state => state.isPopupOpened,
    }),
  },

  methods: {
    ...mapMutations('auth', {
      setActiveTab: 'SET_ACTIVE_TAB',
      setAuthPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    closeAuthPopup() {
      this.setAuthPopupOpenedStatus(false);
    },

    changeTab(tab) {
      this.setActiveTab(tab);
    },
  },
};
</script>
