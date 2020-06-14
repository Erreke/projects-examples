<template>
  <div class="-alert" v-if="isActive">
    <div class="notification is-danger">
      <button class="delete" @click.prevent="close"></button>
      <p>
        <span class="-alert__profile-text">{{ $t('block-global.fill-all-data-in-profile') }}</span>
        <router-link
          v-if="$route.name !== 'profile'"
          class="button is-danger is-inverted is-outlined is-rounded -alert__profile-btn"
          :to="{ name: 'profile' }"
        >{{ $t('block-global.to-fill') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockProfileFillAlert',

  data() {
    return {
      isClosed: false,
    };
  },

  computed: {
    isActive() {
      if (this.$_user.isAdmin) return false;

      return !(this.$_user.firstName
        && this.$_user.secondName
        && this.$_user.nickname
        && this.$_user.phone
        && this.$_user.gender
        && this.$_user.city
        && this.$_user.country
        && this.$_user.birthday)
        && !this.isClosed;
    },
  },

  methods: {
    close() {
      this.isClosed = true;
    },
  },
};
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/initial-variables.sass';

  .-alert {
    margin-bottom: 2rem;

    &__profile-text {
      line-height: 2rem;

      @media (max-width: $tablet) {
        display: block;
        line-height: initial;
      }
    }

    &__profile-btn {
      margin-left: 1rem;

      @media (max-width: $tablet) {
        margin-top: 1rem;
        margin-left: 0;
      }
    }
  }
</style>
