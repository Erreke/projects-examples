<template>
  <div class="finances-toolbar">
    <div class="finances-toolbar-start">
      <b-field grouped class="navbar-item">
        <b-input
          :placeholder="$t('page-admin-finances.search-placeholder')"
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
            <span>Статус: {{ $t(`page-admin-finances.filter-status-${statusItems[selectedStatus] }`).toLowerCase() }}</span>
            <b-icon :icon="`menu-${isStatusesOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in statusItems"
            :value="key"
            :key="key"
          >
            <span>{{ $t(`page-admin-finances.filter-status-${item}`) }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown
          v-model="currentTypeValue"
          @active-change="toggleTypeDropdown"
        >
          <a
            class="navbar-item"
            slot="trigger"
          >
            <span>Тип: {{ $t(`page-admin-finances.filter-type-${typeItems[selectedType] }`).toLowerCase() }}</span>
            <b-icon :icon="`menu-${isTypeOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in typeItems"
            :value="key"
            :key="key"
          >
            <span>{{ $t(`page-admin-finances.filter-type-${item}`) }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown
          v-if="selectedType === 'cashback'"
          v-model="currentCashbackValue"
          @active-change="toggleCashbackDropdown"
        >
          <a
            class="navbar-item"
            slot="trigger"
          >
            <span>Кэшбэк: {{ $t(`page-admin-finances.filter-cashback-${cashbackItems[selectedCashback] }`).toLowerCase() }}</span>
            <b-icon :icon="`menu-${isCashbackOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in cashbackItems"
            :value="key"
            :key="key"
          >
            <span>{{ $t(`page-admin-finances.filter-cashback-${item}`) }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown
          v-if="selectedType === 'bonus'"
          v-model="currentBonusValue"
          @active-change="toggleBonusDropdown"
        >
          <a
            class="navbar-item"
            slot="trigger"
          >
            <span>Бонус: {{ $t(`page-admin-finances.filter-bonus-${bonusItems[selectedBonus] }`).toLowerCase() }}</span>
            <b-icon :icon="`menu-${isBonusOpened ? 'down' : 'up'}`"></b-icon>
          </a>

          <b-dropdown-item
            v-for="(item, key) in bonusItems"
            :value="key"
            :key="key"
          >
            <span>{{ $t(`page-admin-finances.filter-bonus-${item}`) }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-button
          v-if="isResetButtonActive"
          type="is-danger"
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
  name: 'AdminFinancesToolbar',

  props: {
    statusItems: {
      type: Object,
      required: true,
    },

    typeItems: {
      type: Object,
      required: true,
    },

    cashbackItems: {
      type: Object,
      required: true,
    },

    bonusItems: {
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

    selectedType: {
      type: String,
      required: true,
    },

    selectedStatus: {
      type: String,
      required: true,
    },

    selectedCashback: {
      type: String,
      required: true,
    },

    selectedBonus: {
      type: String,
      required: true,
    },

    selectedPerPage: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isStatusesOpened: false,
      isTypeOpened: false,
      isCashbackOpened: false,
      isBonusOpened: false,
      isPerPageOpened: false,
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

    currentTypeValue: {
      get() {
        return this.selectedType;
      },

      set(value) {
        this.$emit('change-type', value);
      },
    },

    currentCashbackValue: {
      get() {
        return this.selectedCashback;
      },

      set(value) {
        this.$emit('change-cashback', value);
      },
    },

    currentBonusValue: {
      get() {
        return this.selectedBonus;
      },

      set(value) {
        this.$emit('change-bonus', value);
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

    isResetButtonActive() {
      return this.searchText !== ''
        || this.selectedStatus !== 'all'
        || this.selectedType !== 'all'
        || this.selectedCashback !== 'got'
        || this.selectedBonus !== 'got';
    },
  },

  methods: {
    toggleStatusesDropdown(value) {
      this.isStatusesOpened = value;
    },

    toggleTypeDropdown(value) {
      this.isTypeOpened = value;
    },

    toggleCashbackDropdown(value) {
      this.isCashbackOpened = value;
    },

    toggleBonusDropdown(value) {
      this.isBonusOpened = value;
    },

    togglePerPageDropdown(value) {
      this.isPerPageOpened = value;
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
