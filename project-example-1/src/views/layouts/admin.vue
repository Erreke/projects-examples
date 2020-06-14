<template>
  <div :class="classNames">
    <sidebar class="layout__sidebar" v-if="$_user && $_user.emailVerified" />

    <div class="layout__content" v-if="$_user && $_user.emailVerified">
      <h1 v-if="title" class="title">{{ title }}</h1>
      <h2 v-if="subtitle" class="subtitle">{{ subtitle }}</h2>

      <slot v-if="$_user && $_user.isAdmin" />
    </div>

    <error-splash-screen
      v-if="$_user && !$_user.isAdmin"
      :title="$t('block-errors.err-oops-403-title')"
      :subtitle="$t('block-errors.err-oops-403-subtitle')"
      route-name="dashboard"
      :link-text="$t('block-errors.err-oops-403-back-dashboard')"
    />

    <page-loader :is-active="!$_user" />

    <transition name="fade">
      <div class="darker" v-if="isSidebarActive" @click.prevent="toggleOpenState"></div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AdminLayout',

  metaInfo() {
    return {
      title: this.$_user && this.$_user.isAdmin ? this.$t(`page-${this.$route.name}.meta-title`) : this.$t('block-errors.err-oops-403-title'),
    };
  },

  props: {
    title: {
      type: String,
      default: '',
    },

    subtitle: {
      type: String,
      default: '',
    },
  },

  components: {
    Sidebar: () => import('@/views/blocks/sidebar.vue'),
    PageLoader: () => import('@/views/blocks/page-loader.vue'),
    ErrorSplashScreen: () => import('@/views/blocks/error-splash-screen.vue'),
  },

  computed: {
    ...mapState('interface', [
      'isSidebarActive',
    ]),

    classNames() {
      return ['layout', `layout_device_${this.$_device}`];
    },
  },

  methods: {
    ...mapMutations('interface', {
      toggleSidebarActiveState: 'TOGGLE_SIDEBAR_ACTIVE_STATE',
    }),

    toggleOpenState() {
      this.toggleSidebarActiveState(!this.isSidebarActive);
    },
  },
};
</script>

<style lang="scss">
@import './common.scss';

.admin {
  padding-bottom: 25px;

  &__table {
    overflow: auto;

    &-filters {
      margin-bottom: 1em;
      display: flex;

      @media (max-width: $tablet) {
        flex-flow: column;
      }

      div {
        margin-right: 1em;

        @media (max-width: $tablet) {
          margin-bottom: 0.5em;
        }
      }
    }
  }

  &__sm-table {
    border-radius: 0;
    border: none;
    background: transparent;

    th {
      width: 30%;
    }

    &-warning {
      color: red!important;
    }
  }
}

.admin__table {
  .table {
    td {
      border: none;
      padding: 0;
    }

    tr.detail {
      box-shadow: none;
    }
  }

  &-td,
  &-td-simple {
    border: 1px solid #dbdbdb;
    border-width: 0 0 1px;
    padding: 0.5em 0.75em;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.7rem;
    box-sizing: content-box;
    min-height: 30px;
  }

  &-td {
    cursor: pointer;

    .tag + .tag {
      margin-left: 0.5rem;
    }
  }

  .admin__sm-table {
    cursor: default;

    th {
      width: 35%;
      text-align: right!important;
      line-height: 1.3rem;
    }

    td {
      border: 1px solid #dbdbdb;
      border-width: 0 0 1px;
      padding: 0.5em 0.75em;
      vertical-align: top;
      line-height: 1.3rem;
    }

    &-buttons {
      th,
      td {
        font-weight: normal;
        line-height: 2.3rem;
      }
    }
  }

  &-finances {
    &-details {
      display: flex;

      .b-table .table tr.detail .detail-container {
        background-color: #568f96;
        padding: 3rem 1rem;
        max-width: 750px;
        margin: 0 auto;
      }

      &-left {
        flex: 0 0 250px;
        margin-right: 1rem;
      }

      &-balanse {
        background-color: #2f4554;
        color: #fff;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1rem;

        &-title {
          font-size: 1.3rem;
        }

        &-text {
          font-size: 3rem;
        }
      }

      &-cashback {
        background: #517786;
        color: #fff;
        padding: 1rem;
        border-radius: 5px;

        &-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }
      }

      &-right {
        flex: 1 1 auto;
        padding: 1rem 1rem 2rem;
        border-radius: 5px;
        background-color: #609fa7;
        color: #fff;

        &-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }

        .table {
          background-color: unset;
          border: none;
          border-radius: 0;
          color: unset;

          thead tr:hover {
            background-color: transparent !important;
          }

          tbody tr {
            &:hover {
              background-color: rgba(0,0,0,0.2) !important;
            }

            &.is-empty:hover {
              background-color: transparent !important;
            }

            &.detail {
              box-shadow: none;
              background: rgba(0,0,0,0.1) !important;
            }
          }

          th {
            color: unset;
          }
        }
      }
    }

    &-actions {
      margin: 2rem auto 0;
      display: flex;
      justify-content: center;
      
      button + button {
        margin-left: 1em;
      }
    }

    &-empty {
      line-height: 16em;
      text-align: center;
    }
  }

  &-actions {
    button {
      display: block;
      margin-bottom: 1em;
    }
  }

  &-empty {
    line-height: 6em;
    text-align: center;
    color: #989898;
  }

  .level {
    padding: 0.4em;
  }

  &-avatar {
    height: 128px;
    width: 128px;
    border-radius: 50%;
    background-size: cover;
    background-position: 50% 50%;
    margin: 2em 0;
    cursor: pointer;
  }
}

.admin-confirmation__table {
  th {
    text-align: right!important;
  }
}

.admin-confirmation__pseudo-tables {
  background-color: #fff;

  .pseudo-table {
    margin: 0!important;
  }
}
</style>
