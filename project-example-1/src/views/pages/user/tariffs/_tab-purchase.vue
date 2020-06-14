<template>
  <div class="tariffs__purchase">
    <div v-if="isLoading">
      <p>{{ $t('page-tariffs.loading') }}</p>
    </div>

    <tab-purchase-buying
      v-else-if="purchasingItem"
      :selected-tariff-id="selectedTariffId"
      :selected-tariff-name="selectedTariffName"
      :selected-tariff-price="selectedTariffPrice"
      :is-selected-tariff-payment-confirmed="isSelectedTariffPaymentConfirmed"
      :is-selected-tariff-attempted-to-pay="isSelectedTariffAttemptedToPay"
    />

    <tab-purchase-tariffs v-else />
  </div>
</template>

<script>
export default {
  name: 'TariffsPagePurchaseTab',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    purchasingItem: {
      type: Object,
    },
  },

  components: {
    TabPurchaseTariffs: () => import('./_tab-purchase-tariffs.vue'),
    TabPurchaseBuying: () => import('./_tab-purchase-buying.vue'),
  },

  computed: {
    selectedTariffId() {
      return this.purchasingItem && this.purchasingItem.id;
    },

    selectedTariffName() {
      return this.purchasingItem && this.purchasingItem.tariff;
    },

    selectedTariffPrice() {
      return this.purchasingItem && parseFloat(this.purchasingItem.priceUSD || 0, 10);
    },

    isSelectedTariffPaymentConfirmed() {
      return (this.purchasingItem && this.purchasingItem.isPaymentConfirmed) || false;
    },

    isSelectedTariffAttemptedToPay() {
      return (this.purchasingItem && this.purchasingItem.isAttemptedToPay) || false;
    },
  },
};
</script>
