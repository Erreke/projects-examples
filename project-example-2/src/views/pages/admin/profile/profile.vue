<template>
  <cabinet-layout :title="$t('page-admin-profile.meta-title')">
    <profile />
  </cabinet-layout>
</template>

<script>
export default {
  name: "AdminProfilePage",

  components: {
    Profile: () => import("@/views/pages/common/profile/profile.vue")
  }
};
</script>
