<template>
  <admin-layout
    :title="$t(`page-admin-clients.title-${statusItems[selectedStatus]}`, {
      count: filteredClientsCount,
      all: selectedStatusClientsCount
    })"
  >
    <div class="admin">
      <client-creating-dialog
        :is-opened="isOpenClientCreatingDialog"
        :title="clientCreatingDialogTitle"
        @close="closeClientCreatingDialog"
      />

      <admin-toolbar
        :search-place-items="searchPlaceItems"
        :status-items="statusItems"
        :filter-items="filterItems"
        :per-page-items="perPageItems"
        :columns-items="columnsItems"
        :selected-search-places="selectedSearchPlaces"
        :selected-status="selectedStatus"
        :selected-filters="selectedFilters"
        :selected-columns="selectedColumns"
        :selected-per-page="selectedPerPage"
        @change-search-places="changeSearchPlaces"
        @change-status="changeStatus"
        @change-filters="changeFilters"
        @change-columns="changeColumns"
        @change-per-page="changePerPage"
        @open-client-creating-dialog="openClientCreatingDialog"
        @search="searchUsers"
      />

      <admin-table
        :is-loading="isLoading"
        :clients="clients"
        :discounts="discounts"
        :columns="selectedColumns"
        :per-page="selectedPerPage"
        :all-clients-count="selectedStatusClientsCount"
      />
    </div>
  </admin-layout>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'AdminClientsPage',

  components: {
    AdminToolbar: () => import('./_toolbar.vue'),
    AdminTable: () => import('./_table.vue'),
    ClientCreatingDialog: () => import('./_client-creating-dialog.vue'),
  },

  data() {
    return {
      isLoading: false,
      searchPlaceItems: {
        uid: 'uid',
        firstName: 'first-name',
        secondName: 'second-name',
        email: 'email',
        phone: 'phone',
        nickname: 'nickname',
        country: 'country',
        city: 'city',
        bonusHolderId: 'bonus-holder-id',
        bonusHolderNick: 'bonus-holder-nick',
      },
      selectedSearchPlaces: [
        'firstName',
        'secondName',
        'email',
        'phone',
        'nickname',
      ],
      selectedStatus: 'clientsAll',
      selectedFilters: [],
      selectedColumns: [
        'firstName',
        'secondName',
        'email',
        'phone',
      ],
      selectedPerPage: 50,
      statusItems: {
        clientsAll: 'clients-all',
        clientsWithArchivedAccount: 'clients-with-archived-account',
      },
      filterItems: {
        withAutoReferrals: 'with-auto-referrals',
        withReferrals: 'with-referrals',
        withPaymentByCard: 'with-payment-by-card',
        withPaymentByCrypto: 'with-payment-by-crypto',
        withPaymentByTransfer: 'with-payment-by-transfer',
        withPaymentByCash: 'with-payment-by-cash',
        withPaymentByInner: 'with-payment-by-inner',
        withPaymentByGift: 'with-payment-by-gift',
      },
      columnsItems: {
        uid: 'th-uid',
        firstName: 'th-first-name',
        secondName: 'th-second-name',
        email: 'th-email',
        phone: 'th-phone',
        nickname: 'th-nickname',
        gender: 'th-gender',
        country: 'th-country',
        city: 'th-city',

        bonusHolderId: 'th-bonus-holder-id',
        bonusHolderNick: 'th-bonus-holder-nick',

        createdAt: 'th-registered-at',
      },
      perPageItems: {
        5: 5,
        15: 15,
        50: 50,
        100: 100,
        Все: -1,
      },
      searchText: '',
      isOpenClientCreatingDialog: false,
      clientCreatingDialogTitle: '',
    };
  },

  usedVuexModules: ['admin'],

  computed: {
    ...mapState('admin/clients', ['discounts']),

    ...mapGetters('admin/clients', [
      'clientsAll',
      'clientsWithArchivedAccount',
    ]),

    clients() {
      let clients = this[this.selectedStatus];
      const searchText = this.searchText.toLowerCase();

      if (this.selectedFilters.includes('withAutoReferrals')) {
        clients = clients.filter(item => item.autoReferrals.length > 0);
      }

      if (this.selectedFilters.includes('withReferrals')) {
        clients = clients.filter(item => item.referrals.length > 0);
      }

      if (searchText) {
        clients = clients.filter(item => (
          (this.selectedSearchPlaces.includes('uid') && item.uid && item.uid.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('firstName') && item.firstName && item.firstName.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('secondName') && item.secondName && item.secondName.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('email') && item.email && item.email.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('phone') && item.phone && item.phone.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('nickname') && item.nickname && item.nickname.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('country') && item.country && item.country.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('city') && item.city && item.city.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('bonusHolderId') && item.bonusHolderId && item.bonusHolderId.toLowerCase().includes(searchText))
            || (this.selectedSearchPlaces.includes('bonusHolderNick') && item.bonusHolderNick && item.bonusHolderNick.toLowerCase().includes(searchText))
        ));
      }

      return clients;
    },

    selectedStatusClientsCount() {
      return this[this.selectedStatus].length || 0;
    },

    filteredClientsCount() {
      return this.clients.length || 0;
    },
  },

  methods: {
    ...mapActions('admin/clients', {
      fetchClientsProfiles: 'FETCH_CLIENTS_PROFILES',
      fetchClientsDiscounts: 'FETCH_CLIENTS_DISCOUNTS',
    }),

    openClientCreatingDialog() {
      this.clientCreatingDialogTitle = 'Создание пользователя';
      this.isOpenClientCreatingDialog = true;
    },

    closeClientCreatingDialog() {
      this.clientCreatingDialogTitle = '';
      this.isOpenClientCreatingDialog = false;
    },

    changeSearchPlaces(value) {
      this.selectedSearchPlaces = value;
    },

    changeStatus(value) {
      this.selectedStatus = value;
    },

    changeFilters(value) {
      this.selectedFilters = value;
    },

    changeColumns(value) {
      this.selectedColumns = value;
    },

    searchUsers(value) {
      this.searchText = value;
    },

    changePerPage(value) {
      this.selectedPerPage = this.perPageItems[value];
    },
  },

  created() {
    this.isLoading = true;

    Promise.all([
      this.fetchClientsProfiles(),
      this.fetchClientsDiscounts(),
    ])
      .then(() => {
        this.isLoading = false;
      });
  },
};
</script>
