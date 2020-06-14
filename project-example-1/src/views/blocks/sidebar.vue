<template>
  <transition name="fade">
    <div :class="['sidebar', { 'is-active': isSidebarActive }]">

      <!-- <button class="button" @click.prevent="test($_user.uid)">TEST</button> -->

      <a
        :class="['navbar-burger sidebar__burger', { 'is-active': isSidebarActive }]"
        role="button"
        @click.prevent="toggleOpenState"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

      <div :class="['sidebar__content', { 'is-active': isSidebarActive }]">

        <profile-avatar />

        <div class="sidebar__profile">
          <p class="sidebar__profile-email-phone">
            <span>{{ $_user.email }}</span><br v-if="$_user.email">
            <span>{{ $_user.phone }}</span><br v-if="$_user.phone">
            <span v-if="accountType">Тип аккаунта: <em>{{ accountType }}</em></span>
          </p>
        </div>

        <p v-if="!$_user.isAdmin && refLink">{{ refLink }}</p>
        <p v-if="!$_user.isAdmin && refLink" class="sidebar__share-text">
          Поделиться рефссылкой:
        </p>

        <div class="sidebar__share" id="my-share"></div>

        <!--<langs />-->

        <navigation v-if="!$_user.isAdmin" />

        <navigation-admin v-if="$_user.isAdmin" />

        <button
          class="sidebar__signout-btn button is-danger"
          @click.prevent="handleSignOut"
        >
          {{ $t('block-global.sign-out') }}
        </button>

      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'BlockSidebar',

  components: {
    // Langs: () => import('@/views/blocks/langs.vue'),
    Navigation: () => import('@/views/blocks/navigation.vue'),
    NavigationAdmin: () => import('@/views/blocks/navigation-admin.vue'),
    ProfileAvatar: () => import('@/views/blocks/profile-avatar.vue'),
  },

  data() {
    return {
      yaShare: null,
    };
  },

  computed: {
    ...mapState('interface', [
      'isSidebarActive',
    ]),

    accountType() {
      if (this.$_user && this.$_user.isAdmin) return 'Админ';

      return null;
    },

    refLink() {
      return this.$_user && this.$_user.courseBotReferralLink;
    },
  },

  methods: {
    ...mapMutations('interface', {
      toggleSidebarActiveState: 'TOGGLE_SIDEBAR_ACTIVE_STATE',
    }),

    ...mapActions('auth', {
      signOut: 'SIGN_OUT',
      test: 'TEST',
    }),

    toggleOpenState() {
      this.toggleSidebarActiveState(!this.isSidebarActive);
    },

    handleSignOut() {
      this.signOut()
        .then(() => {
          this.$router.push({
            name: 'home',
          });
        })
        .then(() => {
          document.dispatchEvent(new CustomEvent('userSignedOut'));
        });
    },

    initYaShare() {
      if (window.Ya && this.refLink && !this.$_user.isAdmin) {
        this.yaShare = window.Ya.share2('my-share', {
          content: {
            url: this.refLink,
            title: 'КурсоБот',
            image: 'https://host.com/favicon.svg',
          },
          theme: {
            services: 'facebook,vkontakte,twitter,linkedin,telegram,whatsapp',
            lang: this.$i18n.locale,
          },
        });
      }
    },
  },

  mounted() {
    this.initYaShare();
  },

  beforeDestroy() {
    if (window.Ya && this.yaShare) {
      this.yaShare.destroy();
    }
  },

  watch: {
    refLink(value) {
      if (value) {
        this.initYaShare();
      }
    },
  },
};
</script>

<style lang="scss">
  @import "~bulma/sass/utilities/_all";

  .sidebar {
    position: relative;
    z-index: 39;
    overflow: auto;
    height: 100%;
    padding-top: 2em;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    background-color: #fafafa;
    transition: all .5s;

    @include until($desktop + 1px) {
      position: absolute;
      width: 3rem;

      &.is-active {
        @media (max-width: $desktop) {
          width: 40%;
          overflow: auto;
        }

        @media (max-width: $tablet) {
          width: 80%;
        }
      }
    }

    &__burger {
      right: 0;
      top: 0;
      position: absolute;
      z-index: 2;

      @media (max-width: $desktop) {
        display: block;
      }
    }

    &__content {
      @media (max-width: $desktop) {
        width: 0;
        overflow: hidden;

        &.is-active {
          width: auto;
          overflow: auto;

          .sidebar__signout-btn {
            display: block;
          }
        }
      }
    }

    &__profile {
      margin-bottom: 3rem;

      &-email-phone {
        font-size: 1.5em;
        line-height: .8em;
        margin-bottom: 3rem;

        span {
          font-size: .7em;
        }
      }

      &-account-type {
        font-size: 1.7em;
        line-height: .7em;

        strong {
          text-transform: uppercase;
        }
      }
    }

    &__signout-btn {
      width: 100%;
      border-radius: 0;
      display: none;
      line-height: 64px;
      padding: 0;
      border: none;
      height: 64px;
    }

    &__share {
      margin-bottom: 3rem;

      &-text {
        font-size: 0.8rem;
        margin: 0.5rem 0;
      }

      .ya-share2__container_size_m {
        .ya-share2__item {
          margin: 0 0.5rem 0 0;
        }
      }
    }
  }

  .layout_device_fullhd,
  .layout_device_widescreen,
  .layout_device_desktop {
    .sidebar__signout-btn {
      display: block;
    }
  }
</style>
