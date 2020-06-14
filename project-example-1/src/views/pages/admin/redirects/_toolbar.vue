<template>
  <nav class="navbar">
    <div class="navbar-menu">
      <div class="navbar-start">

        <div class="field is-grouped">
          <div class="control">
            <b-button
              type="is-success"
              icon-left="plus"
              @click.prevent="$emit('open-create-dialog')"
            >
              {{ $t('page-admin-redirects.create-new') }}
            </b-button>
          </div>

          <div class="control">
            <b-input
              :placeholder="$t('page-admin-redirects.searching')"
              type="search"
              icon="magnify"
              @input="search"
            >
            </b-input>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="field is-grouped">
          <div class="control">
            <b-dropdown
              v-model="columns"
              multiple
              aria-role="list"
            >
              <button class="button is-primary" type="button" slot="trigger">
                <span>{{ $t('page-admin-redirects.show-columns',
                   { count: columns.length, total: allColumns.length }) }}</span>
                <b-icon icon="menu-down"></b-icon>
              </button>

              <b-dropdown-item
                aria-role="listitem"
                v-for="(item, key) in allColumns"
                :key="key"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>

          <div class="control">
            <b-dropdown
              aria-role="list"
              v-model="perPageValue"
              @active-change="changePerPageDropdownState"
              @change="changePerPageDropdownValue"
            >
              <button class="button is-primary" type="button" slot="trigger">
                <span v-if="perPageValue === -1">{{ $t('page-admin-redirects.show-all') }}</span>
                <span v-else>{{ $t('page-admin-redirects.show-per-page',
                   { perPage: perPageValue }) }}</span>
                <b-icon :icon="isPerPageDropdownOpened ? 'menu-up' : 'menu-down'"></b-icon>
              </button>

              <b-dropdown-item
                aria-role="listitem"
                v-for="(item, key) in perPageItems"
                :value="item.value"
                :key="key"
              >
                <span v-if="item.value === -1">{{ $t('page-admin-redirects.show-all') }}</span>
                <span v-else>{{ $t('page-admin-redirects.show-per-page',
                   { perPage: item.value }) }}</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    allColumns: {
      type: Array,
      required: true,
    },
    selectedColumns: {
      type: Array,
      required: true,
    },
    initialPerPage: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isPerPageDropdownOpened: false,
      perPageValue: this.initialPerPage,
      perPageItems: [
        {
          value: 5,
        },
        {
          value: 25,
        },
        {
          value: 100,
        },
        {
          value: 500,
        },
        {
          value: -1,
        },
      ],
    };
  },

  computed: {
    columns: {
      get() {
        return this.selectedColumns;
      },

      set(value) {
        this.$emit('change-columns', value);
      },
    },
  },

  methods: {
    changePerPageDropdownState(isOpened) {
      this.isPerPageDropdownOpened = isOpened;
    },

    changePerPageDropdownValue(value) {
      this.$emit('change-per-page', value);
    },

    search(value) {
      this.$emit('search', value);
    },
  },
};
</script>
