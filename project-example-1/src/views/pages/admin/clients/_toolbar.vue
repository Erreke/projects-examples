<template>
  <div class="toolbar">

      <div class="toolbar__start">
        <b-field grouped>
          <b-button
            type="is-success"
            icon-left="account-plus"
            @click.prevent="$emit('open-client-creating-dialog')"
          >
            Создать
          </b-button>

          <b-dropdown
            multiple
            v-model="selectedSearchPlacesModel"
            @change="changeSearchPlaces"
            @active-change="toggleSearchPlaceDropdown"
          >
            <a
              class="toolbar__item"
              slot="trigger"
            >
              <span>Поиск по</span>
              <b-icon :icon="`menu-${isSearchPlaceOpened ? 'down' : 'up'}`"></b-icon>
              <span v-if="selectedSearchPlaces.length > 0" class="tag is-success">
                {{ selectedSearchPlaces.length }}
              </span>
            </a>

            <b-dropdown-item
              v-for="(item, key) in searchPlaceItems"
              :value="key"
              :key="key"
            >
              <span>{{ $t(`page-admin-clients.filter-search-place-${item}`) }}</span>
            </b-dropdown-item>
          </b-dropdown>

          <b-input
            :placeholder="$t('page-admin-clients.search-placeholder')"
            type="search"
            icon="magnify"
            @input="search"
          >
          </b-input>

          <b-dropdown
            v-model="currentStatusValue"
            @active-change="toggleStatusesDropdown"
          >
            <a
              class="toolbar__item"
              slot="trigger"
            >
              <span>
                {{ $t(`page-admin-clients.filter-status-${statusItems[selectedStatus] }`) }}
              </span>
              <b-icon :icon="`menu-${isStatusesOpened ? 'down' : 'up'}`"></b-icon>
            </a>

            <b-dropdown-item
              v-for="(item, key) in statusItems"
              :value="key"
              :key="key"
            >
              <span>{{ $t(`page-admin-clients.filter-status-${item}`) }}</span>
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            multiple
            @change="changeFilters"
            @active-change="toggleFiltersDropdown"
          >
            <a
              class="toolbar__item"
              slot="trigger"
            >
              <span>Фильтры</span>
              <b-icon :icon="`menu-${isFiltersOpened ? 'down' : 'up'}`"></b-icon>
              <span v-if="selectedFilters.length > 0" class="tag is-success">
                {{ selectedFilters.length }}
              </span>
            </a>

            <b-dropdown-item
              v-for="(item, key) in filterItems"
              :value="key"
              :key="key"
            >
              <span>{{ $t(`page-admin-clients.filter-${item}`) }}</span>
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            multiple
            position="is-bottom-left"
            v-model="selectedColumnsModel"
            @change="changeColumns"
            @active-change="toggleColumnsDropdown"
          >
            <a
              class="toolbar__item"
              slot="trigger"
            >
              <span>Колонки</span>
              <b-icon :icon="`menu-${isColumnsOpened ? 'down' : 'up'}`"></b-icon>
              <span v-if="selectedColumns.length > 0" class="tag is-success">
                {{ selectedColumns.length }}
              </span>
            </a>

            <b-dropdown-item
              v-for="(item, key) in columnsItems"
              :value="key"
              :key="key"
            >
              <span>{{ $t(`page-admin-clients.${item}`) }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
      </div>

      <div class="toolbar__end">
        <b-dropdown
          position="is-bottom-left"
          v-model="currentPerPageValue"
          @active-change="togglePerPageDropdown"
        >
          <a
            class="toolbar__item"
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
      </div>

  </div>
</template>

<script>
export default {
  name: 'AdminClientsPageToolbar',

  props: {
    searchPlaceItems: {
      type: Object,
      required: true,
    },

    statusItems: {
      type: Object,
      required: true,
    },

    filterItems: {
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

    selectedSearchPlaces: {
      type: Array,
      required: true,
    },

    selectedStatus: {
      type: String,
      required: true,
    },

    selectedFilters: {
      type: Array,
      required: true,
    },

    selectedPerPage: {
      type: Number,
      required: true,
    },

    selectedColumns: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isSearchPlaceOpened: false,
      isStatusesOpened: false,
      isFiltersOpened: false,
      isColumnsOpened: false,
      isPerPageOpened: false,
      selectedColumnsModel: this.selectedColumns,
      selectedSearchPlacesModel: this.selectedSearchPlaces,
    };
  },

  computed: {
    currentStatusValue: {
      get() {
        return this.selectedStatus;
      },

      set(value) {
        this.$emit('changeStatus', value);
      },
    },

    currentPerPageValue: {
      get() {
        return this.perPageItems[this.selectedPerPage];
      },

      set(value) {
        this.$emit('changePerPage', value);
      },
    },
  },

  methods: {
    toggleSearchPlaceDropdown(value) {
      this.isSearchPlaceOpened = value;
    },

    toggleStatusesDropdown(value) {
      this.isStatusesOpened = value;
    },

    toggleFiltersDropdown(value) {
      this.isFiltersOpened = value;
    },

    toggleColumnsDropdown(value) {
      this.isColumnsOpened = value;
    },

    togglePerPageDropdown(value) {
      this.isPerPageOpened = value;
    },

    search(value) {
      this.$emit('search', value);
    },

    changeSearchPlaces(searchPlaces) {
      this.$emit('changeSearchPlaces', searchPlaces);
    },

    changeFilters(filters) {
      this.$emit('changeFilters', filters);
    },

    changeColumns(columns) {
      this.$emit('changeColumns', columns);
    },
  },
};
</script>

<style lang="scss">
.toolbar {
  display: flex;
  padding: 0.5rem 0.75rem;
  position: relative;

  &__start {
    justify-content: flex-start;
    margin-right: auto;
  }

  &__end {
    justify-content: flex-end;
    margin-left: auto;
  }

  &__item {
    cursor: pointer;
    display: flex;
    height: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    color: #4a4a4a;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
    position: relative;
  }
}
</style>
