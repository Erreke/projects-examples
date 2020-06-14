<template>
  <div class="business__purchase">
    <div v-if="isLoading">
      <p>{{ $t('page-business.loading') }}</p>
    </div>

    <buying
      v-else-if="purchasingItem"
      :has-discount="hasDiscount"
      :is-attempted-to-pay="isAttemptedToPay"
      :is-attempted-to-pay-instime="isAttemptedToPayInstime"
      :selected-package-id="selectedPackageId"
      :selected-package-name="selectedPackageName"
      :selected-package-instime-payment-url="selectedPackageInstimePaymentUrl"
      :selected-regular-price="selectedRegularPrice"
      :selected-discounted-price="selectedDiscountedPrice"
      :selected-package-purchased="selectedPackagePurchased"
      :selected-package-instime-purchased="selectedPackageInstimePurchased"
    />

    <pricing-table
      v-else
      :is-active="true"
    />
  </div>
</template>

<script>
export default {
  name: 'BusinessPagePurchaseTab',

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
    PricingTable: () => import('./_pricing-table.vue'),
    Buying: () => import('./_buying.vue'),
  },

  computed: {
    hasDiscount() {
      return (this.purchasingItem && this.purchasingItem.hasDiscount) || false;
    },

    isAttemptedToPay() {
      return (this.purchasingItem && this.purchasingItem.isAttemptedToPay) || false;
    },

    isAttemptedToPayInstime() {
      return (this.purchasingItem && this.purchasingItem.isAttemptedToPayInstime) || false;
    },

    selectedPackageId() {
      return this.purchasingItem && this.purchasingItem.id;
    },

    selectedPackagePurchased() {
      return this.purchasingItem && this.purchasingItem.isPurchased;
    },

    selectedPackageInstimePurchased() {
      return this.purchasingItem && this.purchasingItem.isInstimePurchased;
    },

    selectedPackageName() {
      return this.purchasingItem && this.purchasingItem.packageName;
    },

    selectedPackageInstimePaymentUrl() {
      return (this.purchasingItem && this.purchasingItem.instimePaymentUrl) || '';
    },

    selectedRegularPrice() {
      return this.purchasingItem && parseFloat(this.purchasingItem.regularPrice || 0, 10);
    },

    selectedDiscountedPrice() {
      return this.purchasingItem && parseFloat(this.purchasingItem.discountedPrice || 0, 10);
    },
  },
};
</script>
