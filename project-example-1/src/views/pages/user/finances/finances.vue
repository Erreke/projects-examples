<template>
  <user-layout :title="$t('page-finances.meta-title')" class="agent">
    <transfer-dialog
      :is-active="isTransferDialogOpened"
      @close="isTransferDialogOpened = false"
    />

    <withdrawal-dialog
      :is-active="isWithdrawalDialogOpened"
      @close="isWithdrawalDialogOpened = false"
    />

    <div class="notification is-danger content">
      <h5 style="color: #fff;">Уважаемый клиент!</h5>
      <p>Связи с переходом на другую платежную систему, движение средств временно заблокировано.</p>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child notification">
          <p class="title is-size-4">{{ $t('page-finances.current-balance') }}</p>
          <p class="subtitle">{{ agentBalance | currency_format }}</p>
        </article>
      </div>

      <div class="tile is-parent">
        <article class="tile is-child notification">
          <p class="title is-size-4">{{ $t('page-finances.total-earned') }}</p>
          <p class="subtitle">{{ agentEarned | currency_format }}</p>
        </article>
      </div>

      <div class="tile is-vertical is-parent is-2">
        <article class="tile is-child">
          <b-tooltip
            class="finances__tooltip"
            :label="outputButtonsTooltipText"
            position="is-bottom"
            animated
          >
            <button
              :class="[
                'button is-primary finances__button',
                {'is-large': this.$_device === 'mobile'}
              ]"
              :disabled="isDisabledWithdrawal"
              @click.prevent="isTransferDialogOpened = true"
            >
              <span class="icon">
                <i class="fas fa-arrow-alt-circle-right"></i>
              </span>
              {{ $t('page-finances.transfer') }}
            </button>
          </b-tooltip>
        </article>
        <article class="tile is-child">
          <b-tooltip
            class="finances__tooltip"
            :label="outputButtonsTooltipText"
            position="is-bottom"
            type="is-success"
            animated
          >
            <button
              :class="[
                'button is-success finances__button',
                {'is-large': this.$_device === 'mobile'}
              ]"
              :disabled="isDisabledWithdrawal"
              @click.prevent="isWithdrawalDialogOpened = true"
            >
              <span class="icon">
                <i class="fas fa-arrow-alt-circle-down"></i>
              </span>
              {{ $t('page-finances.withdrawal') }}
            </button>
          </b-tooltip>
        </article>
      </div>
    </div>

    <h2 class="is-size-4">{{ $t('page-finances.details') }}</h2>

    <b-table
      :data="items"
      :hoverable="true"
      paginated
      per-page="15"
      detailed
      ref="table"
      detail-key="id"
      class="finances__table"
      :opened-detailed="[openedRow]"
      :show-detail-icon="false"
      @details-close="closeRow"
      @details-open="closeOtherRows"
    >
      <template slot-scope="props">
        <b-table-column field="amount" :label="$t('page-finances.th-amount')">
          <div class="finances__table-td" @click="toggle(props.row)">
            <template v-if="props.row.amount > 0">
              <span class="tag is-success">
                + {{ Math.abs(props.row.amount) | currency_format }}
              </span>
            </template>
            <template v-else>
              <span class="tag is-danger">
                - {{ Math.abs(props.row.amount) | currency_format }}
              </span>
            </template>
          </div>
        </b-table-column>

        <b-table-column field="operation" :label="$t('page-finances.th-operation-detail')">
          <div class="finances__table-td" @click="toggle(props.row)">
            <template v-if="props.row.isBonus && props.row.reason === 'referral-webinar-watching'">
              <span class="icon">
                <i class="mdi mdi-gift"></i>
              </span>
              {{ $t('page-finances.td-bonus-webinar-watching')  }}
            </template>
            <template v-if="props.row.isBonus && props.row.reason === 'referral-business-buying'">
              <span class="icon">
                <i class="mdi mdi-gift"></i>
              </span>
              {{ $t('page-finances.td-bonus-business-buying', { name: props.row.forWhomName })  }}
            </template>
            <template v-if="props.row.isTransferIn">
              <span class="icon">
                <i class="mdi mdi-arrow-right-bold"></i>
              </span>
              {{ $t('page-finances.td-transfer-in', { name: props.row.fromWhomName}) }}
            </template>
            <template v-if="props.row.isTransferOut">
              <span class="icon">
                <i class="mdi mdi-arrow-left-bold"></i>
              </span>
              {{ $t('page-finances.td-transfer-out', { name: props.row.toWhomName}) }}
            </template>
            <template v-if="props.row.isWithdrawal">
              <span class="icon">
                <i class="mdi mdi-credit-card"></i>
              </span>
              {{ $t('page-finances.td-withdrawal', { cardNumber: props.row.cardNumber}) }}
            </template>
            <template v-if="props.row.isCashback">
              <span class="icon">
                <i class="mdi mdi-sack-percent"></i>
              </span>
              {{ $t('page-finances.td-cashback') }}
            </template>
          </div>
        </b-table-column>

        <b-table-column field="createdAt" :label="$t('page-finances.th-created-at')">
          <div class="finances__table-td" @click="toggle(props.row)">
            {{ props.row.createdAt.seconds | date_time_format }}
          </div>
        </b-table-column>

        <b-table-column field="status" :label="$t('page-finances.th-status')">
          <div class="finances__table-td" @click="toggle(props.row)">
            <span :class="['tag', `is-${detectStatus(props.row).class}`]">
              {{ detectStatus(props.row).text }}
            </span>
          </div>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <div class="finances__table-details">
          <pseudo-table
            :label="$t('page-finances.detail-th-status')"
            :is-slotable="true"
          >
            <span :class="['tag', `is-${detectStatus(props.row).class}`]">
              {{ detectStatus(props.row).text }}
            </span>
          </pseudo-table>

          <pseudo-table
            :label="$t('page-finances.detail-th-id')"
            :value="props.row.id"
          />

          <pseudo-table
            :label="$t('page-finances.detail-th-operation-type')"
            :value="detectOperationType(props.row)"
          />

          <pseudo-table
            v-if="props.row.isBonus
              && props.row.reason === 'referral-business-buying'
              && props.row.forWhomName
              && props.row.forWhomEmail"
            :label="$t('page-finances.detail-th-invited-name')"
            :is-slotable="true"
          >
            {{ props.row.forWhomName }} ({{ props.row.forWhomEmail }})
          </pseudo-table>

          <pseudo-table
            v-if="props.row.isTransferIn && props.row.fromWhomName && props.row.fromWhomEmail"
            :label="$t('page-finances.detail-th-from-whom-name')"
            :is-slotable="true"
          >
            {{ props.row.fromWhomName }} ({{ props.row.fromWhomEmail }})
          </pseudo-table>

          <pseudo-table
            v-if="props.row.isTransferOut && props.row.toWhomName && props.row.toWhomEmail"
            :label="$t('page-finances.detail-th-to-whom-name')"
            :is-slotable="true"
          >
            {{ props.row.toWhomName }} ({{ props.row.toWhomEmail }})
          </pseudo-table>

          <pseudo-table
            v-if="props.row.isWithdrawal"
            :label="$t('page-finances.detail-th-card-number')"
            :value="props.row.cardNumber"
          />

          <pseudo-table
            v-if="props.row.isWithdrawal"
            :label="$t('page-finances.detail-th-amount')"
            :value="Math.abs(props.row.amount) | currency_format"
          />

          <pseudo-table
            v-if="props.row.createdAt"
            :label="$t('page-finances.detail-th-created-at')"
            :value="props.row.createdAt.seconds | date_time_format"
          />

          <pseudo-table
            v-if="props.row.isRejected"
            :label="$t('page-finances.detail-th-rejected-at')"
            :value="props.row.rejectedAt.seconds | date_time_format"
          />

          <pseudo-table
            v-if="props.row.approvedAt"
            :label="$t('page-finances.detail-th-approved-at')"
            :value="props.row.approvedAt.seconds | date_time_format"
          />

          <pseudo-table
            v-if="props.row.rejectReason"
            :label="$t('page-finances.detail-th-reject-reason')"
            :value="props.row.rejectReason"
          />
        </div>
      </template>

      <template slot="empty">
        <div class="finances__table-empty">
          <span v-if="isLoading">
            {{ $t('page-finances.loading') }}
          </span>
          <span v-else>
            {{ $t('page-finances.empty-table') }}
          </span>
        </div>
      </template>
    </b-table>
  </user-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'AgentPage',

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
    TransferDialog: () => import('@/views/blocks/transfer-dialog.vue'),
    WithdrawalDialog: () => import('@/views/blocks/withdrawal-dialog.vue'),
  },

  data() {
    return {
      openedRow: null,
      isTransferDialogOpened: false,
      isWithdrawalDialogOpened: false,
      isDisabledWithdrawal: true,
    };
  },

  usedVuexModules: ['finance'],

  computed: {
    ...mapState('finance', ['items', 'isLoading']),

    ...mapGetters('finance', [
      'agentBalance',
      'agentEarned',
    ]),

    outputButtonsTooltipText() {
      return this.agentBalance > 0 ? '' : this.$t('page-finances.not-enought-money');
    },
  },

  methods: {
    ...mapActions('finance', {
      fetchFinances: 'FETCH_FINANCES',
    }),

    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.id;
    },

    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },

    detectOperationType(row) {
      if (row.isBonus && row.reason === 'referral-webinar-watching') {
        return this.$t('page-finances.detail-td-operation-type-bonus-webinar-watching');
      }

      if (row.isBonus && row.reason === 'referral-business-buying') {
        return this.$t('page-finances.detail-td-operation-type-bonus-business-buying');
      }

      if (row.isWithdrawal) {
        return this.$t('page-finances.detail-td-operation-type-withdrawal');
      }

      if (row.isTransferOut) {
        return this.$t('page-finances.detail-td-operation-type-transfer-out');
      }

      if (row.isTransferIn) {
        return this.$t('page-finances.detail-td-operation-type-transfer-in');
      }

      if (row.isCashback) {
        return this.$t('page-finances.detail-td-operation-type-cashback');
      }

      return this.$t('page-finances.detail-td-operation-type-unknown');
    },

    detectStatus(row) {
      if (!row.isApproved && !row.isRejected) {
        return {
          class: 'warning',
          text: this.$t('page-finances.td-status-pending'),
        };
      }

      if (!row.isApproved && row.isRejected) {
        return {
          class: 'danger',
          text: this.$t('page-finances.td-status-rejected'),
        };
      }

      if (row.isApproved && !row.isRejected) {
        return {
          class: 'success',
          text: this.$t('page-finances.td-status-approved'),
        };
      }

      return {
        class: 'light',
        text: this.$t('page-finances.td-status-unknown'),
      };
    },
  },

  mounted() {
    this.fetchFinances(this.$_user.uid);
  },
};
</script>

<style lang="scss">
.finances {
  &__table {
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
      margin: 0 auto;
      max-width: 900px;
      padding: 2rem;
      background-color: #fafafa;
    }

    &-empty {
      line-height: 6em;
      text-align: center;
      color: #989898;
    }
  }

  &__button {
    width: 100%;
    justify-content: flex-start;

    .icon {
      margin-right: 4px!important;
    }
  }

  &__tooltip {
    width: 100%;
  }
}
</style>
