<template>
  <v-radio-group v-model="selected" class="quiz__radio">
    <v-radio
      v-for="(item, key) in question.answers"
      :key="`${question.id}-${key}`"
      :label="item.value"
      :value="item.id"
      color="primary"
    >
      <template v-slot:label v-if="item.value === 'custom'">
        <v-text-field
          :placeholder="$t('page-quiz.other-placeholder')"
          :disabled="isCustomInputDisabled"
          v-model="customValue"
        ></v-text-field>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script>
export default {
  name: "QuizContentRadio",

  props: {
    question: {
      type: Object,
      required: true
    }
  },

  computed: {
    selected: {
      get() {
        return this.question.selected.id;
      },
      set(value) {
        this.$emit("change", {
          aid: value,
          qid: this.question.id,
          type: this.question.type,
          chain: this.question.chain,
          isAutoTransition: this.question.answers[value].value !== "custom",
          customValue: this.customValue
        });
      }
    },

    customValue: {
      get() {
        return this.question.selected && this.question.selected.customValue;
      },
      set(value) {
        this.$emit("change", {
          aid: this.selected,
          qid: this.question.id,
          type: this.question.type,
          chain: this.question.chain,
          isAutoTransition: false,
          customValue: value
        });
      }
    },

    isCustomInputDisabled() {
      return !(this.question.selected.value === "custom");
    }
  }
};
</script>

<style lang="scss">
.quiz__radio {
  .v-text-field__details {
    display: none;
  }

  .v-radio {
    min-height: 2em;
    margin-bottom: 1em !important;
  }

  .v-input {
    margin: 0;
    padding: 0;

    &__slot {
      margin: 0;
    }
  }
}
</style>
