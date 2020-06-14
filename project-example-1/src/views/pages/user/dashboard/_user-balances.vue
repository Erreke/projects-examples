<template>
  <div class="tile is-ancestor dashboard__balance">
    <div class="tile is-parent">
      <div class="tile is-child notification is-balance-info">
        <b-loading :is-full-page="false" :active="isLoading"></b-loading>

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child">
              <p class="title">{{ $t('page-dashboard.current-balance') }}</p>
              <p class="subtitle dashboard__balance-title">
                {{ agentBalance | currency_format }}
              </p>

              <b-button
                class="dashboard__balance-button"
                type="is-details"
                icon-left="table-large"
                @click.prevent="$router.push({ name: 'finances' })"
              >
                {{ $t('page-dashboard.details') }}
              </b-button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="tile is-parent">
      <div class="tile is-child notification is-total-info">
        <b-loading :is-full-page="false" :active="isLoading"></b-loading>

        <p class="title">{{ $t('page-dashboard.total-earned') }}</p>
        <p class="subtitle dashboard__balance-title">
          {{ agentEarned | currency_format }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPageUserBalance',

  props: {
    agentBalance: {
      type: Number,
      required: true,
    },

    agentEarned: {
      type: Number,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.dashboard__balance {
  &-title {
    font-size: 3rem;
  }

  &-button {
    display: block;
    text-align: left;
    color: #fff;
    border: none;
    background-color: #4a7e9e;

    &:hover,
    &:active {
      color: #000;
      background-color: #fff;
    }
  }

  .is-balance-info {
    background-color: #2f4554;
    color: #fff;
  }

  .is-total-info {
    background-color: #609fa7;
    color: #fff;
  }

  .title {
    margin-bottom: 1em;
  }
}
</style>
