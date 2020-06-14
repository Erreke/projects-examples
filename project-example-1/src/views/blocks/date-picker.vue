<template>
  <b-datepicker
    ref="datepicker"
    :placeholder="placeholder"
    icon="calendar-today"
    v-model.trim="model"
    :years-range="yearsRange"
    :max-date="maxDate"
    :min-date="minDate"
    :focused-date="focusedDate"
    :month-names="monthNames"
    :day-names="dayNames"
    :first-day-of-week="1"
    :indicators="indicators"
    :events="events"
    :inline="inline"
    :nearby-selectable-month-days="true"
    :disabled="disabled"
    @input="$emit('changed')"
  >
  </b-datepicker>
</template>

<script>
export default {
  props: {
    value: {
      validator: prop => typeof prop === 'object' || prop === null || prop === undefined,
      required: true,
    },

    placeholder: {
      type: String,
    },

    maxDate: {
      type: Date,
    },

    minDate: {
      type: Date,
    },

    focusedDate: {
      type: Date,
    },

    indicators: {
      type: String,
    },

    events: {
      type: Array,
    },

    yearsRange: {
      type: Array,
    },

    inline: {
      type: Boolean,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    monthNames() {
      return [
        this.$t('block-global.calendar.january'),
        this.$t('block-global.calendar.february'),
        this.$t('block-global.calendar.march'),
        this.$t('block-global.calendar.april'),
        this.$t('block-global.calendar.may'),
        this.$t('block-global.calendar.june'),
        this.$t('block-global.calendar.july'),
        this.$t('block-global.calendar.august'),
        this.$t('block-global.calendar.september'),
        this.$t('block-global.calendar.october'),
        this.$t('block-global.calendar.november'),
        this.$t('block-global.calendar.december'),
      ];
    },

    dayNames() {
      return [
        this.$t('block-global.calendar.su'),
        this.$t('block-global.calendar.m'),
        this.$t('block-global.calendar.tu'),
        this.$t('block-global.calendar.w'),
        this.$t('block-global.calendar.th'),
        this.$t('block-global.calendar.f'),
        this.$t('block-global.calendar.s'),
      ];
    },

    model: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
