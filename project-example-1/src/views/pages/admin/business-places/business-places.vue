<template>
  <admin-layout>
    <div class="admin">
      <h1 class="title">{{ $t('page-admin-business-places.title') }}</h1>

      <business-place-details-dialog
        @assing-to-user="assign"
      />

      <business-place-assign-dialog />

      <div class="business-places">
        <p v-if="isLoading">Идет загрузка...</p>

        <business-places-node
          v-else
          :is-root="true"
          :generation="1"
          :avatar="tree && tree.avatar"
          :childs="tree && tree.childs"
          :expired-at="tree && tree.automatonExpiredAt"
          :instime-expired-at="tree && tree.instimeExpiredAt"
          :instagram="tree && tree.instagram"
          :is-purchased="tree && tree.isPurchased"
          :is-instime-purchased="tree && tree.isInstimePurchased"
          :package-name="tree && tree.packageName"
          :referral-code="tree && tree.referralCode"
          :number="tree && tree.number"
        ></business-places-node>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'BusinessPlacesPage',

  usedVuexModules: ['admin'],

  components: {
    BusinessPlacesNode: () => import('./_node.vue'),
    BusinessPlaceDetailsDialog: () => import('./_details-dialog.vue'),
    BusinessPlaceAssignDialog: () => import('./_assign-dialog.vue'),
  },

  computed: {
    ...mapState('admin/business-places', ['tree', 'isLoading']),
  },

  methods: {
    ...mapActions('admin/business-places', {
      getBusinessPlacesInfo: 'GET_BUSINESS_PLACES_INFO',
    }),

    ...mapMutations('admin/business-places', {
      setCurrentItemId: 'SET_CURRENT_ITEM_ID',
      closeDetailsDialog: 'CLOSE_DETAILS_DIALOG',
      openAssignDialog: 'OPEN_ASSIGN_DIALOG',
    }),

    assign(id) {
      this.setCurrentItemId(id);
      this.closeDetailsDialog();
      this.openAssignDialog();
    },
  },

  created() {
    this.getBusinessPlacesInfo();
  },
};
</script>

<style lang="scss">
  .business-places {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow: scroll;
  }
</style>
