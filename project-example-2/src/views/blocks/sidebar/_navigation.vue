<template>
  <b-menu :class="{ 'is-sidebar-opened': isSidebarOpened }">
    <b-menu-list>
      <b-menu-item
        v-for="(item, key) in items"
        :key="key"
        tag="router-link"
        :icon="item.icon"
        :label="$t(`block-navigation.${item.alias}`)"
        :active="isChildActive(item.alias)"
        :to="{
          name: item.alias
        }"
      />
    </b-menu-list>
  </b-menu>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BlockSidebarNavigation",

  computed: {
    ...mapState("ui", ["isSidebarOpened"]),

    items() {
      return this.$_user.isAdmin
        ? [
            { alias: "admin-courses", icon: "book-open-page-variant" },
            { alias: "admin-clients", icon: "account-group" },
            { alias: "admin-business-places", icon: "sitemap" },
            { alias: "admin-finances", icon: "cash-usd" },
            { alias: "admin-profile", icon: "card-account-details" }
          ]
        : [
            { alias: "courses", icon: "book-open-page-variant" },
            { alias: "profile", icon: "card-account-details" },
            { alias: "finances", icon: "cash-usd" }
          ];
    }
  },

  methods: {
    isChildActive(item) {
      return this.$route.path.includes(item);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.menu {
  margin-bottom: 10rem;

  @include until($desktop) {
    &:not(.is-sidebar-opened) {
      width: 46px;
      float: right;

      .menu-list a {
        padding: 1.25rem 0;
      }

      span:last-child {
        display: none;
      }
    }
  }

  &-list {
    a {
      color: #fff;
      border-radius: 0;
      padding: 1.25rem;
      position: relative;

      &:hover,
      &.is-active {
        background-color: #2b384e;
        color: #899dc1;
      }

      .icon {
        height: auto;
        width: auto;

        .mdi::before {
          font-size: 24px;
        }

        &.is-up-down {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translate(0, -50%);
        }
      }
    }

    span {
      display: block;
      margin: 0 auto;
    }

    li ul {
      margin: 0;
      border-left: 2px solid #899dc1;
      padding: 0;

      a {
        padding: 1rem;
      }
    }
  }
}
</style>
