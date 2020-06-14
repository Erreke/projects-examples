<template>
  <div id="app">
    <new-version-notification
      v-if="isNewVersionAvailable"
      @update="updateApp"
    />

    <router-view :key="$route.fullPath" />

    <transition name="darker">
      <div
        v-if="isSidebarOpened || isMobileNavbarOpened"
        class="darker"
        @click="closeSidebarAndNavbar"
      ></div>
    </transition>

    <debug-board />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",

  metaInfo() {
    return {
      title: "Coursomania",
      titleTemplate: "Coursomania :: %s",
      htmlAttrs: {
        lang: this.$i18n.locale
      },
      script: [
        {
          src: "//code-ya.jivosite.com/widget/ftfSmJJJoj",
          async: true
        }
      ]
    };
  },

  data() {
    return {
      SWRegistration: null,
      isReloadingProcess: false,
      isNewVersionAvailable: false
    };
  },

  components: {
    DebugBoard: () => import("@/views/blocks/debug-board.vue"),
    NewVersionNotification: () =>
      import("@/views/blocks/new-version-notification.vue")
  },

  computed: {
    ...mapState("ui", ["isSidebarOpened", "isMobileNavbarOpened"])
  },

  methods: {
    ...mapMutations("ui", {
      closeSidebar: "CLOSE_SIDEBAR",
      closeMobileNavbar: "CLOSE_MOBILE_NAVBAR"
    }),

    showUpdateNotification(e) {
      this.SWRegistration = e.detail;
      this.isNewVersionAvailable = true;
    },

    updateApp() {
      this.isNewVersionAvailable = false;

      if (!this.SWRegistration || !this.SWRegistration.waiting) return;

      this.SWRegistration.waiting.postMessage("skipWaiting");
    },

    closeSidebarAndNavbar() {
      this.closeSidebar();
      this.closeMobileNavbar();
    }
  },

  created() {
    document.addEventListener("swUpdated", this.showUpdateNotification, {
      once: true
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.isReloadingProcess) return;

      this.isReloadingProcess = true;

      window.location.reload();
    });
  },

  watch: {
    $_user(value) {
      if (
        value &&
        value.firstName &&
        value.secondName &&
        value.email &&
        value.phone &&
        window.jivo_api
      ) {
        window.jivo_api.setContactInfo({
          name: `${value.firstName} ${value.secondName}`,
          email: value.email,
          phone: value.phone,
          description: "Клиент"
        });
      }
    }
  }
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}

.darker {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(10, 10, 10, 0.86);
  z-index: 38;

  &-enter-active,
  &-leave-active {
    transition: all 0.5s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

.inline-modal {
  position: relative;

  &.notification {
    padding: 0;
  }

  &__content {
    text-align: center;
  }

  &__loading {
    position: relative;
    margin: 3rem 0 1rem;
    color: #209cee;

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      border-radius: 100%;
      content: "";
      z-index: 9999;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      box-sizing: border-box;
      border: 0 solid #fff;
      animation: loader-figure 1.15s infinite
        cubic-bezier(0.215, 0.61, 0.355, 1);
    }
  }

  &__icon {
    margin: 3rem 0 1rem;
  }

  &__text {
    margin: 0 0 3rem;
    list-style: none;
  }
}
</style>
