<template>
  <user-layout
    :title="$t('page-tariffs.meta-title')"
  >
    <b-tabs class="tariffs__tabs" v-model="activeTab">
      <b-tab-item :label="$t('page-tariffs.current')">
        <currents-tab
          :tariffs="tariffs"
          :is-loading="isLoading"
          :loadingError="loadingError"
          @buy="activeTab = 1"
        />
      </b-tab-item>

      <b-tab-item :label="purchasingTabLabel">
        <purchase-tab
          :is-loading="isLoading"
          :purchasing-item="purchasingItem"
        />
      </b-tab-item>
    </b-tabs>
  </user-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TariffsPage',

  usedVuexModules: ['tariff'],

  components: {
    CurrentsTab: () => import('./_tab-currents.vue'),
    PurchaseTab: () => import('./_tab-purchase.vue'),
  },

  data() {
    return {
      activeTab: 0,
    };
  },

  computed: {
    ...mapState('tariff', {
      tariffs: state => state.items,
      isLoading: state => state.isLoading,
      loadingError: state => state.loadingError,
    }),

    purchasingItem() {
      return this.tariffs
        .filter(item => !item.isPaymentConfirmed)[0];
    },

    purchasingTabLabel() {
      if (this.tariffs.length > 0) {
        if (this.purchasingItem) {
          return this.$t('page-tariffs.purchase-continue');
        }

        return this.$t('page-tariffs.purchase-more');
      }

      return this.$t('page-tariffs.purchase');
    },
  },

  methods: {
    ...mapActions('tariff', {
      fetchUserTariffs: 'FETCH_USER_TARIFFS',
    }),
  },

  mounted() {
    this.fetchUserTariffs(this.$_user.uid);

    if (this.$route.hash === '#purchase') {
      this.activeTab = 1;
    }
  },
};
</script>

<style lang="scss">
.tariffs__tabs.b-tabs {
  .tab-content {
    padding: 2rem 0;
  }
}
</style>
