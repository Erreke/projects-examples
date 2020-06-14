<template>
  <cabinet-layout :title="$t('page-profile.meta-title')">
    <profile />
  </cabinet-layout>
</template>

<script>
export default {
  name: "ProfilePage",

  components: {
    Profile: () => import("@/views/pages/common/profile/profile.vue")
  }
};
</script>
