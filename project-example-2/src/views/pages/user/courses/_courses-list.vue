<template>
  <div class="courses__list">
    <courses-item
      v-for="(item, key) in items"
      :key="key"
      :item="item"
      :view-type="viewType"
    />
  </div>
</template>

<script>
export default {
  name: "CoursesPageList",

  props: {
    items: {
      type: Array,
      required: true
    },
    viewType: {
      type: String,
      required: true
    }
  },

  components: {
    CoursesItem: () => import("./_courses-item.vue")
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.courses__list {
  display: flex;
  flex-flow: wrap;
  justify-content: flex-start;
  margin: 0 -0.5rem;

  @include until($desktop) {
    flex-flow: column;
    margin: 1rem 0;
  }
}
</style>
