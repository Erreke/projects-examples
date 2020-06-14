<template>
  <nav class="breadcrumb">
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'is-active': index == items.length - 1 }"
      >
        <router-link :to="{ name: item.route, params: item.params }">
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
