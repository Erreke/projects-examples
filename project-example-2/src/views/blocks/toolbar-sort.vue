<template>
  <b-dropdown
    class="toolbar-sort"
    position="is-bottom-left"
    aria-role="menu"
    trap-focus
  >
    <b-button slot="trigger" icon-left="sort" type="is-primary">
      Сортировка
      <b-icon
        v-if="isSortersChanged"
        class="toolbar-sort__alert"
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
    >
      <div class="toolbar-sort__content">
        <sorter
          label="По названию:"
          :direction="selectedSorters.title"
          @sort="value => $emit('sort:title', value)"
        />
        <sorter
          label="По рейтингу:"
          :direction="selectedSorters.rating"
          @sort="value => $emit('sort:rating', value)"
        />
        <sorter
          label="По автору:"
          :direction="selectedSorters.author"
          @sort="value => $emit('sort:author', value)"
        />
        <sorter
          label="По дате:"
          :direction="selectedSorters.date"
          @sort="value => $emit('sort:date', value)"
        />
        <sorter
          label="По длительности:"
          :direction="selectedSorters.duration"
          @sort="value => $emit('sort:duration', value)"
        />
        <sorter
          label="По количеству студентов:"
          :direction="selectedSorters.students"
          @sort="value => $emit('sort:students', value)"
        />
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "BlockToolbarSort",

  props: {
    selectedSorters: {
      type: Object,
      required: true
    },
    isSortersChanged: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Sorter: () => import("@/views/blocks/sorter.vue")
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.toolbar-sort {
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
    width: 18rem;

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
