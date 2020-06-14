import { HOST, PAYMENT_URL } from "@/config";

export default {
  computed: {
    $_screenWidth() {
      if (this.$root === this) {
        return this.screenWidth;
      }

      return this.$root.screenWidth;
    },

    $_device() {
      if (this.$root === this) {
        return this.device;
      }

      return this.$root.device;
    },

    $_user() {
      return this.$store.state.user.profile;
    },

    $_host() {
      return HOST;
    },

    $_paymentUrl() {
      return PAYMENT_URL;
    }
  }
};
