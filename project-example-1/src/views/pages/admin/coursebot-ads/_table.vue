<template>
  <b-table
    class="admin__table admin__table-finances"
    detail-key="id"
    ref="adOrdersTable"
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
        :visible="columns.includes('id')"
        field="id"
        label="ID"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.id ? props.row.id : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('firstName')"
        field="client.firstName"
        label="Имя"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.client && props.row.client.firstName ? props.row.client.firstName : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('secondName')"
        field="client.secondName"
        label="Фамилия"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.client && props.row.client.secondName ? props.row.client.secondName : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('email')"
        field="client.email"
        label="Емейл"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.client && props.row.client.email ? props.row.client.email : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('phone')"
        field="client.phone"
        label="Телефон"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.client && props.row.client.phone ? props.row.client.phone : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('tariff')"
        field="tariff"
        label="Тариф"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.tariff ? props.row.tariff : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('priceUSD')"
        field="priceUSD"
        label="Цена в USD"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.priceUSD ? $options.filters.currency_format(props.row.priceUSD) : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('amountTNG')"
        field="amountTNG"
        label="Оплачено в KZT"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{
            props.row.amountTNG
              ? $options.filters.currency_format(props.row.amountTNG, 'KZT')
              : '-'
          }}
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('status')"
        field="status"
        label="Статус"
        :custom-sort="sortByStatus"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span :class="['tag', `is-${getStatus(props.row).class}`]">
            {{ getStatus(props.row).text }}
          </span>
        </div>
      </b-table-column>

      <b-table-column
        :visible="columns.includes('courseBotReferralLink')"
        field="client.courseBotReferralLink"
        label="Рефссылка"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          {{ props.row.client && props.row.client.courseBotReferralLink ? props.row.client.courseBotReferralLink : '-' }}
        </div>
      </b-table-column>

      <b-table-column
        field="createdAt"
        :visible="columns.includes('createdAt')"
        label="Дата создания"
        :custom-sort="sortByCreatedAt"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span v-if="props.row.createdAt">
            {{ props.row.createdAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>

      <b-table-column
        field="attemptedAt"
        :visible="columns.includes('attemptedAt')"
        label="Дата оплаты"
        :custom-sort="sortByAttemptedAt"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span v-if="props.row.attemptedAt">
            {{ props.row.attemptedAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>

      <b-table-column
        field="paymentConfirmedAt"
        :visible="columns.includes('paymentConfirmedAt')"
        label="Дата подтверждения оплаты"
        :custom-sort="sortByPaymentConfirmedAt"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span v-if="props.row.paymentConfirmedAt">
            {{ props.row.paymentConfirmedAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>

      <b-table-column
        field="adRunnedAt"
        :visible="columns.includes('adRunnedAt')"
        label="Дата запуска рекламы"
        :custom-sort="sortByAdRunnedAt"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span v-if="props.row.adRunnedAt">
            {{ props.row.adRunnedAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>

      <b-table-column
        field="adStoppedAt"
        :visible="columns.includes('adStoppedAt')"
        label="Дата приостановки рекламы"
        :custom-sort="sortByAdStoppedAt"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span v-if="props.row.adStoppedAt">
            {{ props.row.adStoppedAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>

      <b-table-column
        field="adExpiredAt"
        :visible="columns.includes('adExpiredAt')"
        label="Дата отработки рекламы"
        :custom-sort="sortByAdExpiredAt"
        sortable
      >
        <div class="admin__table-td" @click="toggle(props.row)">
          <span v-if="props.row.adExpiredAt">
            {{ props.row.adExpiredAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </div>
      </b-table-column>
    </template>

    <template slot="detail" slot-scope="props">
      <table-details :item="props.row" />
    </template>

    <template slot="empty">
      <div class="admin__table-finances-empty">
        <span v-if="isLoading">
          {{ $t('page-admin-coursebot-ads.loading') }}
        </span>

        <span v-else-if="allItemsCount > 0">
          {{ $t('page-admin-coursebot-ads.nothing-found-for-your-request') }}
        </span>

        <span v-else>
          {{ $t('page-admin-coursebot-ads.no-results-found') }}
        </span>
      </div>
    </template>
  </b-table>
</template>

<script>
import StatusMixin from '@/utils/mixins/tariff-status';
import TableDetails from './_details.vue';

export default {
  name: 'AdminCoursebotAdsTable',

  mixins: [StatusMixin],

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

    selectedColumns: {
      type: String,
      required: true,
    },
  },

  components: {
    TableDetails,
  },

  data() {
    return {
      openedRow: null,
    };
  },

  computed: {
    columns() {
      return this.selectedColumns.split(',');
    },
  },

  methods: {
    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.id;
    },

    toggle(row) {
      this.$refs.adOrdersTable.toggleDetails(row);
    },

    sortByStatus(rowA, rowB, isDirectionDesc) {
      let A;
      let B;
      const statusA = this.getStatus(rowA).alias;
      const statusB = this.getStatus(rowB).alias;

      if (statusA === 'not-paid') A = 0; // Не оплачен
      if (statusA === 'waiting') A = 1; // Ожидание подтверждения оплаты
      if (statusA === 'confirmed') A = 2; // Оплата поступила
      if (statusA === 'runned') A = 3; // Реклама запущена
      if (statusA === 'stopped') A = 4; // Реклама приостановлена
      if (statusA === 'expired') A = 5; // Заказ отработан
      if (statusA === 'unknown') A = 6; // Неизвестно

      if (statusB === 'not-paid') B = 0; // Не оплачен
      if (statusB === 'waiting') B = 1; // Ожидание подтверждения оплаты
      if (statusB === 'confirmed') B = 2; // Оплата поступила
      if (statusB === 'runned') B = 3; // Реклама запущена
      if (statusB === 'stopped') B = 4; // Реклама приостановлена
      if (statusB === 'expired') B = 5; // Заказ отработан
      if (statusB === 'unknown') B = 6; // Неизвестно

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

    sortByAttemptedAt(rowA, rowB, isDirectionDesc) {
      return this.sortByDate(
        rowA.attemptedAt,
        rowB.attemptedAt,
        isDirectionDesc,
      );
    },

    sortByPaymentConfirmedAt(rowA, rowB, isDirectionDesc) {
      return this.sortByDate(
        rowA.paymentConfirmedAt,
        rowB.paymentConfirmedAt,
        isDirectionDesc,
      );
    },

    sortByAdRunnedAt(rowA, rowB, isDirectionDesc) {
      return this.sortByDate(
        rowA.adRunnedAt,
        rowB.adRunnedAt,
        isDirectionDesc,
      );
    },

    sortByAdStoppedAt(rowA, rowB, isDirectionDesc) {
      return this.sortByDate(
        rowA.adStoppedAt,
        rowB.adStoppedAt,
        isDirectionDesc,
      );
    },

    sortByAdExpiredAt(rowA, rowB, isDirectionDesc) {
      return this.sortByDate(
        rowA.adExpiredAt,
        rowB.adExpiredAt,
        isDirectionDesc,
      );
    },
  },
};
</script>
