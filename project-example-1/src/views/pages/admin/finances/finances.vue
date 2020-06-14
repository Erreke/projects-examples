<template>
  <admin-layout :title="$t('page-admin-finances.title', { count: filteredItemsCount, all: allItemsCount })">
    <b-loading :is-full-page="false" :active="isLoading"></b-loading>

    <finances-toolbar
      :statusItems="statusItems"
      :typeItems="typeItems"
      :cashbackItems="cashbackItems"
      :bonusItems="bonusItems"
      :perPageItems="perPageItems"
      :searchText="searchText"
      :selectedStatus="selectedStatus"
      :selectedType="selectedType"
      :selectedCashback="selectedCashback"
      :selectedBonus="selectedBonus"
      :selectedPerPage="selectedPerPage"
      @change-search-text="changeSearchText"
      @change-status="changeStatus"
      @change-type="changeType"
      @change-cashback="changeCashback"
      @change-bonus="changeBonus"
      @change-per-page="changePerPage"
      @reset="reset"
    />

    <finances-table
      v-if="!isLoading"
      :items="tableItems"
      :perPage="selectedPerPage"
      :allItemsCount="allItemsCount"
      @add-cashback-20="(client) => openConfirmation('addCashback20', client)"
      @add-cashback-30="(client) => openConfirmation('addCashback30', client)"
      @add-cashback-40="(client) => openConfirmation('addCashback40', client)"
      @approve-withdrawal="(client, details) => openConfirmation('approveWithdrawal', client, details)"
      @unapprove-withdrawal="(client, details) => openConfirmation('unapproveWithdrawal', client, details)"
      @reject-withdrawal="(client, details) => openConfirmation('rejectWithdrawal', client, details)"
      @unreject-withdrawal="(client, details) => openConfirmation('unrejectWithdrawal', client, details)"
      @delete-operation="(client, details) => openConfirmation('deleteOperation', client, details)"
    />

    <finances-confirmation-dialog
      :isOpened="isConfirmationOpened"
      :operation-type="confirmationOperationType"
      :texts="confirmationTexts"
      :details="confirmationDetails"
      :client="confirmationClient"
      :is-processing="isConfirmationProcessing"
      @close="closeConfirmation"
      @confirm="confirmOperation"
    />
  </admin-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import FinancesTable from './_finances-table.vue';
import FinancesToolbar from './_finances-toolbar.vue';
import FinancesConfirmationDialog from './_finances-confirmation-dialog.vue';

