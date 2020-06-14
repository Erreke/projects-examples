<template>
  <div class="modal-card">
    <div class="trx_addons_popup">
      <div class="trx_addons_tabs ui-tabs ui-widget ui-widget-content ui-corner-all">
        <div class="
          trx_addons_tabs_content trx_addons_login_content
          ui-tabs-panel ui-widget-content ui-corner-bottom
        ">
          <div class="trx_addons_popup_form_wrap trx_addons_popup_form_wrap_login">

            <div :class="['verification', { 'is-loading': !formErrorsMessages.length }]">
              <p class="title" v-if="!formErrorsMessages.length">
                {{ $t('block-auth.recovering-email') }}
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
  name: 'HomePageAuthRecoverEmail',

  props: {
    actionCode: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState('auth/recover-email', {
      formErrors: state => state.errors,
    }),

    formErrorsMessages() {
      return this.formErrors.map(item => this.$t(`block-errors.recover-email.${item}`));
    },
  },

  methods: {
    ...mapActions('auth/recover-email', {
      recoverEmail: 'RECOVER_EMAIL',
    }),

    ...mapMutations('auth', {
      setActiveTab: 'SET_ACTIVE_TAB',
      setAuthPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),
  },

  created() {
    this.recoverEmail(this.actionCode)
      .then((response) => {
        if (response) {
          this.setActiveTab('login');
          this.setAuthPopupOpenedStatus(true);

          this.$router.push({
            name: 'home',
          });
        }
      });
  },
};
</script>
