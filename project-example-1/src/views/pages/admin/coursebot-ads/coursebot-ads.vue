<template>
  <admin-layout
    :title="$t('page-admin-coursebot-ads.title', {
      count: filteredItemsCount,
      all: allItemsCount
    })"
  >
    <b-loading :is-full-page="false" :active="isLoading"></b-loading>

    <b-notification
      v-if="!isLoading && loadingError"
      type="is-danger"
      role="alert"
      :closable="false"
    >
      {{ $t('page-admin-coursebot-ads.error-on-loading') }}
    </b-notification>

    <coursebot-ads-toolbar
      v-if="!isLoading && !loadingError"
      :status-items="statusItems"
      :tariff-items="tariffItems"
      :columns-items="columnsItems"
      :per-page-items="perPageItems"
      :search-text="searchText"
      :selected-columns="selectedColumns"
      :initial-columns="initialColumns"
      :selected-status="selectedStatus"
      :selected-tariff="selectedTariff"
      :selected-per-page="selectedPerPage"
      @change-columns="changeColumns"
      @change-search-text="changeSearchText"
      @change-status="changeStatus"
      @change-tariff="changeTariff"
      @change-per-page="changePerPage"
      @reset="reset"
    />

    <coursebot-ads-table
      v-if="!isLoading && !loadingError"
      :items="tableItems"
      :selected-columns="selectedColumns"
      :per-page="selectedPerPage"
      :all-items-count="allItemsCount"
    />
  </admin-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import StatusMixin from '@/utils/mixins/tariff-status';
import CoursebotAdsTable from './_table.vue';
import CoursebotAdsToolbar from './_toolbar.vue';

const INITIAL_COLUMNS = 'firstName,secondName,email,phone,tariff,priceUSD,status';

export default {
  name: 'AdminCoursebotAdsPage',

  mixins: [StatusMixin],

  usedVuexModules: ['admin'],

  components: {
    CoursebotAdsTable,
    CoursebotAdsToolbar,
  },

  data() {
    return {
      todayRate: 0,
      initialColumns: INITIAL_COLUMNS,
      selectedColumns: INITIAL_COLUMNS,
      searchText: '',
      selectedStatus: 'all',
      selectedTariff: 'all',
      selectedPerPage: 50,
      statusItems: {
        all: 'all',
        notPaid: 'not-paid',
        waiting: 'waiting',
        confirmed: 'confirmed',
        runned: 'runned',
        stopped: 'stopped',
        expired: 'expired',
      },
      tariffItems: {
        all: 'Все',
        standard: 'Standard',
        standardPlus: 'Standard Plus',
        business: 'Business',
        businessPlus: 'Business Plus',
        premium: 'Premium',
        premiumPlus: 'Premium Plus',
      },
      columnsItems: {
        id: 'th-id',
        firstName: 'th-first-name',
        secondName: 'th-second-name',
        email: 'th-email',
        phone: 'th-phone',
        tariff: 'th-tariff',
        priceUSD: 'th-price-usd',
        amountTNG: 'th-amount-tng',
        status: 'th-status',
        courseBotReferralLink: 'th-course-bot-referral-link',
        createdAt: 'th-created-at',
        attemptedAt: 'th-attempted-at',
        paymentConfirmedAt: 'th-payment-confirmed-at',
        adRunnedAt: 'th-ad-runned-at',
        adStoppedAt: 'th-ad-stopped-at',
        adExpiredAt: 'th-ad-expired-at',
      },
      perPageItems: {
        5: 5,
        15: 15,
        50: 50,
        100: 100,
        Все: -1,
      },
    };
  },

  computed: {
    ...mapState('admin/tariff', [
      'isLoading',
      'loadingError',
    ]),

    ...mapGetters('admin/tariff', ['ordersWithClients']),

    tableItems() {
      let items = this.ordersWithClients;
      const searchText = this.searchText.toLowerCase();

      if (this.selectedStatus === 'notPaid') {
        items = items.filter(item => this.getStatus(item).alias === 'not-paid');
      }

      if (this.selectedStatus === 'waiting') {
        items = items.filter(item => this.getStatus(item).alias === 'waiting');
      }

      if (this.selectedStatus === 'confirmed') {
        items = items.filter(item => this.getStatus(item).alias === 'confirmed');
      }

      if (this.selectedStatus === 'runned') {
        items = items.filter(item => this.getStatus(item).alias === 'runned');
      }

      if (this.selectedStatus === 'stopped') {
        items = items.filter(item => this.getStatus(item).alias === 'stopped');
      }

      if (this.selectedStatus === 'expired') {
        items = items.filter(item => this.getStatus(item).alias === 'expired');
      }

      if (this.selectedTariff === 'standard') {
        items = items.filter(item => item.tariff === 'Standard');
      }

      if (this.selectedTariff === 'standardPlus') {
        items = items.filter(item => item.tariff === 'Standard Plus');
      }

      if (this.selectedTariff === 'business') {
        items = items.filter(item => item.tariff === 'Business');
      }

      if (this.selectedTariff === 'businessPlus') {
        items = items.filter(item => item.tariff === 'Business Plus');
      }

      if (this.selectedTariff === 'premium') {
        items = items.filter(item => item.tariff === 'Premium');
      }

      if (this.selectedTariff === 'premiumPlus') {
        items = items.filter(item => item.tariff === 'Premium Plus');
      }

      if (searchText) {
        items = items.filter(item => (
          (this.selectedColumns.includes('firstName') && item.client.firstName && item.client.firstName.toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('secondName') && item.client.secondName && item.client.secondName.toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('email') && item.client.email && item.client.email.toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('phone') && item.client.phone && item.client.phone.toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('tariff') && item.tariff && item.tariff.toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('id') && item.id && item.id.toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('priceUSD') && item.priceUSD && item.priceUSD.toString().toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('amountTNG') && item.amountTNG && item.amountTNG.toString().toLowerCase().includes(searchText))
          || (this.selectedColumns.includes('courseBotReferralLink') && item.client.courseBotReferralLink && item.client.courseBotReferralLink.toLowerCase().includes(searchText))
        ));
      }

      return items;
    },

    allItemsCount() {
      return this.ordersWithClients.length || 0;
    },

    filteredItemsCount() {
      return this.tableItems.length || 0;
    },
  },

  methods: {
    ...mapActions('admin/tariff', {
      fetchAllTariff: 'FETCH_ALL_TARIFF',
      fetchUsdRate: 'FETCH_USD_RATE',
    }),

    changeColumns(value) {
      this.selectedColumns = value.join();
    },

    changeSearchText(value) {
      this.searchText = value;
    },

    changeStatus(value) {
      this.selectedStatus = value;
    },

    changeTariff(value) {
      this.selectedTariff = value;
    },

    changePerPage(value) {
      this.selectedPerPage = this.perPageItems[value];
    },

    reset() {
      this.searchText = '';
      this.selectedStatus = 'all';
      this.selectedTariff = 'all';
      this.selectedColumns = INITIAL_COLUMNS;
    },

    async tryLoadUSDRate() {
      try {
        const t = new Date();
        const date = `${t.getDate()}.${t.getMonth() + 1}.${t.getFullYear()}`;
        const key = `nbrk-usd-rate-${date}`;

        this.todayRate = localStorage.getItem(key);

        if (!this.todayRate) {
          const ww = await this.fetchUsdRate(date);

          this.todayRate = ww;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  created() {
    this.fetchAllTariff();
    // this.tryLoadUSDRate();
  },
};
</script>

<style lang="scss">

</style>
