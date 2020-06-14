<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
  >
    <div class="modal-card">
      <form @submit.prevent="submitForm">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('page-admin-redirects.creating-new-phone-title') }}</p>
        </header>

        <section class="modal-card-body">
          <b-field :label="$t('page-admin-redirects.label-phone')"
           :type="phoneError.length ? 'is-danger' : null" :message="phoneError">
            <b-input v-model="phone" :disabled="isCreating"></b-input>
          </b-field>
        </section>

        <footer class="modal-card-foot">
          <b-button
            type="is-success"
            icon-left="plus"
            native-type="submit"
            :loading="isCreating"
            :disabled="isCreating"
          >
            {{ $t('page-admin-redirects.button-add') }}
          </b-button>

          <b-button
            type="is-warning"
            icon-left="cancel"
            @click.prevent="isActive = false"
            :disabled="isCreating"
          >
            {{ $t('page-admin-redirects.button-cancel') }}
          </b-button>
        </footer>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState('admin/redirects', ['isNewPhoneCreating']),

    isActive: {
      get() {
        return this.isOpened;
      },
      set(value) {
        if (!value && !this.isNewPhoneCreating) {
          this.$emit('close');
        }
      },
    },
  },
};
</script>
