<template>
  <div :class="['page-not-found', { 'is-active': isActive }]">
    <NotFound />
  </div>
</template>

<script>
import NotFound from "@/components/NotFound";

export default {
  props: {
    isActive: {
      required: false,
      default: false
    }
  },

  components: {
    NotFound
  }
};
</script>
