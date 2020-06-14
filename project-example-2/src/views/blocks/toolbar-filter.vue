<template>
  <b-dropdown
    class="toolbar-filter"
    position="is-bottom-left"
    aria-role="menu"
    trap-focus
    @active-change="toggle"
  >
    <b-button slot="trigger" icon-left="filter" type="is-primary">
      Фильтрация
      <b-icon
        v-if="isFiltersChanged"
        class="toolbar-filter__alert"
        icon="alert-box"
        size="is-small"
        type="is-danger"
      />
    </b-button>

    <b-dropdown-item
      aria-role="menu-item"
      :focusable="false"
      custom
      paddingless
      ref="toolbarSort"
    >
      <div class="toolbar-filter__content">
        <b-switch :rounded="false" v-model="isOnlyMyCourses">
          Только "мои курсы"
        </b-switch>
        <hr />

        <p>
          <strong>{{ filters.category.caption }}</strong>
        </p>
        <b-field
          v-for="(item, key) in filters.category.items"
          :key="`category${key}`"
        >
          <b-checkbox v-model="category" :native-value="item">
            {{ item }}
          </b-checkbox>
        </b-field>
        <hr />

        <p>
          <strong>{{ filters.languages.caption }}</strong>
        </p>
        <b-field
          v-for="(item, key) in filters.languages.items"
          :key="`languages${key}`"
        >
          <b-checkbox v-model="languages" :native-value="item">
            {{ item }}
          </b-checkbox>
        </b-field>
        <hr />

        <p>
          <strong>{{ filters.subtitles.caption }}</strong>
        </p>
        <b-field
          v-for="(item, key) in filters.subtitles.items"
          :key="`subtitles${key}`"
        >
          <b-checkbox v-model="subtitles" :native-value="item">
            {{ item }}
          </b-checkbox>
        </b-field>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "BlockToolbarFilter",

  props: {
    filters: {
      type: Object,
      required: true
    },
    selectedFilters: {
      type: Object,
      required: true
    },
    isFiltersChanged: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    isOnlyMyCourses: {
      get() {
        return this.selectedFilters["only-my-course"];
      },

      set(value) {
        this.$emit("filter:only-my-courses", value);
      }
    },

    category: {
      get() {
        return this.selectedFilters.category;
      },

      set(value) {
        this.$emit("filter:category", value);
      }
    },

    languages: {
      get() {
        return this.selectedFilters.languages;
      },

      set(value) {
        this.$emit("filter:languages", value);
      }
    },

    subtitles: {
      get() {
        return this.selectedFilters.subtitles;
      },

      set(value) {
        this.$emit("filter:subtitles", value);
      }
    }
  },

  methods: {
    toggle(isOpened) {
      const layout = document.getElementsByClassName("layout__container");

      if (isOpened) {
        this.$nextTick(() => {
          const minHeight =
            400 + this.$refs.toolbarSort.$el.getBoundingClientRect().height;

          layout.forEach(el => (el.style.minHeight = `${minHeight}px`));
        });
      } else {
        layout.forEach(el => el.removeAttribute("style"));
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.toolbar-filter {
  margin: 0 1rem 0 0 !important;

  @include until($tablet) {
    margin: 0 0 1rem !important;

    .dropdown-trigger,
    .dropdown-trigger .button {
      width: 100%;
    }
  }

  &__content {
    padding: 1rem;
    width: 20rem;

    @include until($tablet) {
      width: auto;
    }

    p {
      margin: 0 0 1rem;
    }
  }

  &__alert {
    position: absolute;
    right: -6px;
    top: -14px;
  }
}
</style>
