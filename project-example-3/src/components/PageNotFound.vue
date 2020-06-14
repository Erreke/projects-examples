<template>
  <div :class="['page-not-found', { 'is-active': isActive }]">
    <v-icon dark>mdi-file-find</v-icon>
    <h1 class="font-weight-thin display-1">{{ $t("page-quiz.not-found") }}</h1>
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
