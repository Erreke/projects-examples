<template>
  <cabinet-layout :title="$t('page-courses.title')">
    <div class="courses">
      <b-loading :active="isTimeToShowLoader" :is-full-page="false"></b-loading>

      <courses-toolbar
        v-if="isTimeToShowItems || isTimeToShowEmpty"
        :search-text="searchText"
        :selected-filters="selectedFilters"
        :selected-sorters="selectedSorters"
        :filters="filters"
        :is-filters-changed="isFiltersChanged"
        :is-sorters-changed="isSortersChanged"
        @search="setSearchText"
        @filter="setFilter"
        @sort="setSorter"
        @reset="reset"
      />

      <courses-statusbar
        v-if="isTimeToShowItems || isTimeToShowEmpty"
        :view-type="viewType"
        :counts="{ processed: processedItemsCount, all: allItemsCount }"
        @change-view-type="changeViewType"
      />

      <courses-table
        v-if="isTimeToShowItems && viewType === 'table'"
        :items="processedItems"
      />

      <courses-list
        v-if="isTimeToShowItems && viewType !== 'table'"
        :items="processedItems"
        :view-type="viewType"
      />

      <div v-if="isTimeToShowEmpty">
        По вашему запросу курсов не найдено
      </div>

      <div v-if="isTimeToShowNothing">
        Пока нет курсов
      </div>

      <div v-if="isTimeToShowError">
        Ошибка загрузки
      </div>
    </div>
  </cabinet-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

const PROTO_FILTERS = {
  "only-my-course": false,
  category: [],
  languages: [],
  subtitles: []
};

const PROTO_SORTERS = {
  title: "",
  rating: "",
  author: "",
  date: "",
  duration: "",
  students: ""
};

