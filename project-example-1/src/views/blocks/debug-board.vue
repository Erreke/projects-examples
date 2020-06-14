<template>
  <div :class="['debugboard', { 'is-fullwidth': isFullWidth }]" v-if="isActive">
    <button class="debugboard__button" @click.prevent="toggle">
      <b-icon pack="mdi" :icon="isFullWidth ? 'arrow-left-thick' : 'arrow-right-thick'"></b-icon>
    </button>

    <p v-if="isFullWidth">
      Mode: {{ $_mode }} |
      Width: {{ $_screenWidth }} |
      Device: {{ $_device }} |
      UID: {{ $_user && $_user.uid }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'BlockDebugBoard',

  data() {
    return {
      isFullWidth: false,
      isActive: process.env.NODE_ENV !== 'production',
    };
  },

  methods: {
    toggle() {
      this.isFullWidth = !this.isFullWidth;
    },
  },
};
</script>

<style lang="scss">
  .debugboard {
    position: fixed;
    z-index: 22000;
    bottom: 0;
    background: slategray;
    height: 50px;
    color: white;
    border-radius: 0 6px 0 0;
    display: flex;
    line-height: 50px;

    &.is-fullwidth {
      width: 100%;
      border-radius: 0;
    }

    &__button,
    &__button:focus,
    &__button:active {
      cursor: pointer;
      border: none;
      background: none;
      color: white;
      outline: none;
      padding: 0 1rem;
    }
  }
</style>
