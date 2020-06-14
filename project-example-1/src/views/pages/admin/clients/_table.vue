<template>
<div>
  <discount-deadline-dialog
    :is-opened="isDiscountModalActive"
    :current-operation="currentOperation"
    :current-client="currentClient"
    :discounts="discounts"
    @close="closeDiscountDialog"
  />

  <confirmation-dialog
    :is-opened="isConfirmationModalActive"
    :current-operation="currentOperation"
    :current-client="currentClient"
    :is-processing="isProcessing"
    @confirm="confirm"
    @close="closeConfirmationDialog"
  />

  <b-table
    :data="clients"
    :hoverable="true"
    :paginated="isPaginated"
    :per-page="perPage"
    detailed
    ref="table"
    detail-key="uid"
    class="admin-clients__table"
    :opened-detailed="[openedRow]"
    :show-detail-icon="false"
    aria-next-label="Next page"
    aria-previous-label="Previous page"
    aria-page-label="Page"
    aria-current-label="Current page"
    @details-close="closeRow"
    @details-open="closeOtherRows"
  >
    <template slot-scope="props">
      <b-table-column
        field="uid"
        :visible="columns.includes('uid')"
        :label="$t('page-admin-clients.th-uid')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          <span v-if="props.row.warning" class="icon has-text-danger">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          <span>{{ props.row.uid }}</span>
        </div>
      </b-table-column>

      <b-table-column
        field="firstName"
        :visible="columns.includes('firstName')"
        :label="$t('page-admin-clients.th-first-name')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.firstName ? props.row.firstName : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="secondName"
        :visible="columns.includes('secondName')"
        :label="$t('page-admin-clients.th-second-name')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.secondName ? props.row.secondName : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="email"
        :visible="columns.includes('email')"
        :label="$t('page-admin-clients.th-email')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.email ? props.row.email : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="phone"
        :visible="columns.includes('phone')"
        :label="$t('page-admin-clients.th-phone')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.phone ? props.row.phone : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="nickname"
        :visible="columns.includes('nickname')"
        :label="$t('page-admin-clients.th-nickname')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.nickname ? props.row.nickname : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="gender"
        :visible="columns.includes('gender')"
        :label="$t('page-admin-clients.th-gender')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.gender ? $t(`page-admin-clients.sm-td-gender-${props.row.gender}`) : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="country"
        :visible="columns.includes('country')"
        :label="$t('page-admin-clients.th-country')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.country ? props.row.country : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="city"
        :visible="columns.includes('city')"
        :label="$t('page-admin-clients.th-city')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.city ? props.row.city : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="bonusHolderId"
        :visible="columns.includes('bonusHolderId')"
        :label="$t('page-admin-clients.th-bonus-holder-id')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.bonusHolderId ? props.row.bonusHolderId : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="bonusHolderNick"
        :visible="columns.includes('bonusHolderNick')"
        :label="$t('page-admin-clients.th-bonus-holder-nick')"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          {{ props.row.bonusHolderNick ? props.row.bonusHolderNick : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="createdAt"
        :visible="columns.includes('createdAt')"
        :label="$t('page-admin-clients.th-registered-at')"
        :custom-sort="sortByCreatedAt"
        sortable
      >
        <div class="admin-clients__table-td" @click="toggle(props.row)">
          <span v-if="props.row.createdAt">
            {{ props.row.createdAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>
    </template>

    <template slot="detail" slot-scope="props">
      <div class="admin-clients__table-details">
        <client-details
          :client="props.row"
          :discounts="discounts"
        />

        <client-actions
          :client="props.row"
          :discounts="discounts"
          @open-confirmation-dialog="openConfirmationDialog"
          @open-discount-deadline-dialog="openDiscountDeadlineDialog"
        />
      </div>
    </template>

    <template slot="empty">
      <div class="admin-clients__table-empty">
        <span v-if="isLoading">
          {{ $t('page-admin-clients.loading') }}
        </span>
        <span v-else-if="allClientsCount > 0">
          {{ $t('page-admin-clients.nobody-found-for-your-request') }}
        </span>
        <span v-else>
          {{ $t('page-admin-clients.nobody-found') }}
        </span>
      </div>
    </template>
  </b-table>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AdminClientsPageTable',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    clients: {
      type: Array,
      required: true,
    },

    discounts: {
      type: Object,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },

    allClientsCount: {
      type: Number,
      required: true,
    },

    perPage: {
      type: Number,
      default: 15,
    },
  },

  components: {
    DiscountDeadlineDialog: () => import('./_discount-deadline-dialog.vue'),
    ConfirmationDialog: () => import('./_confirmation-dialog.vue'),
    ClientDetails: () => import('./_details.vue'),
    ClientActions: () => import('./_actions.vue'),
  },

  data() {
    return {
      openedRow: null,
      currentClient: null,
      currentOperation: null,
      isConfirmationModalActive: false,
      isDiscountModalActive: false,
      isProcessing: false,
    };
  },

  computed: {
    isPaginated() {
      return this.allClientsCount > 0 && this.perPage > 0;
    },
  },

  methods: {
    ...mapActions('admin/clients', {
      saveClientInfo: 'SAVE_CLIENT_INFO',
      deleteClient: 'DELETE_CLIENT',
      deleteClientDiscountDeadline: 'DELETE_CLIENT_DISCOUNT_DEADLINE',
    }),

    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.uid;
    },

    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },

    sortByDate(rowA, rowB, isDirectionDesc) {
      const A = rowA ? rowA.seconds : 0;
      const B = rowB ? rowB.seconds : 0;

      if (A < B) {
        if (isDirectionDesc) {
          return 1;
        }

        return -1;
      }

      if (A > B) {
        if (isDirectionDesc) {
          return -1;
        }

        return 1;
      }

      return 0;
    },

    sortByCreatedAt(rowA, rowB, isDirectionDesc) {
      return this.sortByDate(
        rowA.createdAt,
        rowB.createdAt,
        isDirectionDesc,
      );
    },

    deleteDiscount() {
      return this.deleteClientDiscountDeadline(this.currentClient.uid);
    },

    blockClient() {
      return this.saveClientInfo({
        uid: this.currentClient.uid,
        fields: [
          'isArchived',
          'archivedAt',
        ],
        values: [
          true,
          new Date(),
        ],
      });
    },

    unBlockClient() {
      return this.saveClientInfo({
        uid: this.currentClient.uid,
        fields: [
          'isArchived',
          'archivedAt',
        ],
        values: [
          false,
          null,
        ],
      });
    },

    deleteUser() {
      return this.deleteClient({
        uid: this.currentClient.uid,
        aid: this.$_user.uid,
      });
    },

    openConfirmationDialog({ operation, client }) {
      this.currentOperation = operation;
      this.currentClient = client;
      this.isConfirmationModalActive = true;
    },

    closeConfirmationDialog() {
      this.currentOperation = null;
      this.currentClient = null;
      this.isConfirmationModalActive = false;
      this.isProcessing = false;
    },

    openDiscountDeadlineDialog({ operation, client }) {
      this.currentOperation = operation;
      this.currentClient = client;
      this.isDiscountModalActive = true;
    },

    closeDiscountDialog() {
      this.isDiscountModalActive = false;
      this.currentOperation = null;
      this.currentClient = null;
    },

    confirm() {
      this.isProcessing = true;

      this[this.currentOperation]()
        .then(() => {
          this.closeConfirmationDialog();
        });
    },
  },
};
</script>

<style lang="scss">
.admin-clients__table {
  .table > tbody > tr> td {
    padding: 0;
  }

  &-td {
    cursor: pointer;
    padding: 0.5em 0.75em;
  }

  .detail {
    td,
    .detail-container {
      padding: 0!important;
    }
  }

  &-details {
    display: flex;
    cursor: default;
    justify-content: space-between;
  }

  &-empty {
    line-height: 6em;
    text-align: center;
    color: #989898;
  }
}
</style>
