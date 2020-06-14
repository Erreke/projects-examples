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
          <p class="modal-card-title">{{ $t('page-admin-redirects.creating-redirect-title') }}</p>
        </header>

        <section class="modal-card-body">
          <create-or-update-form
            @success="handleSuccess"
            @failed="handleFail"
            :is-time-submit="isTimeSubmit"
            :redirects-types="redirectsTypes"
          />
        </section>

        <footer class="modal-card-foot">
          <b-button
            type="is-success"
            icon-left="check"
            native-type="submit"
            :loading="isCreateOrUpdateProcessing"
            :disabled="isCreateOrUpdateProcessing"
          >
            {{ $t('page-admin-redirects.button-save') }}
          </b-button>

          <b-button
            type="is-warning"
            icon-left="cancel"
            @click.prevent="isActive = false"
            :disabled="isCreateOrUpdateProcessing"
          >
            {{ $t('page-admin-redirects.button-cancel') }}
          </b-button>
        </footer>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },

    redirectsTypes: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isTimeSubmit: false,
    };
  },

  components: {
    CreateOrUpdateForm: () => import('./_create-or-update-form'),
  },

  computed: {
    ...mapState('admin/redirects', ['isCreateOrUpdateProcessing', 'createOrUpdateFormItems']),

    isActive: {
      get() {
        return this.isOpened;
      },
      set(value) {
        if (!value && !this.isCreateOrUpdateProcessing) {
          this.$emit('close');
        }
      },
    },
  },

  methods: {
    ...mapActions('admin/redirects', {
      createRedirect: 'CREATE_REDIRECT',
    }),

    submitForm() {
      this.isTimeSubmit = true;
    },

    handleSuccess() {
      this.createRedirect({
        type: this.createOrUpdateFormItems.type,
        redirectFrom: this.createOrUpdateFormItems.redirectFrom,
        redirectTo: this.createOrUpdateFormItems.redirectTo,
        phone: this.createOrUpdateFormItems.type === 'whatsapp' ? this.createOrUpdateFormItems.phone : '',
        text: this.createOrUpdateFormItems.type === 'whatsapp' ? this.createOrUpdateFormItems.text : '',
        file: this.createOrUpdateFormItems.type === 'file' ? this.createOrUpdateFormItems.file : '',
        createdAt: new Date(),
        createdBy: `${this.$_user.firstName} ${this.$_user.secondName}`,
        updatedAt: null,
        updatedBy: null,
      })
        .then((response) => {
          if (response) {
            this.isActive = false;
          }
        });
    },

    handleFail() {
      this.isTimeSubmit = false;
    },
  },
};
</script>
