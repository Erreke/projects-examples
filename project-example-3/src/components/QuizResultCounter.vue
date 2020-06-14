<template>
  <v-container fluid fill-height>
    <v-layout mt-5 justify-center>
      <v-flex xs12 sm10 md8>
        <h1 class="display-1 font-weight-thin mb-4">
          {{ innerTitle || title }}
        </h1>
        <v-card class="elevation-3">
          <v-card-title primary-title>
            <div class="headline">{{ $t("page-quiz.result-counting") }}</div>
          </v-card-title>
          <v-card-text>
            <v-layout align-center justify-center pb-5>
              <v-progress-circular
                :rotate="360"
                :size="150"
                :width="20"
                :value="value"
                color="primary"
              >
                {{ `${value}%` }}
              </v-progress-circular>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "QuizResultCounter",

  props: {
    title: {
      type: String,
      required: true
    },

    innerTitle: {
      type: String
    },

    answers: {
      type: Object,
      required: true
    },

    results: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      value: 0
    };
  },

  methods: {
    ...mapMutations({
      setResultWeight: "SET_RESULT_WEIGHT",
      setResultTitle: "SET_RESULT_TITLE",
      setResultText: "SET_RESULT_TEXT",
      setResultCounterShownStatus: "SET_RESULT_COUNTER_SHOWN_STATUS"
    })
  },

  mounted() {
    const timerId = setInterval(() => {
      this.value += 10;

      if (this.value >= 100) {
        clearInterval(timerId);

        setTimeout(() => {
          this.setResultCounterShownStatus(true);
        }, 1000);
      }
    }, 250);
  },

  created() {
    let quizResultTitle;
    let quizResultText;

    const weight = Object.keys(this.answers)
      .map(answerId => this.answers[answerId].weight || 0)
      .reduce((prev, next) => prev + next, 0);

    this.results.forEach(result => {
      if (weight >= result.min && weight <= result.max) {
        quizResultTitle = result.title;
        quizResultText = result.text;
      }

      if (weight === result.equal) {
        quizResultTitle = result.title;
        quizResultText = result.text;
      }
    });

    this.setResultWeight(weight);
    this.setResultTitle(quizResultTitle);
    this.setResultText(quizResultText);
  }
};
</script>
