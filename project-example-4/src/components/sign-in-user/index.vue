<template>
  <div class="sign-in-user is-active">
    <div class="sign-in-user__info">
      <h1 class="display-1 font-weight-light mb-4">{{ title }}</h1>
    </div>

    <v-container fluid>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 text-xs-center>
          <v-card class="elevation-12">
            <sms-first-step />
            <sms-second-step />

            <email-first-step />
            <email-second-step />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="sign-in-user__info">
      <p>{{ $t("block-signin.beginning", { time: streamStartTime }) }}</p>
      <p>{{ $t("block-signin.remain-to-start", { time: remainingTime }) }}</p>
      <p>{{ $t("block-signin.duration", { duration: duration }) }}</p>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import smsFirstStep from "./_sms-first-step";
import smsSecondStep from "./_sms-second-step";
import emailFirstStep from "./_email-first-step";
import emailSecondStep from "./_email-second-step";

export default {
  components: {
    "sms-first-step": smsFirstStep,
    "sms-second-step": smsSecondStep,
    "email-first-step": emailFirstStep,
    "email-second-step": emailSecondStep
  },

  props: {
    title: {
      type: String,
      required: true
    },
    start: {
      type: Object,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      now: Date.now()
    };
  },

  computed: {
    streamStartTime() {
      return this.$options.filters.DATETIME_FULL(this.start.seconds);
    },

    remainingTime() {
      const start = DateTime.fromSeconds(this.start.seconds);
      const end = DateTime.fromMillis(this.now);
      const remaining = start.diff(end, ["hours", "minutes", "seconds"]);

      let hh = Math.ceil(remaining.hours);
      let mm = Math.ceil(remaining.minutes);
      let ss = Math.ceil(remaining.seconds);

      hh = hh < 0 ? 0 : hh;
      mm = mm < 0 ? 0 : mm;
      ss = ss < 0 ? 0 : ss;

      hh = hh < 10 ? `0${hh}` : hh;
      mm = mm < 10 ? `0${mm}` : mm;
      ss = ss < 10 ? `0${ss}` : ss;

      return `${hh}:${mm}:${ss}`;
    }
  },

  methods: {
    initTimer() {
      const interval = setInterval(() => {
        this.now = Date.now();

        const start = DateTime.fromSeconds(this.start.seconds);
        const end = DateTime.fromMillis(this.now);

        const remainInSeconds = Math.ceil(
          start.diff(end).toObject().milliseconds / 1000
        );

        if (remainInSeconds <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
  },

  mounted() {
    this.initTimer();
  }
};
</script>

<style lang="scss">
.sign-in-user {
  &__info {
    text-align: center;
    color: #fff;
    padding-top: 10em;

    @media only screen and (min-width: 961px) and (max-width: 1264px) {
      padding-top: 6em;
    }

    @media only screen and (min-width: 601px) and (max-width: 960px) {
      padding-top: 4em;
    }

    @media only screen and (max-width: 600px) {
      padding-top: 2em;
    }
  }

  &__icon-email i {
    font-size: 4em;
  }

  .v-alert {
    margin-bottom: 2em;
  }
}
</style>
