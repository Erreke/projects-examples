<template>
  <div class="enroll-to-webinar__countdown" v-if="isActive">
    <div class="enroll-to-webinar__countdown-element">
      <p class="enroll-to-webinar__countdown-element-value">{{ elements.hours }}</p>
      <p class="enroll-to-webinar__countdown-element-caption">Часы</p>
    </div>

    <div class="enroll-to-webinar__countdown-element">
      <p class="enroll-to-webinar__countdown-element-value">{{ elements.minutes }}</p>
      <p class="enroll-to-webinar__countdown-element-caption">Минуты</p>
    </div>

    <div class="enroll-to-webinar__countdown-element">
      <p class="enroll-to-webinar__countdown-element-value">{{ elements.seconds }}</p>
      <p class="enroll-to-webinar__countdown-element-caption">Секунды</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnrollToWebinarPageCountdown',

  props: {
    elements: {
      type: Object,
      required: true,
    },

    isActive: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.enroll-to-webinar__countdown {
  display: flex;
  text-align: center;
  justify-content: center;

  &-element {
    width: 98px;

     &-value {
      color: #0000ff;
      font-size: 4rem;
      font-weight: bold;
      position: relative;
    }

    &:not(:last-child) {
      .enroll-to-webinar__countdown-element-value::after {
        position: absolute;
        content: ':';
      }
    }

    &-caption {
      font-size: 0.8rem;
    }
  }
}
</style>
