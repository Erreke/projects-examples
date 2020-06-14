<template>
  <div class="sidebar-profile">
    <p
      class="sidebar-profile__avatar"
      v-if="$_user.avatar"
      :style="`background-image: url(${$_user.avatar});`"
    ></p>

    <p class="sidebar-profile__avatar-empty" v-else>
      <i class="mdi mdi-account-tie"></i>
    </p>

    <div class="sidebar-profile__content">
      <p>
        <strong>{{ fullName }}</strong>
      </p>
      <p>{{ $_user.email }}</p>
      <p>{{ $_user.phone }}</p>
    </div>

    <div
      class="sidebar-profile__content"
      v-if="$_user.isAdmin && $_user.isAuthor"
    >
      <p>
        Тип аккаунта: <em>{{ clientType }}</em>
      </p>
    </div>

    <hr class="sidebar-profile__separator" />
  </div>
</template>

<script>
export default {
  name: "BlockSidebarProfile",

  computed: {
    fullName() {
      if (this.$_user) {
        if (this.$_user.firstName && this.$_user.secondName) {
          return `${this.$_user.firstName} ${this.$_user.secondName}`;
        } else if (this.$_user.firstName && !this.$_user.secondName) {
          return this.$_user.firstName;
        } else if (!this.$_user.firstName && this.$_user.secondName) {
          return this.$_user.secondName;
        }
      }

      return "";
    },

    clientType() {
      return this.$_user.isAdmin
        ? "Админ"
        : this.$_user.isAuthor
        ? "Автор"
        : "Клиент";
    }
  }
};
</script>

<style lang="scss">
.sidebar-profile {
  padding: 2rem 0 0;

  &__separator {
    background-color: #445471;
    height: 1px;
    margin: 3rem;
  }

  &__avatar,
  &__avatar-empty {
    width: 150px;
    height: 150px;
    background-position: center center;
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
  }

  &__avatar-empty {
    font-size: 12rem;
    line-height: 16rem;
    background-color: #2b394e;
    color: #899dc1;
    text-align: center;
  }

  &__content {
    margin: 1rem 0 2rem;

    * {
      color: #fff;
    }
  }
}
</style>
