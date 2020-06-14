<template>
  <user-layout
    :title="$t('page-business.meta-title')"
    :subtitle="tempSubtitle"
  >
    <p>{{ tempText }}</p>

    <!-- <b-tabs v-model="activeTab">
      <b-tab-item :label="$t('page-business.current')">
        <current-business-tab
          :is-loading="isLoading"
          :business-places="businessPlaces"
          @buy="activeTab = 1"
        />
      </b-tab-item>

      <b-tab-item :label="purchasingBusinessTabLabel">
        <purchase-business-tab
          :is-loading="isLoading"
          :purchasing-item="purchasingItem"
        />
      </b-tab-item>
    </b-tabs>
    -->
  </user-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BusinessPage',

  usedVuexModules: ['business-place'],

  components: {
    // CurrentBusinessTab: () => import('./_current-tab.vue'),
    // PurchaseBusinessTab: () => import('./_purchase-tab.vue'),
  },

  data() {
    return {
      activeTab: 0,
    };
  },

  computed: {
    ...mapState('business-place', {
      businessPlaces: state => state.items,
      isLoading: state => state.isLoading,
    }),

    purchasingItem() {
      return this.businessPlaces
        .filter(item => !item.isPurchased || !item.isInstimePurchased)[0];
    },

    purchasingBusinessTabLabel() {
      if (this.businessPlaces.length > 0) {
        if (this.purchasingItem) {
          return this.$t('page-business.purchase-continue');
        }

        return this.$t('page-business.purchase-more');
      }

      return this.$t('page-business.purchase');
    },

    deadLine() {
      return new Date(1588183200000);
    },

    regDate() {
      return new Date(this.$_user.createdAt.seconds * 1000);
    },

    tempSubtitle() {
      return this.deadLine > this.regDate ? 'Ваш бизнес в процессе переноса из старого сайта' : 'Скоро откроем';
    },

    tempText() {
      return this.deadLine > this.regDate ? 'По окончании процесса сообщим дополнительно.' : 'Раздел в процессе разработки';
    },
  },

  methods: {
    ...mapActions('business-place', {
      fetchUserBusinessPlaces: 'FETCH_USER_BUSINESS_PLACES',
    }),
  },

  mounted() {
    this.fetchUserBusinessPlaces(this.$_user.uid);

    if (this.$route.hash === '#purchase') {
      this.activeTab = 1;
    }
  },
};
</script>
