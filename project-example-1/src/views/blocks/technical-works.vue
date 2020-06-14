<template>
  <error-splash-screen
    title="На сайте ведутся технические работы"
    subtitle="Приносим извинения за предоставленные неудобства"
  >
  </error-splash-screen>
</template>

<script>
export default {
  components: {
    ErrorSplashScreen: () => import('@/views/blocks/error-splash-screen.vue'),
  },
};
</script>
