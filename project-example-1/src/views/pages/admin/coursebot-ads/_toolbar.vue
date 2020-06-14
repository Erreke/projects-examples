<template>
  <div class="finances-toolbar">
    <div class="finances-toolbar-start">
      <b-field grouped class="navbar-item">
        <b-input
          :placeholder="$t('page-admin-coursebot-ads.search-placeholder')"
          type="search"
          icon="magnify"
          v-model="searchTextValue"
        >
        </b-input>

        <b-dropdown
          v-model="currentStatusValue"
          @active-change="toggleStatusesDropdown"
        >
          <a
            class="navbar-item"
            slot="trigger"
          >
            <span>Статус: {{ $t(`page-admin-coursebot-ads.filter-status-${statusItems[selectedStatus] }`).toLowerCase() }}</span>
            <b-icon :icon="`menu-${isStatusesOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in statusItems"
            :value="key"
            :key="key"
          >
            <span>{{ $t(`page-admin-coursebot-ads.filter-status-${item}`) }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown
          v-model="currentTariffValue"
          @active-change="toggleTariffsDropdown"
        >
          <a
            class="navbar-item"
            slot="trigger"
          >
            <span>Тариф: {{ tariffItems[selectedTariff] }}</span>
            <b-icon :icon="`menu-${isTariffsOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in tariffItems"
            :value="key"
            :key="key"
          >
            <span>{{ item }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown
          multiple
          position="is-bottom-left"
          v-model="selectedColumnsValues"
          @active-change="toggleColumnsDropdown"
        >
          <a
            class="toolbar__item"
            slot="trigger"
          >
            <span>Колонки</span>
            <b-icon :icon="`menu-${isColumnsOpened ? 'down' : 'up'}`"></b-icon>
            <span v-if="selectedColumnsValues.length > 0" class="tag is-success">
              {{ selectedColumnsValues.length }}
            </span>
          </a>

          <b-dropdown-item
            v-for="(item, key) in columnsItems"
            :value="key"
            :key="key"
          >
            <span>{{ $t(`page-admin-coursebot-ads.${item}`) }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-button
          v-if="isResetButtonActive"
          type="is-danger"
          style="margin-left: 1rem;"
          @click.prevent="$emit('reset')"
        >
          Сбросить
        </b-button>
      </b-field>
    </div>

    <div class="finances-toolbar-end">
      <b-field grouped class="navbar-item">
        <b-dropdown
          position="is-bottom-left"
          v-model="currentPerPageValue"
          @active-change="togglePerPageDropdown"
        >
          <a
            class="navbar-item"
            slot="trigger"
          >
            <span>Показать по: {{ currentPerPageValue }}</span>
            <b-icon :icon="`menu-${isPerPageOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in perPageItems"
            :value="key"
            :key="key"
          >
            <span>{{ key }}</span>
          </b-dropdown-item>
        </b-dropdown>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminCoursebotAdsToolbar',

  props: {
    statusItems: {
      type: Object,
      required: true,
    },

    tariffItems: {
      type: Object,
      required: true,
    },

    columnsItems: {
      type: Object,
      required: true,
    },

    perPageItems: {
      type: Object,
      required: true,
    },

    searchText: {
      type: String,
      required: true,
    },

    selectedStatus: {
      type: String,
      required: true,
    },

    selectedTariff: {
      type: String,
      required: true,
    },

    selectedPerPage: {
      type: Number,
      required: true,
    },

    initialColumns: {
      type: String,
      required: true,
    },

    selectedColumns: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isStatusesOpened: false,
      isTariffsOpened: false,
      isPerPageOpened: false,
      isColumnsOpened: false,
    };
  },

  computed: {
    searchTextValue: {
      get() {
        return this.searchText;
      },

      set(value) {
        this.$emit('change-search-text', value);
      },
    },

    currentStatusValue: {
      get() {
        return this.selectedStatus;
      },

      set(value) {
        this.$emit('change-status', value);
      },
    },

    currentTariffValue: {
      get() {
        return this.selectedTariff;
      },

      set(value) {
        this.$emit('change-tariff', value);
      },
    },

    currentPerPageValue: {
      get() {
        return this.perPageItems[this.selectedPerPage];
      },

      set(value) {
        this.$emit('change-per-page', value);
      },
    },

    selectedColumnsValues: {
      get() {
        return this.selectedColumns.split(',');
      },

      set(value) {
        this.$emit('change-columns', value);
      },
    },

    isResetButtonActive() {
      return this.searchText !== ''
        || this.selectedStatus !== 'all'
        || this.selectedTariff !== 'all'
        || this.selectedColumns !== this.initialColumns;
    },
  },

  methods: {
    toggleStatusesDropdown(value) {
      this.isStatusesOpened = value;
    },

    toggleTariffsDropdown(value) {
      this.isTariffsOpened = value;
    },

    togglePerPageDropdown(value) {
      this.isPerPageOpened = value;
    },

    toggleColumnsDropdown(value) {
      this.isColumnsOpened = value;
    },
  },
};
</script>

<style lang="scss">
.finances-toolbar {
  display: flex;
  justify-content: space-between;
}
</style>
