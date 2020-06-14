<template>
  <v-layout row align-center>
    <v-flex style="flex-basis: 80px; flex-grow: 0; text-align: center;">
      {{ question.min }}
    </v-flex>

    <v-flex>
      <v-slider
        v-if="question.type === 'slider'"
        v-model="selected"
        thumb-label="always"
        thumb-size="50"
        height="100"
        :always-dirty="true"
        :step="question.step"
        :min="question.min"
        :max="question.max"
      >
      </v-slider>

      <v-range-slider
        v-if="question.type === 'range'"
        v-model="selected"
        thumb-label="always"
        thumb-size="50"
        height="100"
        :always-dirty="true"
        :step="question.step"
        :min="question.min"
        :max="question.max"
      >
      </v-range-slider>
    </v-flex>

    <v-flex style="flex-basis: 80px; flex-grow: 0; text-align: center;">
      {{ question.max }}
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "QuizContentSlider",

  props: {
    question: {
      type: Object,
      required: true
    }
  },

  computed: {
    selected: {
      get() {
        if (this.question.type === "slider") {
          return (
            this.question.selected ||
            Math.floor((this.question.max + this.question.min) / 2)
          );
        }

        if (this.question.type === "range") {
          // TODO: Realize range
          return this.question.selected || [25, 75];
        }

        return null;
      },
      set(value) {
        this.$emit("change", {
          qid: this.question.id,
          type: this.question.type,
          chain: this.question.chain,
          isAutoTransition: false,
          value: value
        });
      }
    }
  }
};
</script>
