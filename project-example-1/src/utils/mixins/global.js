import modeDetector from '@/utils/mode-detector';
import { HOST, PAYMENT_URL } from '@/config';

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

    $_curator() {
      return this.$store.state.user.curator;
    },

    $_interfaceSize() {
      if (this.$_device === 'fullhd' || this.$_device === 'widescreen') {
        // return 'is-medium';
      }

      return null;
    },

    $_mode() {
      return modeDetector(this.$_user);
    },

    $_host() {
      return HOST;
    },

    $_paymentUrl() {
      // if (process.env.NODE_ENV === 'production') {
      //   if (this.$store.state.user.profile.createdAt) {
      //     const createdAt = this.$store.state.user.profile.createdAt.seconds;
      //     const now = Date.now() / 1000;
      //     const sinceRegister = Math.floor((now - createdAt) / 60 / 60);

      //     return sinceRegister > 72 ? PROD_PAYMENT_500_URL : PROD_PAYMENT_300_URL;
      //   }
      // }

      return PAYMENT_URL;
    },
  },
};
