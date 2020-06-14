<template>
  <div class="auth modal-card">
    <section class="modal-card-body">
      <b-tabs v-model="currentTab">
        <b-tab-item label="Вход">
          <auth-sign-in />
        </b-tab-item>
        <b-tab-item label="Регистрация">
          <auth-sign-up />
        </b-tab-item>
        <b-tab-item label="Сбросить пароль">
          <auth-recover-password />
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

const TAB_INDEXES = ["login", "register", "recover-password"];

export default {
  name: "HomePageAuthDialog",

  components: {
    AuthSignIn: () => import("./_auth-sign-in.vue"),
    AuthSignUp: () => import("./_auth-sign-up.vue"),
    AuthRecoverPassword: () => import("./_auth-recover-password.vue")
  },

  computed: {
    ...mapState("auth", ["activeTab"]),

    currentTab: {
      get() {
        return TAB_INDEXES.indexOf(this.activeTab);
      },

      set(value) {
        this.setActiveTab(TAB_INDEXES[value]);
      }
    }
  },

  methods: {
    ...mapMutations("auth", {
      setActiveTab: "SET_ACTIVE_TAB"
    })
  }
};
</script>

<style lang="scss">
.auth {
  &.modal-card {
    width: calc(100% - 2rem);
    margin: 0 auto !important;
  }

  .modal-card-body {
    border-radius: 6px;
    padding: 0;
  }

  .b-tabs {
    .tabs {
      ul {
        background-color: #f5f5f5;
      }

      a {
        padding: 1.3rem;
        font-size: 1.2rem;
        color: #363636;
      }
    }

    .tab-content {
      padding: 2rem 3rem;
    }
  }

  &__footer {
    border-top: 1px solid #dbdbdb;
    background-color: #f5f5f5;
    padding: 2rem 3rem;
    margin: 1.5rem -3rem -2rem;
  }
}
</style>
