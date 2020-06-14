<template>
  <div class="avatar">
    <p
      class="avatar__img"
      v-if="$_user.avatar"
      :style="`background-image: url(${$_user.avatar});`"
    ></p>

    <p class="avatar__empty" v-else>
      <i class="fas fa-user-tie"></i>
    </p>
  </div>
</template>

<script>
export default {
  name: 'BlockProfileAvatar',
};
</script>

<style lang="scss">
.avatar {
  margin-bottom: 2em;

  &__img,
  &__empty {
    width: 200px;
    height: 200px;
    background-position: center center;
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
  }

  &__empty {
    font-size: 11rem;
    line-height: 17rem;
    background-color: #eaeaea;
    color: #989898;
  }
}
</style>
