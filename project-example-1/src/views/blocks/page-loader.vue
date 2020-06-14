<template>
  <div :class="['pageloader', {'is-active': isActive}]">
    <span class="title">{{ $t('block-loader.loading') }}</span>
  </div>
</template>

<script>
export default {
  name: 'BlockPageLoader',

  props: {
    isActive: {
      required: false,
      default: false,
    },
  },
};
</script>
