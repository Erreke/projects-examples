<template>
  <form @submit.prevent="submitForm">
    <create-or-update-form
      @success="handleSuccess"
      @failed="handleFail"
      :is-time-submit="isTimeSubmit"
      :redirects-types="redirectsTypes"
    />

    <div class="buttons">
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
        :disabled="isCreateOrUpdateProcessing"
        @click.prevent="$emit('close')"
      >
        {{ $t('page-admin-redirects.button-cancel') }}
      </b-button>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      isTimeSubmit: false,
    };
  },

  props: {
    redirect: {
      type: Object,
      required: true,
    },

    redirectsTypes: {
      type: Object,
      required: true,
    },
  },

  components: {
    CreateOrUpdateForm: () => import('./_create-or-update-form'),
  },

  computed: {
    ...mapState('admin/redirects', ['isCreateOrUpdateProcessing', 'createOrUpdateFormItems']),
  },

  methods: {
    ...mapActions('admin/redirects', {
      updateRedirect: 'UPDATE_REDIRECT',
    }),

    ...mapMutations('admin/redirects', {
      initCreateOrUpdateFormItems: 'INIT_CREATE_OR_UPDATE_FORM_ITEMS',
    }),

    submitForm() {
      this.isTimeSubmit = true;
    },

    handleSuccess() {
      this.updateRedirect({
        id: this.redirect.id,
        redirect: {
          type: this.createOrUpdateFormItems.type,
          redirectFrom: this.createOrUpdateFormItems.redirectFrom,
          redirectTo: this.createOrUpdateFormItems.redirectTo,
          phone: this.createOrUpdateFormItems.type === 'whatsapp' ? this.createOrUpdateFormItems.phone : '',
          text: this.createOrUpdateFormItems.type === 'whatsapp' ? this.createOrUpdateFormItems.text : '',
          file: this.createOrUpdateFormItems.type === 'file' ? this.createOrUpdateFormItems.file : '',
          isFileChanged: this.createOrUpdateFormItems.isFileChanged,
          updatedBy: `${this.$_user.firstName} ${this.$_user.secondName}`,
          updatedAt: new Date(),
        },
      })
        .then(() => {
          this.$emit('update');
        });
    },

    handleFail() {
      this.isTimeSubmit = false;
    },
  },

  mounted() {
    this.initCreateOrUpdateFormItems({
      type: this.redirect.type,
      redirectFrom: this.redirect.redirectFrom,
      redirectTo: this.redirect.redirectTo,
      phone: this.redirect.phone,
      text: this.redirect.text,
      file: {
        name: this.redirect.file,
      },
      isFileChanged: false,
    });
  },
};
</script>
