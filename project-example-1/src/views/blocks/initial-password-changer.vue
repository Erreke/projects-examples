<template>
  <b-modal :active="!hasInitialPasswordBeenChanged" :has-modal-card="true" :can-cancel="false">
    <div class="modal-card" style="width: 100%;">
      <form
        method="post"
        name="password-change"
        class="password-changer"
        @submit.prevent="submitForm"
      >
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('block-initial-password-changer.title') }}</p>
        </header>

        <section class="modal-card-body">
          <input name="email" type="hidden" :value="$_user && $_user.email" />

          <div class="content">
            <p>{{ $t('block-initial-password-changer.for-security-reasons-change-password') }}</p>
          </div>

          <b-field
            :type="{ 'is-danger': currentPasswordErrorMessages.length }"
            :message="currentPasswordErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="current-password"
              :size="$_interfaceSize"
              password-reveal
              v-model="currentPassword"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.current-password-placeholder')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': passwordErrorMessages.length }"
            :message="passwordErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="password"
              :size="$_interfaceSize"
              password-reveal
              v-model="password"
              autocomplete="new-password"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.new-password-placeholder')"
            />
          </b-field>

          <b-field
            :type="{ 'is-danger': passwordConfirmErrorMessages.length }"
            :message="passwordConfirmErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="confirmPassword"
              :size="$_interfaceSize"
              password-reveal
              v-model="confirmPassword"
              autocomplete="new-password"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.new-password-confirmation-placeholder')"
            />
          </b-field>

          <b-notification
            v-if="formErrorsMessages.length > 0"
            type="is-danger"
            has-icon
            aria-close-label="Close notification"
            role="alert"
            :closable="false"
          >
            <ul v-if="formErrorsMessages.length > 1">
              <li v-for="(item, key) in formErrorsMessages" :key="key">{{ item }}</li>
            </ul>
            <span v-else>{{ formErrorsMessages[0] }}</span>
          </b-notification>

        </section>

        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            @click="cancelAndQuit"
          >
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
            <span>{{ $t('block-initial-password-changer.cancel-and-quit') }}</span>
          </button>
          <button
            type="submit"
            :class="['button is-primary', { 'is-loading': isFormProcessing }]"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t('block-initial-password-changer.continue') }}</span>
          </button>
        </footer>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { mapActions } from 'vuex';
import passwordChanger from '@/utils/mixins/password-changer';

export default {
  name: 'BlockWizard',

  mixins: [passwordChanger],

  computed: {
    hasInitialPasswordBeenChanged() {
      return this.$_user && this.$_user.hasInitialPasswordBeenChanged;
    },
  },

  methods: {
    ...mapActions('auth', {
      signOut: 'SIGN_OUT',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.changePassword({
          currentPassword: this.currentPassword,
          password: this.password,
        })
          .then((response) => {
            if (response) {
              this.saveUserInfo({
                uid: this.$_user.uid,
                fields: ['hasInitialPasswordBeenChanged'],
                values: [true],
                loader: 'auth/change-password/SET_PROCESSING',
              });

              this.currentPassword = '';
              this.password = '';
              this.confirmPassword = '';
            }
          });
      }
    },

    cancelAndQuit() {
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
};
</script>

<style>
.password-changer {
  margin-bottom: 2em;
}
</style>
