<template>
  <div class="notification is-primary new-version-app">
    <div class="container">
      <p class="new-version-app__content">
        <span class="new-version-app__text">{{
          $t("block-global.new-version-is-available")
        }}</span>
        <button
          class="button is-primary is-inverted is-rounded"
          @click="$emit('update')"
        >
          <span class="icon"><i class="mdi mdi-refresh"></i></span>
          <span>{{ $t("block-global.update-app") }}</span>
        </button>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.new-version-app {
  &.notification {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    margin: 0 !important;
    position: sticky;
    border-radius: 0;
    z-index: 102;
    top: 0;
  }

  &__content {
    line-height: 2.25rem;
  }

  &__text {
    margin-right: 1rem;
  }
}
</style>
