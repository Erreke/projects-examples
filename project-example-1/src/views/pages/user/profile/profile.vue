<template>
  <user-layout :title="$t('page-profile.meta-title')" content-class="profile-content">
    <profile />
  </user-layout>
</template>

<script>
export default {
  name: 'ProfilePage',

  components: {
    Profile: () => import('@/views/pages/common/profile/profile.vue'),
  },
};
</script>

<style lang="scss">
.profile-content {
  padding-right: 0 !important;
}
</style>
