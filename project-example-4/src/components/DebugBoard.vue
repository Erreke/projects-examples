<template>
  <div class="debug-board" v-if="isActive">
    <v-alert v-model="isActive" dismissible color="secondary">
      <ul>
        <li>Mode: {{ $mode }}</li>
        <li>Device: {{ $device }}</li>
        <li>Screen width: {{ $screenWidth }}</li>
        <li>User: {{ $user }}</li>
      </ul>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "DebugBoard",

  data() {
    return {
      isActive: process.env.NODE_ENV !== "production"
    };
  },

  methods: {
    hide() {
      this.isActive = false;
    }
  }
};
</script>

<style lang="scss">
.debug-board {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 20;

  .v-alert {
    margin: 0;
  }
}
</style>
