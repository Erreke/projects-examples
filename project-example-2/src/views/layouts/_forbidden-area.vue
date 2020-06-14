<template>
  <error-splash-screen
    :title="$t('block-errors.err-oops-403-title')"
    :subtitle="$t('block-errors.err-oops-403-subtitle')"
    :route-name="redirectUrl"
    :link-text="$t('block-errors.err-oops-403-back-cabinet')"
  />
</template>

<script>
export default {
  components: {
    ErrorSplashScreen: () => import("@/views/blocks/error-splash-screen.vue")
  },

  computed: {
    redirectUrl() {
      return this.$_user && this.$_user.isAdmin ? "admin" : "courses";
    }
  }
};
</script>
