<template>
  <admin-layout
    class="redirects-page"
    :title="$t('page-admin-redirects.title', { count: items.length })"
    :subtitle="$t('page-admin-redirects.title', { count: items.length })"
  >
    <toolbar
      v-if="allInfo.length > 0"
      :initial-per-page="perPage"
      :all-columns="columns"
      :selected-columns="selectedColumns"
      @search="search"
      @open-create-dialog="openCreateRedirectDialog"
      @change-columns="changeColumns"
      @change-per-page="changePerPage"
    />

    <b-table
      :data="items"
      class="redirects-page__table"
      ref="table"
      :paginated="isPaginated"
      :per-page="perPage"
      detailed
      detail-key="id"
      :opened-detailed="[openedRow]"
      :show-detail-icon="false"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @details-close="closeRow"
      @details-open="closeOtherRows"
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
          <div class="redirects-page__table-td" @click="toggle(props.row)">

            <span v-if="item.value === 'type'" class="icon">
              <i v-if="props.row[item.value] === 'whatsapp'"
                class="mdi mdi-whatsapp mdi-24px"></i>
              <i v-if="props.row[item.value] === 'external'"
                class="mdi mdi-exit-to-app mdi-24px"></i>
              <i v-if="props.row[item.value] === 'file'"
                class="mdi mdi-file-document-outline mdi-24px"></i>
            </span>

            <span v-else>{{ renderValue(props.row[item.value]) }}</span>
          </div>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <redirect-details
          :key="props.row.id"
          :redirect="props.row"
          :redirects-types="redirectsTypes"
          @close="closeRow"
        />
      </template>

      <template slot="empty">
        <div class="content">
          <div class="redirects-page__table-empty">
            <p v-if="isAllInfoLoading">{{ $t('page-admin-redirects.loading') }}</p>

            <p v-if="!isAllInfoLoading && allErrors" class="redirects-page__table-error">
              {{ $t('block-global.errors-has-ocurred-goto-developers') }}
            </p>

            <p v-if="!isAllInfoLoading && !allErrors && allInfo.length > 0">
              {{ $t('page-admin-redirects.nothing-found') }}
            </p>

            <div v-if="!isAllInfoLoading && !allErrors && allInfo.length === 0">
              <p>{{ $t('page-admin-redirects.you-dont-have-redirects') }}</p>
              <p>
                <b-button
                  v-if="allInfo.length === 0"
                  type="is-success"
                  icon-left="plus"
                  @click.prevent="openCreateRedirectDialog"
                >
                  {{ $t('page-admin-redirects.button-create') }}
                </b-button>
              </p>
            </div>
          </div>
        </div>
      </template>

      <template slot="footer" v-if="allInfo.length">
        <div class="content">
          <p>{{ $t('page-admin-redirects.showed-redirects', {
            count: items.length,
            total: allInfo.length
          }) }}</p>
        </div>
      </template>
    </b-table>

    <create-redirect-dialog
      :is-opened="isCreateRedirectDialogOpened"
      :redirects-types="redirectsTypes"
      @close="closeCreateRedirectDialog"
    />
  </admin-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AdminRedirectsPage',

  usedVuexModules: ['admin'],

  components: {
    Toolbar: () => import('./_toolbar'),
    RedirectDetails: () => import('./_redirect-details'),
    CreateRedirectDialog: () => import('./_create-redirect-dialog'),
  },

  data() {
    return {
      perPage: 25,
      openedRow: null,
      isCreateRedirectDialogOpened: false,
      searchText: '',
      selectedColumns: [
        'type',
        'redirectFrom',
        'phone',
        'text',
      ],
      redirectsTypes: {
        whatsapp: 'Сообщение на WhatsApp',
        external: 'Внешняя ссылка',
        file: 'Файл для скачивания',
      },
    };
  },

  computed: {
    ...mapState('admin/redirects', ['allInfo', 'allErrors', 'isAllInfoLoading']),

    items() {
      let items = this.allInfo;
      const searchText = this.searchText.toLowerCase();

      if (searchText) {
        items = items.filter(item => (
          (item.id.toLowerCase().includes(searchText))
            || (item.redirectFrom.toLowerCase().includes(searchText))
            || (item.phone.toLowerCase().includes(searchText))
            || (item.text.toLowerCase().includes(searchText))
        ));
      }

      return items;
    },

    isPaginated() {
      return this.allInfo.length > 0 && this.perPage > 0;
    },

    columns() {
      return [
        {
          value: 'id',
          label: 'ID',
        },
        {
          value: 'type',
          label: this.$t('page-admin-redirects.column-type'),
        },
        {
          value: 'redirectFrom',
          label: this.$t('page-admin-redirects.column-redirect-from'),
        },
        {
          value: 'redirectTo',
          label: this.$t('page-admin-redirects.column-redirect-to'),
        },
        {
          value: 'phone',
          label: this.$t('page-admin-redirects.column-phone'),
        },
        {
          value: 'text',
          label: this.$t('page-admin-redirects.column-text'),
        },
        {
          value: 'createdAt',
          label: this.$t('page-admin-redirects.column-created-at'),
        },
        {
          value: 'createdBy',
          label: this.$t('page-admin-redirects.column-created-by'),
        },
        {
          value: 'updatedAt',
          label: this.$t('page-admin-redirects.column-updated-at'),
        },
        {
          value: 'updatedBy',
          label: this.$t('page-admin-redirects.column-updated-by'),
        },
      ];
    },
  },

  methods: {
    ...mapActions('admin/redirects', {
      fetchAllRedirectsInfo: 'FETCH_ALL_REDIRECTS_INFO',
    }),

    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.id;
    },

    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },

    openCreateRedirectDialog() {
      this.closeRow();
      this.isCreateRedirectDialogOpened = true;
    },

    closeCreateRedirectDialog() {
      this.isCreateRedirectDialogOpened = false;
    },

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
    this.fetchAllRedirectsInfo();
  },
};
</script>

<style lang="scss">
.redirects-page {
  &__table {
    .table > tbody > tr> td {
      padding: 0;
    }

    &-td {
      cursor: pointer;
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
