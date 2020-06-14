<template>
  <div class="business__current">
    <div class="business__current-list" v-if="businessPlaces.length > 0">
      <business-place
        v-for="(item, key) in businessPlaces"
        :key="key"
        :item="item"
        @buy="$emit('buy')"
      />
    </div>

    <div v-else-if="isLoading">
      <p>{{ $t('page-business.loading') }}</p>
    </div>

    <div class="content" v-else>
      <p>{{ $t('page-business.you-do-not-have') }}</p>
      <button class="button is-primary" @click.prevent="$emit('buy')">
        {{ $t('page-business.buy') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessPageCurrentTab',

  components: {
    BusinessPlace: () => import('./_business-place.vue'),
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    businessPlaces: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.business__current {
  &-list {
    display: flex;
    flex-flow: wrap;

    @media (max-width: $tablet) {
      display: block;
    }
  }
}
</style>
