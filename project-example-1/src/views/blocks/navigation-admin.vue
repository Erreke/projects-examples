<template>
  <nav class="menu-admin">
    <ul>
      <li v-for="(item, key) in items" :key="key" class="menu__item">
        <span v-if="$route.name === item">
          {{ $t(`block-navigation.${item}`) }}
          <!--<span class="tag is-danger">12</span>-->
        </span>
        <router-link
          v-else
          :to="{
            name: item
          }"
          :title="$t(`block-navigation.${item}`)"
        >
          {{ $t(`block-navigation.${item}`) }}
          <!--<span class="tag is-danger">12</span>-->
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'BlockNavigationAdmin',

  computed: {
    items() {
      const navs = [
        'admin-analytics',
        'admin-clients',
        'admin-coursebot-ads',
      ];

      navs.push('admin-carousel');
      navs.push('admin-marketing-indicators');
      navs.push('admin-redirects');

      if (!this.$_user.isManager) {
        navs.push('admin-finances');
      }

      navs.push('admin-profile');

      return navs;
    },
  },
};
</script>

<style lang="scss">
  .menu-admin {
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

      span {
        color: #fff;
        background-color: #7957d5;
      }
    }

    &__item {
      position: relative;

      .tag {
        top: 5px;
        position: absolute;
        right: 5px;
      }
    }
  }
</style>
