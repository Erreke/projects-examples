<template>
  <div class="debug-board" v-if="isActive">
    <v-alert v-model="isActive" dismissible color="rgba(0, 0, 0, 0.5)">
      MODE: {{ $mode }}
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
  z-index: 2;

  .v-alert {
    margin: 0;
  }
}
</style>
