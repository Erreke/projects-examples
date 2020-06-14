<template>
  <admin-layout :title="$t('page-admin-queue.meta-title', { count: clientsQueue.length })">
    <b-table
      class="admin__table"
      :data="clientsQueue"
      :per-page="perPage"
      detailed
      paginated
      ref="table"
      detail-key="uid"
      :mobile-cards="false"
      :hoverable="true"
      :show-detail-icon="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="firstName"
          :visible="columns.includes('firstName')"
          :label="$t('page-admin-queue.th-first-name')"
        >
          {{ props.row.firstName ? props.row.firstName : '-' }}
        </b-table-column>

        <b-table-column
          field="secondName"
          :visible="columns.includes('secondName')"
          :label="$t('page-admin-queue.th-second-name')"
        >
          {{ props.row.secondName ? props.row.secondName : '-' }}
        </b-table-column>

        <b-table-column
          field="email"
          :visible="columns.includes('email')"
          :label="$t('page-admin-queue.th-email')"
        >
          {{ props.row.email ? props.row.email : '-' }}
        </b-table-column>

        <b-table-column
          field="phone"
          :visible="columns.includes('phone')"
          :label="$t('page-admin-queue.th-phone')"
        >
          {{ props.row.phone ? props.row.phone : '-' }}
        </b-table-column>

        <b-table-column
          field="projectReferralLink"
          :label="$t('page-admin-queue.th-referral-link')"
        >
          {{ props.row.projectReferralLink ? props.row.projectReferralLink : '-' }}
        </b-table-column>

        <b-table-column
          field="autoReferrals.length"
          :label="$t('page-admin-queue.th-auto-referrals')"
          numeric
        >
          {{ props.row.autoReferrals.length }}
        </b-table-column>

        <b-table-column
          field="createdAt"
          :label="$t('page-admin-queue.th-registered-at')"
        >
          <span v-if="props.row.createdAt">
            {{ props.row.createdAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </b-table-column>

        <b-table-column
          field="transactionConfirmedAt"
          :label="$t('page-admin-queue.th-transaction-confirmed-at')"
        >
          <span v-if="props.row.transactionConfirmedAt">
            {{ props.row.transactionConfirmedAt.seconds | date_time_format }}
          </span>
          <span v-else>-</span>
        </b-table-column>
      </template>

      <template slot="empty">
        <div class="admin__table-empty">
          <span v-if="isLoading">{{ $t('page-admin-queue.loading') }}</span>
          <span v-else>{{ $t('page-admin-queue.nobody-found') }}</span>
        </div>
      </template>
    </b-table>
  </admin-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AdminQueuePage',

  usedVuexModules: ['admin'],

  metaInfo() {
    return {
      title: this.$user && this.$user.isAdmin
        ? this.$t('page-admin-queue.meta-title', { count: this.clientsQueue.length })
        : this.$t('block-errors.err-oops-403-title'),
    };
  },

  data() {
    return {
      isLoading: false,
      perPage: 50,
      columns: [
        'firstName',
        'secondName',
        'email',
        'phone',
      ],
    };
  },

  computed: {
    ...mapState('admin/clients', ['clientsQueue']),
  },

  methods: {
    ...mapActions('admin/clients', {
      fetchClientsQueue: 'FETCH_CLIENTS_QUEUE',
    }),
  },

  created() {
    this.isLoading = true;

    this
      .fetchClientsQueue()
      .then(() => {
        this.isLoading = false;
      });
  },
};
</script>
