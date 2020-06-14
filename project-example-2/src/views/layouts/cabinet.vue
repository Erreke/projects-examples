<template>
  <default-layout>
    <forbidden-area v-if="isForbidden" />

    <email-verification v-if="!isEmailVerified && !isForbidden" />

    <div
      v-if="isEmailVerified && !isForbidden"
      :class="['container layout__container', { 'is-active': isSidebarOpened }]"
    >
      <sidebar />

      <div class="layout__content">
        <div v-if="title" class="layout__header">
          <h1>{{ title }}</h1>
          <breadcrumb v-if="breadcrumbs.length" :items="breadcrumbs" />
        </div>

        <slot />
      </div>
    </div>
  </default-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CabinetLayout",

  components: {
    ForbiddenArea: () => import("./_forbidden-area.vue"),
    EmailVerification: () => import("./_email-verification.vue"),
    Sidebar: () => import("@/views/blocks/sidebar/sidebar.vue"),
    Breadcrumb: () => import("@/views/blocks/breadcrumb.vue")
  },

  metaInfo() {
    return {
      title: this.isForbidden
        ? this.$t("block-errors.err-oops-403-title")
        : this.metatitle
        ? this.metatitle
        : this.$t(`page-${this.$route.name}.meta-title`)
    };
  },

  props: {
    title: {
      type: String,
      default: ""
    },

    subtitle: {
      type: String,
      default: ""
    },

    metatitle: {
      type: String,
      default: ""
    },

    breadcrumbs: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  computed: {
    ...mapState("ui", ["isSidebarOpened"]),

    ...mapState("auth/email-verification", {
      isEmailVerifiedJustNow: state => state.isSuccess
    }),

    isEmailVerified() {
      return this.$_user && this.$_user.emailVerified;
    },

    isAdmin() {
      return this.$_user && this.$_user.isAdmin;
    },

    isForbidden() {
      return (
        (this.isAdmin && this.$route.meta.isUserArea) ||
        (!this.isAdmin && this.$route.meta.isAdminArea)
      );
    }
  },

  mounted() {
    if (this.isEmailVerifiedJustNow) {
      this.$buefy.toast.open({
        message: this.$t("block-global.email-successful-verified"),
        type: "is-success",
        duration: 5000
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.layout {
  &__container {
    display: flex;
    justify-content: stretch;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transition: all 0.3s;

    @include until($desktop) {
      &:not(.is-active) {
        width: calc(100% + 204px);
        transform: translate(-204px, 0);
      }
    }
  }

  &__content {
    background: #f1f4f9;
    width: 100%;
  }

  &__header {
    padding: 2rem;
    border-bottom: 1px solid #dee2e8;
    background: #e9edf2;

    @include until($desktop) {
      padding: 1rem;
    }

    h1 {
      color: #74767d;
      font-weight: 300;
      font-size: 2em;
    }
  }
}
</style>
