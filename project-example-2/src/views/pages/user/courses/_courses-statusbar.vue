<template>
  <div class="courses__statusbar">
    <p class="courses__statusbar-info">
      Курсов: {{ counts.processed }} из {{ counts.all }}
    </p>

    <button
      :class="[
        'courses__statusbar-change-view courses__statusbar-change-view-big',
        { 'is-active': viewType === 'flexBig' }
      ]"
      @click="$emit('change-view-type', 'flexBig')"
    >
      <b-icon icon="view-grid" />
    </button>

    <button
      :class="[
        'courses__statusbar-change-view courses__statusbar-change-view-medium',
        { 'is-active': viewType === 'flexMedium' }
      ]"
      @click="$emit('change-view-type', 'flexMedium')"
    >
      <b-icon icon="view-module" />
    </button>

    <button
      :class="[
        'courses__statusbar-change-view courses__statusbar-change-view-table',
        { 'is-active': viewType === 'table' }
      ]"
      @click="$emit('change-view-type', 'table')"
    >
      <b-icon icon="view-list" />
    </button>
  </div>
</template>

<script>
export default {
  name: "CoursesPageStatusbar",

  props: {
    counts: {
      type: Object,
      required: true
    },
    viewType: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.courses__statusbar {
  display: flex;
  justify-content: space-between;
  margin: 0 0 1rem;

  &-info {
    line-height: 2rem;
    flex: 1;
  }

  &-change-view {
    padding: 0;
    background: none;
    border: 0;
    height: 2rem;
    width: 2rem;
    border-radius: 3px;
    color: rgb(52, 66, 90);
    cursor: pointer;

    &.is-active {
      background-color: #ccc;
    }

    &:hover {
      box-shadow: inset 0 0 4px rgba(52, 66, 90, 0.3);
    }

    &:focus,
    &:active {
      outline: none;
      background-color: #bfbebe;
    }

    @include until($desktop) {
      &-big,
      &-medium,
      &-table {
        display: none;
      }
    }

    @include until($widescreen) {
      &-medium {
        display: none;
      }
    }
  }
}
</style>
