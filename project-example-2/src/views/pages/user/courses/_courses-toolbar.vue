<template>
  <div class="courses__toolbar">
    <b-field class="courses__toolbar-search">
      <b-input
        :placeholder="$t('page-courses.placeholder-search')"
        type="search"
        icon="magnify"
        v-model="search"
      />
    </b-field>

    <toolbar-filter
      :filters="filters"
      :selected-filters="selectedFilters"
      :is-filters-changed="isFiltersChanged"
      @filter:only-my-courses="value => filter('only-my-course', value)"
      @filter:category="value => filter('category', value)"
      @filter:languages="value => filter('languages', value)"
      @filter:subtitles="value => filter('subtitles', value)"
    />

    <toolbar-sort
      :selected-sorters="selectedSorters"
      :is-sorters-changed="isSortersChanged"
      @sort:title="value => sort('title', value)"
      @sort:rating="value => sort('rating', value)"
      @sort:author="value => sort('author', value)"
      @sort:date="value => sort('date', value)"
      @sort:duration="value => sort('duration', value)"
      @sort:students="value => sort('students', value)"
    />

    <b-button
      class="courses__toolbar-trigger"
      icon-left="delete"
      type="is-danger"
      @click.prevent="reset"
    >
      Сбросить
    </b-button>
  </div>
</template>

<script>
export default {
  name: "CoursesPageToolbar",

  components: {
    ToolbarFilter: () => import("@/views/blocks/toolbar-filter.vue"),
    ToolbarSort: () => import("@/views/blocks/toolbar-sort.vue")
  },

  props: {
    searchText: {
      type: String,
      required: true
    },

    selectedFilters: {
      type: Object,
      required: true
    },

    selectedSorters: {
      type: Object,
      required: true
    },

    filters: {
      type: Object,
      required: true
    },

    isFiltersChanged: {
      type: Boolean,
      required: true
    },

    isSortersChanged: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    search: {
      get() {
        return this.searchText;
      },
      set(value) {
        this.$emit("search", value);
      }
    }
  },

  methods: {
    reset() {
      this.$emit("reset");
    },

    filter(type, value) {
      this.$emit("filter", { type, value });
    },

    sort(type, value) {
      this.$emit("sort", { type, value });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.courses__toolbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin: 0 0 1rem;
  background-color: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1);

  @include until($tablet) {
    flex-flow: column;

    .dropdown.is-mobile-modal > .dropdown-menu {
      top: 1rem !important;
      transform: translate3d(calc(-50% + 204px / 2), 0, 0);
    }
  }

  &-search.field {
    flex: 1 1 40%;
    margin: 0 1rem 0 0;

    @include until($tablet) {
      margin: 0 0 1rem !important;
    }
  }
}
</style>
