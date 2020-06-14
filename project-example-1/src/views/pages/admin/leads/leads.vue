<template>
  <admin-layout
    class="leads-page"
    :title="$t('page-admin-leads.title', { count: items.length })"
    :subtitle="$t('page-admin-leads.title', { count: items.length })"
  >
    <toolbar
      v-if="items.length > 0"
      :initial-per-page="perPage"
      :all-columns="columns"
      :selected-columns="selectedColumns"
      @search="search"
      @change-columns="changeColumns"
      @change-per-page="changePerPage"
    />

    <b-table
      :data="leads"
      class="leads-page__table"
      ref="table"
      :paginated="isPaginated"
      :per-page="perPage"
    >
      <template slot-scope="props">
        <b-table-column
          v-for="(item, key) in columns"
          :key="key"
          :field="item.value"
          :label="item.label"
          :visible="selectedColumns.includes(item.value)"
          sortable
        >
          <div class="leads-page__table-td">
            {{ renderValue(props.row[item.value]) }}
          </div>
        </b-table-column>
      </template>

      <template slot="empty">
        <div class="content">
          <div class="leads-page__table-empty">
            <p v-if="isLoading">{{ $t('page-admin-leads.loading') }}</p>

            <p v-if="!isLoading && error" class="leads-page__table-error">
              {{ $t('block-global.errors-has-ocurred-goto-developers') }}
              </p>

            <p v-if="!isLoading && !error && items.length > 0">
              {{ $t('page-admin-leads.nothing-found') }}
            </p>

            <p v-if="!isLoading && !error && items.length === 0">
              {{ $t('page-admin-leads.you-dont-have-leads') }}
            </p>
          </div>
        </div>
      </template>

      <template slot="footer" v-if="items.length">
        <div class="content">
          <p>{{ $t('page-admin-leads.showed-leads', {
            count: leads.length,
            total: items.length
          }) }}</p>
        </div>
      </template>
    </b-table>
  </admin-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AdminRedirectsPage',

  usedVuexModules: ['admin'],

  components: {
    Toolbar: () => import('./_toolbar'),
  },

  data() {
    return {
      perPage: 25,
      searchText: '',
      selectedColumns: [
        'firstName',
        'phone',
        'email',
        'createdAt',
      ],
    };
  },

  computed: {
    ...mapState('admin/leads', ['items', 'error', 'isLoading']),

    leads() {
      let leads = this.items;
      const searchText = this.searchText.toLowerCase();

      if (searchText) {
        leads = leads.filter(item => (
          (item.id.toLowerCase().includes(searchText))
            || (item.firstName.toLowerCase().includes(searchText))
            || (item.phone.toLowerCase().includes(searchText))
            || (item.email.toLowerCase().includes(searchText))
        ));
      }

      return leads;
    },

    isPaginated() {
      return this.items.length > 0 && this.perPage > 0;
    },

    columns() {
      return [
        {
          value: 'id',
          label: 'ID',
        },
        {
          value: 'firstName',
          label: this.$t('page-admin-leads.column-first-name'),
        },
        {
          value: 'phone',
          label: this.$t('page-admin-leads.column-phone'),
        },
        {
          value: 'email',
          label: this.$t('page-admin-leads.column-email'),
        },
        {
          value: 'createdAt',
          label: this.$t('page-admin-leads.column-created-at'),
        },
      ];
    },
  },

  methods: {
    ...mapActions('admin/leads', {
      fetchLeads: 'FETCH_LEADS',
    }),

    changePerPage(value) {
      this.perPage = value;
    },

    changeColumns(value) {
      this.selectedColumns = value;
    },

    search(value) {
      this.searchText = value;
    },

    renderValue(value) {
      if (!value) return '-';

      if (typeof value === 'object' && 'seconds' in value) {
        return this.$options.filters.date_format(value);
      }

      return value;
    },
  },

  created() {
    this.fetchLeads();
  },
};
</script>

<style lang="scss">
.leads-page {
  &__table {
    .table > tbody > tr> td {
      padding: 0;
    }

    &-td {
      padding: 0.5em 0.75em;
    }

    &-empty {
      height: 8em;
      text-align: center;
      color: #989898;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    &-error {
      color: red;
    }
  }
}
</style>
