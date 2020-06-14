<template>
  <nav class="menu">
    <ul>
      <template v-for="(item, key) in items">
        <li v-if="item !== null" :key="key">
          <span
            class="is-active"
            v-if="$route.name === item"
          >
            {{ $t(`block-navigation.${item}`) }}
          </span>

          <router-link
            v-else
            :class="{ 'is-child-active': isChildActive(item) }"
            :to="{
              name: item
            }"
          >
            {{ $t(`block-navigation.${item}`) }}
          </router-link>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'BlockNavigation',

  computed: {
    items() {
      return [
        'dashboard',
        this.$_user.createdAt.seconds < 1588164820 ? 'finances' : null,
        'tariffs',
        'profile',
      ];
    },
  },

  methods: {
    isChildActive(item) {
      return this.$route.path.includes(item);
    },
  },
};
</script>

<style lang="scss">
  .menu {
    li {
      line-height: 4em;

      & > * {
        display: block;
      }

      a {
        display: block;

        &:hover {
          color: #fff;
          background-color: #6943d0;
        }
      }

      .is-active,
      .is-child-active {
        color: #fff;
        background-color: #9570f9;
      }
    }
  }
</style>
