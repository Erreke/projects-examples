<template>
  <v-container fluid fill-height>
    <v-layout mt-5 justify-center>
      <v-flex xs12 sm10 md8>
        <h1 class="processor__title font-weight-thin mb-4">
          {{ innerTitle || title }}
        </h1>

        <v-card class="elevation-3">
          <div v-for="(question, key) in questions" :key="key">
            <div v-if="question.id === currentQuestionId">
              <v-card-title primary-title>
                <div class="processor__subtitle">{{ question.title }}</div>
              </v-card-title>

              <v-card-text>
                <QuizContentRadio
                  v-if="question.type === 'radio'"
                  :question="question"
                  @change="change"
                />

                <QuizContentSlider
                  v-if="question.type === 'slider' || question.type === 'range'"
                  :question="question"
                  @change="change"
                />
              </v-card-text>
            </div>
          </div>

          <v-card-actions>
            <v-layout>
              <v-flex>
                <v-btn
                  round
                  flat
                  :large="$device !== 'mobile'"
                  :disabled="isBackDisabled"
                  @click.prevent="back"
                >
                  <v-icon light class="mr-1">mdi-arrow-left</v-icon>
                  {{ $t("page-quiz.back") }}
                </v-btn>
              </v-flex>

              <v-flex>
                <v-btn
                  round
                  color="primary"
                  :large="$device !== 'mobile'"
                  :disabled="isNextDisabled"
                  @click.prevent="next"
                >
                  <v-icon light class="mr-1">mdi-check-circle-outline</v-icon>
                  {{ nextButtonText }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>

          <v-progress-linear v-model="progress"></v-progress-linear>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import QuizContentRadio from "@/components/QuizContentRadio";
import QuizContentSlider from "@/components/QuizContentSlider";

export default {
  name: "QuizProcessor",

  components: {
    QuizContentRadio,
    QuizContentSlider
  },

  props: {
    step: {
      type: Number,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    innerTitle: {
      type: String
    },

    questions: {
      type: Object,
      required: true
    },

    currentQuestion: {
      type: Object,
      required: true
    },

    currentQuestionId: {
      type: [String, null],
      required: true
    }
  },

  computed: {
    questionsLength() {
      return Object.keys(this.questions).length;
    },

    progress() {
      return Math.round(100 / (this.questionsLength / this.step));
    },

    isBackDisabled() {
      return !this.currentQuestion.prev;
    },

    isNextDisabled() {
      if (this.currentQuestion && this.currentQuestion.type === "radio") {
        const selectedValue = this.currentQuestion.selected.value;
        const customValue = this.currentQuestion.selected.customValue;

        return (
          selectedValue === null ||
          (selectedValue === "custom" && customValue === null)
        );
      }

      if (
        this.currentQuestion &&
        (this.currentQuestion.type === "slider" ||
          this.currentQuestion.type === "range")
      ) {
        return !this.currentQuestion.selected;
      }

      return false;
    },

    nextButtonText() {
      if (
        this.currentQuestion &&
        !this.currentQuestion.next &&
        this.$device !== "mobile"
      ) {
        return this.$t("page-quiz.last-step");
      }

      return this.$t("page-quiz.next");
    }
  },

  methods: {
    back() {
      this.$emit("back");
    },

    next() {
      this.$emit("next");
    },

    change(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style lang="scss">
.processor {
  &__title {
    font-size: 34px !important;
    line-height: 40px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;

    @media only screen and (max-width: 600px) {
      font-size: 25px !important;
      line-height: 32px !important;
    }
  }

  &__subtitle {
    font-size: 25px !important;
    line-height: 32px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;

    @media only screen and (max-width: 600px) {
      font-size: 16px !important;
      line-height: 24px !important;
    }
  }
}
</style>
