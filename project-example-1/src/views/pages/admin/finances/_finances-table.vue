<template>
  <b-table
    class="admin__table admin__table-finances"
    detail-key="uid"
    ref="financesTable"
    :data="items"
    :per-page="perPage"
    :paginated="true"
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
        field="firstName"
        label="Имя"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.firstName ? props.row.firstName : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="secondName"
        label="Фамилия"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.secondName ? props.row.secondName : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="email"
        label="Емейл"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.email ? props.row.email : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="phone"
        label="Телефон"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.phone ? props.row.phone : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="balance"
        label="Баланс"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.balance | currency_format }}
        </div>
      </b-table-column>

      <b-table-column
        field="cashback"
        label="Кэшбэк"
        :custom-sort="sortByCashback"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span class="tag is-success" v-if="props.row.cashbacks.is20Accrued">
            {{ 20 | currency_format }}
          </span>
          <span class="tag is-warning" v-if="props.row.cashbacks.is30Accrued">
            {{ 30 | currency_format }}
          </span>
          <span class="tag is-danger" v-if="props.row.cashbacks.is40Accrued">
            {{ 40 | currency_format }}
          </span>
        </div>
      </b-table-column>

      <b-table-column
        field="withdrawals"
        label="Запросы на вывод"
        :custom-sort="sortByWithdrawals"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span class="tag is-info" v-for="(item, key) in props.row.withdrawals.items" :key="key">
            {{ Math.abs(item.amount) | currency_format }}
          </span>
        </div>
      </b-table-column>
    </template>

    <template slot="detail" slot-scope="props">
      <div class="admin__table-finances-details">
        <div class="admin__table-finances-details-left">
          <div class="admin__table-finances-details-balanse">
            <p class="admin__table-finances-details-balanse-title">Баланс:</p>
            <p class="admin__table-finances-details-balanse-text">
              {{ props.row.balance | currency_format }}
            </p>
          </div>

          <div class="admin__table-finances-details-cashback">
            <p class="admin__table-finances-details-cashback-title">Кэшбэк:</p>
            <div class="buttons">
              <button
                class="button is-fullwidth"
                :disabled="props.row.cashbacks.is20Accrued"
                @click.prevent="$emit('add-cashback-20', props.row)"
              >
                <span class="icon">
                  <i class="mdi mdi-wallet"></i>
                </span>
                <span>Начислить 20$</span>
              </button>

              <button
                class="button is-fullwidth"
                :disabled="props.row.cashbacks.is30Accrued"
                @click.prevent="$emit('add-cashback-30', props.row)"
              >
                <span class="icon">
                  <i class="mdi mdi-wallet"></i>
                </span>
                <span>Начислить 30$</span>
              </button>

              <button
                class="button is-fullwidth"
                :disabled="props.row.cashbacks.is40Accrued"
                @click.prevent="$emit('add-cashback-40', props.row)"
              >
                <span class="icon">
                  <i class="mdi mdi-wallet"></i>
                </span>
                <span>Начислить 40$</span>
              </button>
            </div>
          </div>
        </div>

        <div class="admin__table-finances-details-right">
          <p class="admin__table-finances-details-right-title">Финансовые операции:</p>

          <finances-table-details
            :items="props.row.finances"
            @approve-withdrawal="(details) => $emit('approve-withdrawal', props.row, details)"
            @unapprove-withdrawal="(details) => $emit('unapprove-withdrawal', props.row, details)"
            @reject-withdrawal="(details) => $emit('reject-withdrawal', props.row, details)"
            @unreject-withdrawal="(details) => $emit('unreject-withdrawal', props.row, details)"
            @delete-operation="(details) => $emit('delete-operation', props.row, details)"
          />
        </div>
      </div>
    </template>

    <template slot="empty">
      <div class="admin__table-finances-empty">
        <span v-if="isLoading">
          {{ $t('page-admin-finances.loading') }}
        </span>

        <span v-else-if="allItemsCount > 0">
          {{ $t('page-admin-finances.nothing-found-for-your-request') }}
        </span>

        <span v-else>
          {{ $t('page-admin-finances.no-results-found') }}
        </span>
      </div>
    </template>
  </b-table>
</template>

<script>
import FinancesTableDetails from './_finances-table-details.vue';

export default {
  props: {
    items: {
      type: Array,
    },

    isLoading: {
      type: Boolean,
    },

    allItemsCount: {
      type: Number,
      required: true,
    },

    perPage: {
      type: Number,
      default: 15,
    },
  },

  components: {
    FinancesTableDetails,
  },

  data() {
    return {
      openedRow: null,
    };
  },

  methods: {
    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.uid;
    },

    toggle(row) {
      this.$refs.financesTable.toggleDetails(row);
    },

    sortByCashback(rowA, rowB, isDesc) {
      if (isDesc) {
        return rowA.cashbacks.summ - rowB.cashbacks.summ;
      }

      return rowB.cashbacks.summ - rowA.cashbacks.summ;
    },

    sortByWithdrawals(rowA, rowB, isDesc) {
      if (isDesc) {
        return rowA.withdrawals.summ - rowB.withdrawals.summ;
      }

      return rowB.withdrawals.summ - rowA.withdrawals.summ;
    },
  },
};
</script>
