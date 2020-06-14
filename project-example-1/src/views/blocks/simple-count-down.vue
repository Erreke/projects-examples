<template>
  <span>{{ countdown }}</span>
</template>

<script>
const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

export default {
  props: {
    isTimeToStart: {
      type: Boolean,
      default: false,
    },

    isLong: {
      type: Boolean,
      default: false,
    },

    isAutoStart: {
      type: Boolean,
      default: false,
    },

    interval: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      timer: null,
      countdown: this.getCountDown(this.interval),
      leftSeconds: this.interval,
    };
  },

  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.timer = null;
      this.countdown = this.getCountDown(this.interval);
      this.leftSeconds = this.interval;
    },

    padByZero(val) {
      const valString = `${val}`;

      if (valString.length < 2) {
        return `0${valString}`;
      }

      return valString;
    },

    getCountDown(left) {
      if (this.interval < 0) return this.$t('block-global.deadline-expired');

      const leftDays = parseInt(left / secondsInDay, 10);
      const leftHours = parseInt((left - (secondsInDay * leftDays)) / secondsInHour, 10);
      const leftMinutes = parseInt(
        (left - (secondsInDay * leftDays) - (secondsInHour * leftHours)) / secondsInMinute,
        10,
      );
      const leftSeconds = parseInt(left % 60, 10);

      const days = this.padByZero(leftDays);
      const hours = this.padByZero(leftHours);
      const minutes = this.padByZero(leftMinutes);
      const seconds = this.padByZero(leftSeconds);

      if (this.isLong) {
        return `${days}:${hours}:${minutes}:${seconds}`;
      }

      return `${hours}:${minutes}:${seconds}`;
    },

    start() {
      this.$emit('start');

      if (this.interval < 0) {
        this.clearTimer();
        this.$emit('done');

        return;
      }

      this.clearTimer();

      const countdown = () => {
        this.leftSeconds -= 1;
        this.countdown = this.getCountDown(this.leftSeconds);

        if (this.leftSeconds < 1 && this.timer) {
          this.clearTimer();
          this.$emit('done');
        }
      };

      this.timer = setInterval(countdown, 1000);
    },
  },

  watch: {
    isTimeToStart(value) {
      if (value) {
        this.start();
      }
    },
  },

  mounted() {
    if (this.isAutoStart) {
      this.start();
    }
  },

  destroyed() {
    this.clearTimer();
  },
};
</script>
