<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <form @submit.prevent="submitForm" name="password-change" method="post">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ $t("block-global.password-changing") }}
          </p>
        </header>

        <section class="modal-card-body">
          <input name="email" type="hidden" :value="$_user.email" />

          <b-field
            :type="{ 'is-danger': currentPasswordErrorMessages.length }"
            :message="currentPasswordErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="current-password"
              password-reveal
              v-model="currentPassword"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.current-password-placeholder')"
            />
          </b-field>

          <b-field
            class="new-password"
            :type="{ 'is-danger': passwordErrorMessages.length }"
            :message="passwordErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="password"
              password-reveal
              v-model="password"
              autocomplete="new-password"
              :disabled="isFormProcessing"
              :placeholder="$t('block-global.new-password-placeholder')"
            />
            <!-- <div class="new-password__complexity"></div> -->
          </b-field>

          <b-field
            :type="{ 'is-danger': passwordConfirmErrorMessages.length }"
            :message="passwordConfirmErrorMessages"
          >
            <b-input
              icon="key"
              type="password"
              name="confirmPassword"
              password-reveal
              v-model="confirmPassword"
              autocomplete="new-password"
              :disabled="isFormProcessing"
              :placeholder="
                $t('block-global.new-password-confirmation-placeholder')
              "
            />
          </b-field>
        </section>

        <footer class="modal-card-foot">
          <b-field
            :type="{ 'is-danger': formErrorsMessages.length }"
            :message="formErrorsMessages"
          >
            <button
              class="button"
              type="button"
              :disabled="isFormProcessing"
              @click="isOpened = false"
            >
              <span class="icon">
                <i class="mdi mdi-cancel"></i>
              </span>
              <span>{{ $t("block-global.cancel") }}</span>
            </button>
            <button
              :class="['button is-primary', { 'is-loading': isFormProcessing }]"
            >
              <span class="icon">
                <i class="mdi mdi-check"></i>
              </span>
              <span>{{ $t("block-global.change") }}</span>
            </button>
          </b-field>
        </footer>
      </form>
    </div>
  </b-modal>
</template>

<script>
import passwordChanger from "@/utils/mixins/password-changer";

export default {
  name: "ProfilePageChangePasswordDialog",

  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    isOpened: {
      get() {
        return this.isActive;
      },

      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    }
  },

  mixins: [passwordChanger],

  methods: {
    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.changePassword({
          currentPassword: this.currentPassword,
          password: this.password
        }).then(response => {
          if (response) {
            this.isOpened = false;
            this.$buefy.toast.open({
              message: this.$t("block-global.password-changed-successful"),
              type: "is-success",
              duration: 3000
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.new-password {
  flex-flow: row wrap;

  .control {
    flex: 0 0 100%;
  }

  &__complexity {
    flex: 0 0 100%;
    background-color: #00d1b2;
    height: 2px;
  }
}
</style>
