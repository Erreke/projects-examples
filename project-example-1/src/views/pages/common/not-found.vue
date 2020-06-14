<template>
  <error-splash-screen
    :title="$t('page-not-found.title')"
    :subtitle="$t('page-not-found.subtitle')"
    route-name="home"
    :link-text="$t('page-not-found.back-to-home')"
  />
</template>

<script>
export default {
  name: 'NotFoundPage',

  components: {
    ErrorSplashScreen: () => import('@/views/blocks/error-splash-screen.vue'),
  },

  metaInfo() {
    return {
      title: this.$t('page-not-found.meta-title'),
    };
  },
};
</script>
