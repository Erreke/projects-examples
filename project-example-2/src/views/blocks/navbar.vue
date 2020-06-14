<template>
  <nav class="navbar is-spaced">
    <div class="container">
      <div class="navbar-brand">
        <router-link class="navbar-item" :to="{ name: 'home' }">
          <strong>Coursomania</strong>
        </router-link>

        <a
          role="button"
          :class="[
            'navbar-burger burger',
            { 'is-active': isMobileNavbarOpened }
          ]"
          @click.prevent="toggleMobileNavbar"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div :class="['navbar-menu', { 'is-active': isMobileNavbarOpened }]">
        <div class="navbar-start">
          <a class="navbar-item">
            Home
          </a>

          <a class="navbar-item">
            Documentation
          </a>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field has-addons" v-if="!$_user">
              <p class="control">
                <b-button
                  type="is-primary"
                  icon-left="login"
                  @click.prevent="showLoginPopup"
                >
                  {{ $t("block-header.login") }}
                </b-button>
              </p>
              <p class="control">
                <b-button
                  icon-left="account-plus"
                  @click.prevent="showRegistrationPopup"
                >
                  {{ $t("block-header.registration") }}
                </b-button>
              </p>
            </div>

            <b-button
              v-else-if="$route.name === 'home'"
              type="is-primary"
              icon-left="login"
              @click.prevent="goToCabinet"
            >
              {{ $t("block-header.go-to-cabinet") }}
            </b-button>

            <b-button
              v-else
              type="is-danger"
              icon-left="logout"
              @click.prevent="handleSignOut"
            >
              {{ $t("block-header.logout") }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "BlockNavbar",

  computed: {
    ...mapState("ui", ["isMobileNavbarOpened"])
  },

  methods: {
    ...mapActions("auth", {
      signOut: "SIGN_OUT"
    }),

    ...mapMutations("auth", {
      setActiveTab: "SET_ACTIVE_TAB",
      setAuthPopupOpenedStatus: "SET_POPUP_OPENED_STATUS"
    }),

    ...mapMutations("ui", {
      toggleMobileNavbar: "TOGGLE_MOBILE_NAVBAR"
    }),

    showLoginPopup() {
      this.setActiveTab("login");
      this.setAuthPopupOpenedStatus(true);
    },

    showRegistrationPopup() {
      this.setActiveTab("register");
      this.setAuthPopupOpenedStatus(true);
    },

    goToCabinet() {
      if (this.$_user.isAdmin) {
        this.$router.push({ name: "admin" });
      } else {
        this.$router.push({ name: "courses" });
      }
    },

    handleSignOut() {
      this.signOut()
        .then(() => {
          this.$router.push({
            name: "home"
          });
        })
        .then(() => {
          document.dispatchEvent(new CustomEvent("userSignedOut"));
        });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.navbar {
  z-index: 40;
  flex: 0 0 84px;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  @include until($desktop) {
    flex: 0 0 52px;
  }
}
</style>
