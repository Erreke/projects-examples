<template>
  <div>
    <div class="content" v-if="!isUpdateFormOpened">
      <table>
        <tr>
          <th>{{ $t('page-admin-redirects.redirect-detail-type') }}</th>
          <td>{{ redirectsTypes[redirect.type]  }}</td>
        </tr>
        <tr>
          <th>{{ $t('page-admin-redirects.redirect-detail-redirect-from') }}</th>
          <td>
            <a :href="redirectFrom" target="_blank">
              {{ redirectFrom }}
            </a>
          </td>
        </tr>
        <tr>
          <th>{{ $t('page-admin-redirects.redirect-detail-redirect-to') }}</th>
          <td>
            <a class="redirect-to-link" :href="redirect.redirectTo" target="_blank">
              {{ redirect.redirectTo }}
            </a>
          </td>
        </tr>
        <tr v-if="redirect.type === 'whatsapp'">
          <th>{{ $t('page-admin-redirects.redirect-detail-phone') }}</th>
          <td>{{ redirect.phone }}</td>
        </tr>
        <tr v-if="redirect.type === 'whatsapp'">
          <th>{{ $t('page-admin-redirects.redirect-detail-text') }}</th>
          <td>{{ redirect.text }}</td>
        </tr>
        <tr v-if="redirect.createdBy && redirect.createdAt">
          <th>{{ $t('page-admin-redirects.redirect-detail-created-by-at') }}</th>
          <td>{{ redirect.createdBy }} ({{ redirect.createdAt | date_format }})</td>
        </tr>
        <tr v-if="redirect.updatedBy && redirect.updatedAt">
          <th>{{ $t('page-admin-redirects.redirect-detail-updated-by-at') }}</th>
          <td>{{ redirect.updatedBy }} ({{ redirect.updatedAt | date_format }})</td>
        </tr>
      </table>

      <div class="buttons">
        <b-button
          type="is-success"
          icon-left="pen"
          :disabled="isDeleting"
          @click.prevent="isUpdateFormOpened = true"
        >
          {{ $t('page-admin-redirects.button-edit') }}
        </b-button>

        <b-button
          type="is-danger"
          icon-left="delete"
          :loading="isDeleting"
          :disabled="isDeleting"
          @click.prevent="deleteItem"
        >
          {{ $t('page-admin-redirects.button-delete') }}
        </b-button>
      </div>
    </div>

    <update-redirect-form
      v-if="isUpdateFormOpened"
      :redirect="redirect"
      :redirects-types="redirectsTypes"
      @update="closeUpdateForm"
      @close="closeDetails"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
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
    UpdateRedirectForm: () => import('./_update-redirect-form'),
  },

  data() {
    return {
      isUpdateFormOpened: false,
      reserveForRecovering: this.redirect,
    };
  },

  computed: {
    ...mapState('admin/redirects', ['isDeleting']),

    redirectFrom() {
      // https://bot.host.com/registration/ это https://bot.host.com/
      if (this.redirect.redirectFrom === 'registration') {
        return 'https://bot.host.com/';
      }

      return `https://bot.host.com/${this.redirect.redirectFrom}/`;
    },
  },

  methods: {
    ...mapActions('admin/redirects', {
      deleteRedirect: 'DELETE_REDIRECT',
      recoverRedirect: 'RECOVER_REDIRECT',
    }),

    deleteItem() {
      const snackbarMessage = this.$t('page-admin-redirects.redirect-has-deleted', { link: this.reserveForRecovering.redirectFrom });
      const actionTextMessage = this.$t('page-admin-redirects.cancel-deleting');
      const toastSuccessMessage = this.$t('page-admin-redirects.redirect-has-recovered');
      const toastFailMessage = this.$t('page-admin-redirects.error-has-occured');

      this.deleteRedirect(this.redirect.id)
        .then(() => {
          this.$buefy.snackbar.open({
            duration: 6000,
            message: snackbarMessage,
            type: 'is-danger',
            position: 'is-bottom-left',
            actionText: actionTextMessage,
            queue: false,
            onAction: () => {
              this.recoverRedirect(this.reserveForRecovering)
                .then((response) => {
                  if (response) {
                    this.$buefy.toast.open({
                      message: toastSuccessMessage,
                      type: 'is-success',
                      queue: false,
                    });
                  } else {
                    this.$buefy.toast.open({
                      message: toastFailMessage,
                      type: 'is-danger',
                      queue: false,
                    });
                  }
                });
            },
          });
        });
    },

    closeUpdateForm() {
      this.isUpdateFormOpened = false;
      this.$emit('close');
    },

    closeDetails() {
      this.isUpdateFormOpened = false;
    },
  },
};
</script>

<style lang="scss">
  .redirect-to-link {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 600px;
    display: inline-block;
  }
</style>
