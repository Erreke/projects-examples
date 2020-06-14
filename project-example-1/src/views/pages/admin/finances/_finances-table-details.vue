<template>
  <b-table
    class="admin__table"
    detail-key="id"
    ref="financesTableDetails"
    :data="items"
    :detailed="true"
    :hoverable="true"
    :mobile-cards="false"
    :show-detail-icon="false"
    :opened-detailed="[openedRow]"
    @details-close="closeRow"
    @details-open="closeOtherRows"
  >
    <template slot-scope="props">
      <b-table-column
        field="createdAt"
        label="Дата"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.createdAt.seconds | date_time_format }}
        </div>
      </b-table-column>

      <b-table-column
        field="amount"
        label="Сумма"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <template v-if="props.row.amount > 0">
            + {{ Math.abs(props.row.amount) | currency_format }}
          </template>
          <template v-else>
            - {{ Math.abs(props.row.amount) | currency_format }}
          </template>
        </div>
      </b-table-column>

      <b-table-column
        field="amount"
        label="Операция"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <template v-if="props.row.isBonus && props.row.reason === 'referral-webinar-watching'">
            <span class="icon">
              <i class="mdi mdi-gift"></i>
            </span>
            {{ $t('page-admin-finances.td-bonus-webinar-watching')  }}
          </template>
          <template v-if="props.row.isBonus && props.row.reason === 'referral-business-buying'">
            <span class="icon">
              <i class="mdi mdi-gift"></i>
            </span>
            {{ $t('page-admin-finances.td-bonus-business-buying', { name: props.row.forWhomName })  }}
          </template>
          <template v-if="props.row.isTransferIn">
            <span class="icon">
              <i class="mdi mdi-arrow-right-bold"></i>
            </span>
            {{ $t('page-admin-finances.td-transfer-in', { name: props.row.fromWhomName}) }}
          </template>
          <template v-if="props.row.isTransferOut">
            <span class="icon">
              <i class="mdi mdi-arrow-left-bold"></i>
            </span>
            {{ $t('page-admin-finances.td-transfer-out', { name: props.row.toWhomName}) }}
          </template>
          <template v-if="props.row.isWithdrawal">
            <span class="icon">
              <i class="mdi mdi-credit-card"></i>
            </span>
            {{ $t('page-admin-finances.td-withdrawal', { cardNumber: props.row.cardNumber}) }}
          </template>
          <template v-if="props.row.isCashback">
            <span class="icon">
              <i class="mdi mdi-sack-percent"></i>
            </span>
            {{ $t('page-admin-finances.td-cashback') }}
          </template>
        </div>
      </b-table-column>

      <b-table-column
        field="status"
        label="Статус"
        :custom-sort="sortByStatus"
        sortable
      >
        <div
          class="admin__table-td"
          @click="toggle(props.row)"
        >
            <span class="icon">
              <i :class="`mdi ${detectStatus(props.row).icon}`"></i>
            </span>
          {{ detectStatus(props.row).text }}
        </div>
      </b-table-column>
    </template>

    <template slot="detail" slot-scope="props">
      <pseudo-table
        label="Статус:"
        :value="detectStatus(props.row).text"
      />

      <pseudo-table
        :label="$t('page-admin-finances.detail-th-id')"
        :value="props.row.id"
      />

      <pseudo-table
        :label="$t('page-admin-finances.detail-th-operation-type')"
        :value="detectOperationType(props.row)"
      />

      <pseudo-table
        v-if="props.row.isBonus
          && props.row.reason === 'referral-business-buying'
          && props.row.forWhomName
          && props.row.forWhomEmail"
        :label="$t('page-admin-finances.detail-th-invited-name')"
        :value="`${props.row.forWhomName} (${props.row.forWhomEmail})`"
      />

      <pseudo-table
        v-if="props.row.isTransferIn && props.row.fromWhomName && props.row.fromWhomEmail"
        :label="$t('page-admin-finances.detail-th-from-whom-name')"
        :value="`${props.row.fromWhomName} (${props.row.fromWhomEmail})`"
      />

      <pseudo-table
        v-if="props.row.isTransferOut && props.row.toWhomName && props.row.toWhomEmail"
        :label="$t('page-admin-finances.detail-th-to-whom-name')"
        :value="`${props.row.toWhomName} (${props.row.toWhomEmail})`"
      />

      <pseudo-table
        v-if="props.row.isWithdrawal"
        :label="$t('page-admin-finances.detail-th-card-number')"
        :value="props.row.cardNumber"
      />

      <pseudo-table
        v-if="props.row.isWithdrawal"
        :label="$t('page-admin-finances.detail-th-amount')"
        :value="Math.abs(props.row.amount) | currency_format"
      />

      <pseudo-table
        v-if="props.row.createdAt"
        :label="$t('page-admin-finances.detail-th-created-at')"
        :value="props.row.createdAt.seconds | date_time_format"
      />

      <pseudo-table
        v-if="props.row.isRejected"
        :label="$t('page-admin-finances.detail-th-rejected-at')"
        :value="props.row.isRejected.seconds | date_time_format"
      />

      <pseudo-table
        v-if="props.row.approvedAt"
        :label="$t('page-admin-finances.detail-th-approved-at')"
        :value="props.row.approvedAt.seconds | date_time_format"
      />

      <pseudo-table
        v-if="props.row.rejectReason"
        :label="$t('page-admin-finances.detail-th-reject-reason')"
        :value="props.row.rejectReason"
      />

      <div class="admin__table-finances-actions">
        <button
          v-if="props.row.isWithdrawal && !props.row.isApproved && !props.row.isRejected"
          class="button is-success"
          @click.prevent="$emit('approve-withdrawal', props.row)"
        >
          <span class="icon">
            <i class="mdi mdi-check"></i>
          </span>
          <span>
            {{ $t('page-admin-finances.btn-approve-withdrawal') }}
          </span>
        </button>

        <button
          v-if="props.row.isWithdrawal && !props.row.isApproved && !props.row.isRejected"
          class="button is-warning"
          @click.prevent="$emit('reject-withdrawal', props.row)"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>
            {{ $t('page-admin-finances.btn-reject-withdrawal') }}
          </span>
        </button>

        <button
          v-if="props.row.isWithdrawal && props.row.isApproved && isOperationNotExpired(props.row)"
          class="button is-warning"
          @click.prevent="$emit('unapprove-withdrawal', props.row)"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>
            {{ $t('page-admin-finances.btn-unapprove-withdrawal') }}
          </span>
        </button>

        <button
          v-if="props.row.isWithdrawal && props.row.isRejected && isOperationNotExpired(props.row)"
          class="button is-warning"
          @click.prevent="$emit('unreject-withdrawal', props.row)"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>
            {{ $t('page-admin-finances.btn-unreject-withdrawal') }}
          </span>
        </button>

        <button
          class="button is-danger"
          @click.prevent="$emit('delete-operation', props.row)"
        >
          <span class="icon">
            <i class="mdi mdi-delete"></i>
          </span>
          <span>
            {{ $t('page-admin-finances.btn-delete-operation') }}
          </span>
        </button>
      </div>
    </template>

    <template slot="empty">
      <div class="admin__table-finances-empty">
        <p>Финансовых операции не найдено</p>
      </div>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
    },
  },

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },

  data() {
    return {
      filter: 'unknown',
      openedRow: null,
    };
  },

  methods: {
    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.id;
    },

    toggle(row) {
      this.$refs.financesTableDetails.toggleDetails(row);
    },

    detectStatus(row) {
      if (!row.isApproved && !row.isRejected) {
        return {
          color: '#ffdd57',
          class: 'warning',
          icon: 'mdi-alert',
          text: this.$t('page-admin-finances.td-status-pending'),
        };
      }

      if (!row.isApproved && row.isRejected) {
        return {
          color: '#ff3860',
          class: 'danger',
          icon: 'mdi-close',
          text: this.$t('page-admin-finances.td-status-rejected'),
        };
      }

      if (row.isApproved && !row.isRejected) {
        return {
          color: '#23d160',
          class: 'success',
          icon: 'mdi-check',
          text: this.$t('page-admin-finances.td-status-approved'),
        };
      }

      return {
        color: '#f5f5f5',
        class: 'light',
        icon: 'mdi-flash',
        text: this.$t('page-admin-finances.td-status-unknown'),
      };
    },

    detectOperationType(row) {
      if (row.isBonus && row.reason === 'referral-webinar-watching') {
        return this.$t('page-admin-finances.detail-td-operation-type-bonus-webinar-watching');
      }

      if (row.isBonus && row.reason === 'referral-business-buying') {
        return this.$t('page-admin-finances.detail-td-operation-type-bonus-business-buying');
      }

      if (row.isWithdrawal) {
        return this.$t('page-admin-finances.detail-td-operation-type-withdrawal');
      }

      if (row.isTransferOut) {
        return this.$t('page-admin-finances.detail-td-operation-type-transfer-out');
      }

      if (row.isTransferIn) {
        return this.$t('page-admin-finances.detail-td-operation-type-transfer-in');
      }

      if (row.isCashback) {
        return this.$t('page-admin-finances.detail-td-operation-type-cashback');
      }

      return this.$t('page-admin-finances.detail-td-operation-type-unknown');
    },

    isOperationNotExpired(row) {
      if (row.approvedAt) {
        const now = Date.now() / 1000;
        const sinceApprove = Math.floor((now - row.approvedAt.seconds) / 60 / 60);

        return sinceApprove < 24;
      }

      if (row.rejectedAt) {
        const now = Date.now() / 1000;
        const sinceReject = Math.floor((now - row.rejectedAt.seconds) / 60 / 60);

        return sinceReject < 24;
      }

      return false;
    },

    sortByStatus(rowA, rowB, isDirectionDesc) {
      let A;
      let B;

      if (rowA.isApproved && !rowA.isRejected) A = 0; // approved
      if (!rowA.isApproved && !rowA.isRejected) A = 1; // pending
      if (!rowA.isApproved && rowA.isRejected) A = 2; // rejected

      if (rowB.isApproved && !rowB.isRejected) B = 0; // approved
      if (!rowB.isApproved && !rowB.isRejected) B = 1; // pending
      if (!rowB.isApproved && rowB.isRejected) B = 2; // rejected

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
  },
};
</script>
