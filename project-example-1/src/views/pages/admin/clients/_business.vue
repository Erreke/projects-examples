<template>
  <div class="admin-clients__business">
    <b-loading :is-full-page="false" :active="isLoading"></b-loading>

    <div class="admin-clients__business-loading" v-if="!error && isLoading">
      <p>{{ $t('page-admin-clients.loading') }}</p>
    </div>

    <div class="admin-clients__business-error" v-if="error && !isLoading">
      <p>{{ $t('page-admin-clients.an-error-occurred') }}</p>
    </div>

    <div class="admin-clients__business-not-found" v-if="!error && !isLoading && isBusinessPlacesNotFound">
      <p>{{ $t('page-admin-clients.business-places-not-found') }}</p>
    </div>

    <div class="admin-clients__business-content" v-if="!error && !isLoading && !isBusinessPlacesNotFound">
      <span class="admin-clients__business-item">
        <span class="admin-clients__business-key">{{ $t('page-admin-clients.balance') }}</span>
        <span class="admin-clients__business-value">{{ balance | currency_format }}</span>
      </span>
      <span class="admin-clients__business-item">
        <span class="admin-clients__business-key">{{ $t('page-admin-clients.total-earned') }}</span>
        <span class="admin-clients__business-value">{{ totalEarned | currency_format }}</span>
      </span>
      <span class="admin-clients__business-item">
        <span class="admin-clients__business-key">{{ $t('page-admin-clients.referrals-count') }}</span>
        <span class="admin-clients__business-value">{{ referralsCount | number_format }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

function getPreviousOrCurrent(value, field) {
  let result;

  if (typeof value === 'number') {
    result = parseFloat(value);
  } else if (typeof value === 'object' && field in value) {
    result = parseFloat(value[field]);
  } else {
    result = 0;
  }

  return result;
}

export default {
  props: {
    uid: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
    };
  },

  computed: {
    ...mapState('admin/business-places', [
      'error',
      'items',
    ]),

    userBusinessPlaces() {
      const keys = Object.keys(this.items).filter(key => this.uid === this.items[key].uid);

      return keys.map(key => this.items[key]);
    },

    isBusinessPlacesNotFound() {
      return this.userBusinessPlaces.length === 0;
    },

    balance() {
      return this.userBusinessPlaces.reduce((prev, curr) => {
        const p = getPreviousOrCurrent(prev, 'balance');
        const c = getPreviousOrCurrent(curr, 'balance');

        return p + c;
      }, 0);
    },

    totalEarned() {
      return this.userBusinessPlaces.reduce((prev, curr) => {
        const p = getPreviousOrCurrent(prev, 'totalEarned');
        const c = getPreviousOrCurrent(curr, 'totalEarned');

        return p + c;
      }, 0);
    },

    referralsCount() {
      return this.userBusinessPlaces.reduce((prev, curr) => {
        const p = getPreviousOrCurrent(prev, 'autoReferralsTotalCount');
        const c = getPreviousOrCurrent(curr, 'autoReferralsTotalCount');

        return p + c;
      }, 0);
    },
  },

  methods: {
    ...mapActions('admin/business-places', {
      fetchBusinessPlaces: 'FETCH_BUSINESS_PLACES',
    }),
  },

  mounted() {
    this.isLoading = true;

    this.fetchBusinessPlaces()
      .then(() => {
        this.isLoading = false;
      });
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.admin-clients__business {
  position: relative;
  background-color: #517786;

  &-error {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 160px;
    background-color: red;
  }

  &-loading,
  &-not-found {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 160px;
  }

  &-content {
    display: flex;
    text-align: center;
    justify-content: space-between;
    font-size: 1.1em;
    line-height: 1.125;
  }

  @media (max-width: $desktop) {
    display: block;
  }

  &-item {
    flex: 0 0 33.3333%;
    background-color: #517786;
    color: #fff;

    @media (max-width: $desktop) {
      display: block;
    }

    &:first-child {
      background-color: #609fa7;
    }

    &:last-child {
      background-color: #2f4554;
    }
  }

  &-key {
    display: block;
    padding: 3rem 1rem 0;

    @media (max-width: $desktop) {
      padding: 1.5rem 1rem 0;
    }
  }

  &-value {
    display: block;
    padding: 1rem 1rem 3rem;
    font-size: 1.5em;
    font-weight: 600;

    @media (max-width: $desktop) {
      padding: 1rem 1rem 1.5rem;
    }
  }
}
</style>
