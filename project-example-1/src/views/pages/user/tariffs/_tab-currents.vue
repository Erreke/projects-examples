<template>
  <div class="tariffs__current">
    <div class="tariffs__current-list" v-if="tariffs.length > 0">
      <currents-item
        v-for="(item, key) in tariffs"
        :key="key"
        :item="item"
        @buy="$emit('buy')"
      />
    </div>

    <div v-else-if="isLoading && !loadingError">
      <p>{{ $t('page-tariffs.loading') }}</p>
    </div>

    <b-notification
      v-else-if="!isLoading && loadingError"
      type="is-danger"
      role="alert"
      :closable="false"
    >
      {{ $t('page-tariffs.error-on-loading') }}
    </b-notification>

    <div class="content" v-else>
      <p>{{ $t('page-tariffs.you-do-not-have') }}</p>
      <button class="button is-primary" @click.prevent="$emit('buy')">
        {{ $t('page-tariffs.buy') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TariffsPageCurrentTab',

  components: {
    CurrentsItem: () => import('./_tab-currents-item.vue'),
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    tariffs: {
      type: Array,
      required: true,
    },

    loadingError: {
      validator: prop => typeof prop === 'object' || typeof prop === 'string' || prop === null,
      required: false,
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.tariffs__current {
  &-list {
    display: flex;
    flex-flow: wrap;
    margin: 0 -.5rem;

    @media (max-width: $tablet) {
      display: block;
    }
  }
}
</style>
