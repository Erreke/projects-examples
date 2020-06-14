<template>
  <div class="admin-coursebot-ads__table-details">
    <pseudo-table
      label="Статус:"
      :is-slotable="true"
    >
      <span :class="['tag', `is-${getStatus(item).class}`]">
        {{ getStatus(item).text }}
      </span>
    </pseudo-table>

    <pseudo-table
      label="Тариф:"
      :value="item.tariff"
    />

    <pseudo-table
      label="Цена в USD:"
      :value="item.priceUSD ? $options.filters.currency_format(item.priceUSD) : '-'"
    />

    <pseudo-table
      label="Оплачено в KZT:"
      :value="item.amountTNG ? $options.filters.currency_format(item.amountTNG, 'KZT') : '-'"
    />

    <hr>

    <pseudo-table
      label="Дата создания:"
      :value="item.createdAt"
      field-type="datetime"
    />

    <pseudo-table
      label="Дата оплаты:"
      :value="item.attemptedAt"
      field-type="datetime"
    />

    <pseudo-table
      label="Дата подтверждения оплаты:"
      :value="item.paymentConfirmedAt"
      field-type="datetime"
    />

    <pseudo-table
      v-if="item.adRunnedAt"
      label="Дата запуска рекламы:"
      :value="item.adRunnedAt"
      field-type="datetime"
    />

    <pseudo-table
      v-if="item.adStoppedAt"
      label="Дата приостановки рекламы:"
      :value="item.adStoppedAt"
      field-type="datetime"
    />

    <pseudo-table
      label="Дата отработки:"
      :value="item.adExpiredAt"
      field-type="datetime"
    />

    <hr>

    <pseudo-table
      label="Имя:"
      :value="item.client.firstName"
    />

    <pseudo-table
      label="Фамилия:"
      :value="item.client.secondName"
    />

    <pseudo-table
      label="Email:"
      :value="item.client.email"
    />

    <pseudo-table
      label="Телефон:"
      :value="item.client.phone"
    />

    <pseudo-table
      label="Рефссылка:"
      :value="item.client.courseBotReferralLink"
    />

    <hr>

    <pseudo-table
      label="ID:"
      :value="item.id"
    />

    <hr>

    <actions :item="item" />
  </div>
</template>

<script>
import StatusMixin from '@/utils/mixins/tariff-status';
import Actions from './_actions.vue';

export default {
  name: 'AdminCoursebotAdsTableDetails',

  mixins: [StatusMixin],

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  components: {
    Actions,
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },
};
</script>

<style lang="scss">
.admin-coursebot-ads__table-details {
  padding: 1rem;
  margin: 0 auto;
  max-width: 750px;
  background-color: #fafafa;
}
</style>