export default {
  name: "CoursesPage",

  usedVuexModules: ["courses"],

  components: {
    CoursesToolbar: () => import("./_courses-toolbar.vue"),
    CoursesStatusbar: () => import("./_courses-statusbar.vue"),
    CoursesTable: () => import("./_courses-table.vue"),
    CoursesList: () => import("./_courses-list.vue")
  },

  data() {
    return {
      searchText: "",
      selectedFilters: Object.assign({}, PROTO_FILTERS),
      selectedSorters: Object.assign({}, PROTO_SORTERS),
      isFiltersChanged: false,
      isSortersChanged: false
    };
  },

  computed: {
    ...mapState("courses", [
      "items",
      "isAllCorsesFetching",
      "allCorsesFetchingError",
      "categories",
      "languages",
      "subtitles",
      "viewType"
    ]),

    filters() {
      return {
        category: {
          caption: "Категория:",
          items: this.categories
        },
        languages: {
          caption: "Язык:",
          items: this.languages
        },
        subtitles: {
          caption: "Субтитры:",
          items: this.subtitles
        }
      };
    },

    isTimeToShowLoader() {
      return this.isAllCorsesFetching && !this.allCorsesFetchingError;
    },

    isTimeToShowItems() {
      return (
        this.processedItems.length > 0 &&
        !this.isAllCorsesFetching &&
        !this.allCorsesFetchingError
      );
    },

    isTimeToShowNothing() {
      return (
        this.allItemsCount === 0 &&
        !this.isAllCorsesFetching &&
        !this.allCorsesFetchingError
      );
    },

    isTimeToShowEmpty() {
      return (
        this.processedItems.length === 0 &&
        this.allItemsCount > 0 &&
        !this.isAllCorsesFetching &&
        !this.allCorsesFetchingError
      );
    },

    isTimeToShowError() {
      return !this.isAllCorsesFetching && this.allCorsesFetchingError;
    },

    processedItems() {
      let items = Object.keys(this.items).map(key => this.items[key]);

      if (this.selectedFilters["only-my-course"]) {
        items = items.filter(item => {
          return Object.prototype.hasOwnProperty.call(
            this.$_user.enrolledCourses,
            item.id
          );
        });
      }

      if (this.selectedFilters.category.length) {
        items = items.filter(item => {
          return this.selectedFilters.category.includes(item.category);
        });
      }

      if (this.selectedFilters.languages.length) {
        items = items.filter(item => {
          return this.selectedFilters.languages.some(lang =>
            item.languages.includes(lang)
          );
        });
      }

      if (this.selectedFilters.subtitles.length) {
        items = items.filter(item => {
          return this.selectedFilters.subtitles.some(lang =>
            item.subtitles.includes(lang)
          );
        });
      }

      if (this.searchText) {
        const searchText = this.searchText.toLowerCase();

        items = items.filter(item => {
          const author = item.author ? item.author.toLowerCase() : "";
          const title = item.title ? item.title.toLowerCase() : "";
          const description = item.description
            ? item.description.toLowerCase()
            : "";
          const tags = item.tags ? item.tags.join().toLowerCase() : "";

          return (
            author.includes(searchText.toLowerCase()) ||
            title.includes(searchText.toLowerCase()) ||
            description.includes(searchText.toLowerCase()) ||
            tags.includes(searchText.toLowerCase())
          );
        });
      }

      if (this.selectedSorters.title) {
        items = this.textSort(items, "title", this.selectedSorters.title);
      }

      if (this.selectedSorters.rating) {
        items = this.numberSort(items, "rating", this.selectedSorters.rating);
      }

      if (this.selectedSorters.author) {
        items = this.textSort(items, "author", this.selectedSorters.author);
      }

      if (this.selectedSorters.date) {
        items = this.dateSort(items, "updatedAt", this.selectedSorters.date);
      }

      if (this.selectedSorters.duration) {
        items = this.numberSort(
          items,
          "duration",
          this.selectedSorters.duration
        );
      }

      if (this.selectedSorters.students) {
        items = this.numberSort(
          items,
          "studentsCount",
          this.selectedSorters.students
        );
      }

      return items;
    },

    allItemsCount() {
      return Object.keys(this.items).length;
    },

    processedItemsCount() {
      return this.processedItems.length;
    }
  },

  methods: {
    ...mapActions("courses", {
      fetchAllCourses: "FETCH_ALL_COURSES",
      fetchMetaInfo: "FETCH_META_INFO"
    }),

    ...mapMutations("courses", {
      changeViewType: "CHANGE_VIEW_TYPE"
    }),

    setSearchText(value) {
      this.searchText = value;
    },

    setFilter(value) {
      this.selectedFilters[value.type] = value.value;
      this.isFiltersChanged =
        JSON.stringify(this.selectedFilters) !== JSON.stringify(PROTO_FILTERS);
    },

    setSorter(value) {
      this.selectedSorters = Object.assign({}, PROTO_SORTERS);
      this.selectedSorters[value.type] = value.value;
      this.isSortersChanged = true;
    },

    reset() {
      this.searchText = "";
      this.selectedFilters = Object.assign({}, PROTO_FILTERS);
      this.selectedSorters = Object.assign({}, PROTO_SORTERS);
      this.isFiltersChanged = false;
      this.isSortersChanged = false;
    },

    textSort(items, field, direction) {
      return items.sort((itemA, itemB) => {
        const a = itemA[field].toLowerCase();
        const b = itemB[field].toLowerCase();

        if (direction === "asc") {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          }

          return 0;
        } else {
          if (a > b) {
            return -1;
          } else if (a < b) {
            return 1;
          }

          return 0;
        }
      });
    },

    numberSort(items, field, direction) {
      return items.sort((itemA, itemB) => {
        if (direction === "asc") {
          return itemB[field] - itemA[field];
        }

        return itemA[field] - itemB[field];
      });
    },

    dateSort(items, field, direction) {
      return items.sort((itemA, itemB) => {
        if (direction === "asc") {
          return itemB[field].seconds - itemA[field].seconds;
        }

        return itemA[field].seconds - itemB[field].seconds;
      });
    }
  },

  mounted() {
    this.fetchAllCourses();
    this.fetchMetaInfo();
  },

  watch: {
    $_device(value) {
      if (value === "mobile" || value === "tablet") {
        this.changeViewType("flexBig");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.courses {
  padding: 2rem;
  position: relative;
  min-height: 700px;

  @include until($desktop) {
    padding: 2rem 1rem;
  }
}
</style>
