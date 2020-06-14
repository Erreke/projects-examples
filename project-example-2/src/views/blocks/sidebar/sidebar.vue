<template>
  <div class="sidebar">
    <button
      :class="['sidebar__toggler', { 'is-active': isSidebarOpened }]"
      @click.prevent="toggle"
      v-if="$_device === 'mobile' || $_device === 'tablet'"
    >
      <b-icon pack="mdi" icon="arrow-right-thick"></b-icon>
    </button>

    <transition name="sidebar">
      <sidebar-profile v-if="isProfileActive" />
    </transition>

    <sidebar-navigation />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "BlockSidebar",

  components: {
    SidebarProfile: () => import("./_profile.vue"),
    SidebarNavigation: () => import("./_navigation.vue")
  },

  computed: {
    ...mapState("ui", ["isSidebarOpened"]),

    isProfileActive() {
      // return false;

      if (this.$_device === "mobile" || this.$_device === "tablet") {
        return this.isSidebarOpened;
      }

      return true;
    }
  },

  methods: {
    ...mapMutations("ui", {
      toggle: "TOGGLE_SIDEBAR"
    })
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.sidebar {
  flex: 0 0 250px;
  text-align: center;
  background-color: $sidebar;

  @include until($desktop) {
    padding: 4rem 0 0;
    position: relative;
    z-index: 39;
    min-height: 100%;
  }

  &__toggler {
    position: absolute;
    right: 0;
    top: 0;
    border: 0;
    color: #fff;
    padding: 0.7rem;
    background-color: #2b394e;

    &:focus,
    &:active {
      outline: 0;
      background-color: #242f3e;
    }

    &.is-active {
      border-bottom-left-radius: 5px;

      .icon i {
        transform: rotate(180deg);
      }
    }

    .icon i {
      transform: rotate(0deg);
      transition: all 0.3s;
    }
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.5s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transition: all 0.5s;
  }
}
</style>