export default {
  name: 'AdminFinancesPage',

  usedVuexModules: ['admin'],

  components: {
    FinancesTable,
    FinancesToolbar,
    FinancesConfirmationDialog,
  },

  data() {
    return {
      isConfirmationOpened: false,
      confirmationOperationType: null,
      confirmationDetails: null,
      confirmationClient: null,
      isConfirmationProcessing: false,
      searchText: '',
      selectedStatus: 'all',
      selectedType: 'all',
      selectedCashback: 'got',
      selectedBonus: 'got',
      statusItems: {
        all: 'finances-all',
        pending: 'finances-pending',
        approved: 'finances-approved',
        rejected: 'finances-rejected',
      },
      typeItems: {
        all: 'all',
        withdrawal: 'withdrawal',
        transferOut: 'transfer-out',
        transferIn: 'transfer-in',
        cashback: 'cashback',
        bonus: 'bonus',
      },
      cashbackItems: {
        got: 'got',
        got20: 'got-20',
        got30: 'got-30',
        got40: 'got-40',
        notGot: 'not-got',
      },
      bonusItems: {
        got: 'got',
        businessBuying: 'referral-business-buying',
        webinarWatching: 'referral-webinar-watching',
      },
      selectedPerPage: 50,
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
    ...mapState('admin/finances', ['isLoading']),

    ...mapGetters('admin/finances', ['clientsFinances']),

    confirmationTexts() {
      const texts = {
        addCashback20: {
          title: 'Начисление 20 долларов',
          subtitle: 'Вы уверены, что хотите начислить 20 долларов?',
        },
        addCashback30: {
          title: 'Начисление 30 долларов',
          subtitle: 'Вы уверены, что хотите начислить 30 долларов?',
        },
        addCashback40: {
          title: 'Начисление 40 долларов',
          subtitle: 'Вы уверены, что хотите начислить 40 долларов?',
        },
        approveWithdrawal: {
          title: this.$t('page-admin-finances.confirm-title-approving'),
          subtitle: this.$t('page-admin-finances.confirm-text-approving'),
        },
        unapproveWithdrawal: {
          title: this.$t('page-admin-finances.confirm-title-unapproving'),
          subtitle: this.$t('page-admin-finances.confirm-text-unapproving'),
        },
        rejectWithdrawal: {
          title: this.$t('page-admin-finances.confirm-title-rejecting'),
          subtitle: this.$t('page-admin-finances.confirm-text-rejecting'),
        },
        unrejectWithdrawal: {
          title: this.$t('page-admin-finances.confirm-title-unrejecting'),
          subtitle: this.$t('page-admin-finances.confirm-text-unrejecting'),
        },
        deleteOperation: {
          title: this.$t('page-admin-finances.confirm-title-deleting'),
          subtitle: this.$t('page-admin-finances.confirm-text-deleting'),
        },
      };

      return texts[this.confirmationOperationType] || {};
    },

    tableItems() {
      let items = this.clientsFinances;
      const searchText = this.searchText.toLowerCase();

      if (this.selectedStatus === 'pending') {
        items = items.filter(item => item.finances.find(i => !i.isApproved && !i.isRejected));

        items = items.map(item => ({
          ...item,
          finances: item.finances.filter(i => !i.isApproved && !i.isRejected),
        }));
      }

      if (this.selectedStatus === 'approved') {
        items = items.filter(item => item.finances.find(i => i.isApproved && !i.isRejected));

        items = items.map(item => ({
          ...item,
          finances: item.finances.filter(i => i.isApproved && !i.isRejected),
        }));
      }

      if (this.selectedStatus === 'rejected') {
        items = items.filter(item => item.finances.find(i => !i.isApproved && i.isRejected));

        items = items.map(item => ({
          ...item,
          finances: item.finances.filter(i => !i.isApproved && i.isRejected),
        }));
      }

      if (this.selectedType === 'withdrawal') {
        items = items.filter(item => item.finances.find(i => i.isWithdrawal));

        items = items.map(item => ({
          ...item,
          finances: item.finances.filter(i => i.isWithdrawal),
        }));
      }

      if (this.selectedType === 'transferOut') {
        items = items.filter(item => item.finances.find(i => i.isTransferOut));

        items = items.map(item => ({
          ...item,
          finances: item.finances.filter(i => i.isTransferOut),
        }));
      }

      if (this.selectedType === 'transferIn') {
        items = items.filter(item => item.finances.find(i => i.isTransferIn));

        items = items.map(item => ({
          ...item,
          finances: item.finances.filter(i => i.isTransferIn),
        }));
      }

      if (this.selectedType === 'cashback') {
        if (this.selectedCashback === 'got') {
          items = items.filter(item => item.finances.find(i => i.isCashback));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isCashback),
          }));
        }

        if (this.selectedCashback === 'got20') {
          items = items.filter(item => item.finances.find(i => i.isCashback && i.amount === 20));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isCashback && i.amount === 20),
          }));
        }

        if (this.selectedCashback === 'got30') {
          items = items.filter(item => item.finances.find(i => i.isCashback && i.amount === 30));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isCashback && i.amount === 30),
          }));
        }

        if (this.selectedCashback === 'got40') {
          items = items.filter(item => item.finances.find(i => i.isCashback && i.amount === 40));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isCashback && i.amount === 40),
          }));
        }

        if (this.selectedCashback === 'notGot') {
          items = items.filter(item => item.finances.length === 0 || !item.finances.find(i => i.isCashback));
        }
      }

      if (this.selectedType === 'bonus') {
        if (this.selectedBonus === 'got') {
          items = items.filter(item => item.finances.find(i => i.isBonus));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isBonus),
          }));
        }

        if (this.selectedBonus === 'businessBuying') {
          items = items.filter(item => item.finances.find(i => i.isBonus && i.reason === 'referral-business-buying'));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isBonus && i.reason === 'referral-business-buying'),
          }));
        }

        if (this.selectedBonus === 'webinarWatching') {
          items = items.filter(item => item.finances.find(i => i.isBonus && i.reason === 'referral-webinar-watching'));

          items = items.map(item => ({
            ...item,
            finances: item.finances.filter(i => i.isBonus && i.reason === 'referral-webinar-watching'),
          }));
        }
      }

      if (searchText) {
        items = items.filter(item => (item.firstName && item.firstName.toLowerCase().includes(searchText))
          || (item.secondName && item.secondName.toLowerCase().includes(searchText))
          || (item.email && item.email.toLowerCase().includes(searchText))
          || (item.phone && item.phone.toLowerCase().includes(searchText))
          || (item.finances.find(i => i.id.toLowerCase().includes(searchText)))
          || (item.finances.find(i => i.cardNumber && i.cardNumber.toLowerCase().includes(searchText))));
      }

      return items;
    },

    allItemsCount() {
      return this.clientsFinances.length || 0;
    },

    filteredItemsCount() {
      return this.tableItems.length || 0;
    },
  },

  methods: {
    ...mapActions('admin/finances', {
      fetchFinancesAndClients: 'FETCH_FINANCES_AND_CLIENTS',
      approveClientWithdrawal: 'APPROVE_CLIENT_WITHDRAWAL',
      rejectClientWithdrawal: 'REJECT_CLIENT_WITHDRAWAL',
      unapproveClientWithdrawal: 'UNAPPROVE_CLIENT_WITHDRAWAL',
      unrejectClientWithdrawal: 'UNREJECT_CLIENT_WITHDRAWAL',
      deleteClientOperation: 'DELETE_CLIENT_OPERATION',
      addCashback: 'ADD_CASHBACK',
    }),

    openConfirmation(operation, client, details = null) {
      this.confirmationOperationType = operation;
      this.confirmationClient = client;
      this.confirmationDetails = details;
      this.isConfirmationOpened = true;
    },

    closeConfirmation() {
      this.confirmationClient = null;
      this.confirmationOperationType = null;
      this.confirmationDetails = null;
      this.isConfirmationProcessing = false;
      this.isConfirmationOpened = false;
    },

    confirmOperation(payload) {
      this.isConfirmationProcessing = true;

      this[this.confirmationOperationType](payload)
        .then(() => {
          this.closeConfirmation();
        });
    },

    addCashback20() {
      return this.addCashback({ uid: this.confirmationClient.uid, amount: 20 });
    },

    addCashback30() {
      return this.addCashback({ uid: this.confirmationClient.uid, amount: 30 });
    },

    addCashback40() {
      return this.addCashback({ uid: this.confirmationClient.uid, amount: 40 });
    },

    approveWithdrawal() {
      return this.approveClientWithdrawal({ id: this.confirmationDetails.id });
    },

    unapproveWithdrawal() {
      return this.unapproveClientWithdrawal({ id: this.confirmationDetails.id });
    },

    rejectWithdrawal({ reason }) {
      return this.rejectClientWithdrawal({ id: this.confirmationDetails.id, reason });
    },

    unrejectWithdrawal() {
      return this.unrejectClientWithdrawal({ id: this.confirmationDetails.id });
    },

    deleteOperation() {
      return this.deleteClientOperation({ id: this.confirmationDetails.id });
    },

    changeSearchText(value) {
      this.searchText = value;
    },

    changeStatus(value) {
      this.selectedStatus = value;
    },

    changeType(value) {
      this.selectedType = value;
    },

    changeCashback(value) {
      this.selectedCashback = value;
    },

    changeBonus(value) {
      this.selectedBonus = value;
    },

    changePerPage(value) {
      this.selectedPerPage = this.perPageItems[value];
    },

    reset() {
      this.searchText = '';
      this.selectedStatus = 'all';
      this.selectedType = 'all';
      this.selectedCashback = 'got';
      this.selectedBonus = 'got';
    },
  },

  mounted() {
    this.fetchFinancesAndClients();
  },
};
</script>
