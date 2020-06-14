<template>
  <div :class="['pageloader', { 'is-active': isActive }]">
    <h1 class="font-weight-thin display-1">{{ $t("block-loader.loading") }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      required: false,
      default: false
    }
  }
};
</script>
