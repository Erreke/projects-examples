import modeDetector from "@/utils/modeDetector";

export default {
  computed: {
    $user() {
      return this.$store.state.user;
    },

    $mode() {
      return modeDetector(this.$store.state);
    },

    $screenWidth() {
      if (this.$root === this) {
        return this.screenWidth;
      }

      return this.$root.screenWidth;
    },

    $device() {
      if (this.$root === this) {
        return this.device;
      }

      return this.$root.device;
    }
  }
};
