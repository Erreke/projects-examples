<template>
  <div class="layout">
    <QuizStarter
      v-if="$mode === 'STARTER_MODE'"
      :title="quizTitle"
      :subtitle="quizSubtitle"
      :cover="quizStarterCover"
      :buttonCaption="quizStartButtonCaption"
      @start="startQuiz"
    />

    <QuizProcessor
      v-if="$mode === 'PROCESSOR_MODE'"
      :step="step"
      :title="quizTitle"
      :innerTitle="quizInnerTitle"
      :questions="questions"
      :currentQuestion="currentQuestion"
      :currentQuestionId="currentQuestionId"
      @back="gotoPrevQuestion"
      @next="gotoNextQuestion"
      @change="change"
    />

    <QuizResultCounter
      v-if="$mode === 'COUNTER_MODE'"
      :title="quizTitle"
      :innerTitle="quizInnerTitle"
      :answers="answers"
      :results="results"
    />

    <QuizLeadCreator
      v-if="$mode === 'FORM_MODE'"
      :title="quizTitle"
      @submitForm="submitForm"
      @openPrivacyPolicyDialog="openPrivacyPolicyDialog"
    />

    <QuizResult
      v-if="$mode === 'RESULTS_MODE'"
      :cover="quizResultCover"
      :title="resultTitle"
      :text="resultText"
      :defaultTitle="quizResultDefaultTitle"
      :buttonCaption="quizResultButtonCaption"
      :buttonUrl="quizResultButtonUrl"
      :paddingLeft="quizResultPaddingLeft"
      :paddingLeftMobile="quizResultPaddingLeftMobile"
    />

    <PrivacyPolicyDialog
      :isActive="isPrivacyPolicyDialogActive"
      @close="closePrivacyPolicyDialog"
    />

    <PageNotFound :isActive="isPageNotFound" />

    <PageLoader :isActive="!quiz && !isPageNotFound" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import QuizStarter from "@/components/QuizStarter";
import QuizProcessor from "@/components/QuizProcessor";
import QuizLeadCreator from "@/components/QuizLeadCreator";
import QuizResultCounter from "@/components/QuizResultCounter";
import QuizResult from "@/components/QuizResult";
import PrivacyPolicyDialog from "@/components/PrivacyPolicyDialog";
import PageNotFound from "@/components/PageNotFound";
import PageLoader from "@/components/PageLoader";

export default {
  name: "QuizPage",

  metaInfo() {
    return {
      title: this.pageTitle
    };
  },

  components: {
    QuizStarter,
    QuizProcessor,
    QuizLeadCreator,
    QuizResultCounter,
    QuizResult,
    PrivacyPolicyDialog,
    PageNotFound,
    PageLoader
  },

  data() {
    return {
      pageTitle: this.$t("page-quiz.loading"),
      isPageNotFound: false
    };
  },

  computed: {
    ...mapState([
      "quiz",
      "step",
      "questions",
      "answers",
      "results",
      "resultText",
      "resultTitle",
      "currentQuestionId",
      "isPrivacyPolicyDialogActive"
    ]),

    currentQuestion() {
      return this.questions[this.currentQuestionId];
    },

    quizId() {
      return this.$route.params.quizId;
    },

    quizTitle() {
      return this.quiz && this.quiz.title;
    },

    quizInnerTitle() {
      return this.quiz && this.quiz.innerTitle;
    },

    quizSubtitle() {
      return this.quiz && this.quiz.subtitle;
    },

    quizStarterCover() {
      return this.quiz && this.quiz.startCover;
    },

    quizStartButtonCaption() {
      return this.quiz && this.quiz.startButtonCaption;
    },

    quizResultCover() {
      return this.quiz && this.quiz.resultCover;
    },

    quizResultDefaultTitle() {
      return this.quiz && this.quiz.resultTitle;
    },

    quizResultButtonCaption() {
      return this.quiz && this.quiz.resultButtonCaption;
    },

    quizResultButtonUrl() {
      return this.quiz && this.quiz.resultButtonUrl;
    },

    quizResultPaddingLeft() {
      return this.quiz && this.quiz.resultPaddingLeft;
    },

    quizResultPaddingLeftMobile() {
      return this.quiz && this.quiz.resultPaddingLeftMobile;
    }
  },

  methods: {
    ...mapActions({
      fetchQuiz: "FETCH_QUIZ",
      fetchQuestions: "FETCH_QUESTIONS",
      fetchResults: "FETCH_RESULTS",
      sendAnswers: "SEND_ANSWERS"
    }),

    ...mapMutations({
      startQuiz: "START_QUIZ",
      gotoNextQuestion: "GOTO_NEXT_QUESTION",
      gotoPrevQuestion: "GOTO_PREV_QUESTION",
      selectAnswer: "SELECT_ANSWER",
      openPrivacyPolicyDialog: "OPEN_DIALOG",
      closePrivacyPolicyDialog: "CLOSE_DIALOG"
    }),

    change(value) {
      this.selectAnswer(value);

      if (value.isAutoTransition) {
        setTimeout(() => {
          this.gotoNextQuestion();
        }, 500);
      }
    },

    submitForm(value) {
      this.sendAnswers({
        ...value,
        amoPipelineId: this.quiz.amoPipelineId,
        quizId: this.$route.params.quizId
      });
    }
  },

  created() {
    this.fetchQuiz(this.quizId).then(quiz => {
      if (quiz) {
        this.pageTitle = this.quizTitle;
        this.fetchQuestions(this.quizId);
        this.fetchResults(this.quizId);
      } else {
        this.pageTitle = this.$t("page-quiz.not-found");
        this.isPageNotFound = true;
      }
    });
  }
};
</script>

<style lang="scss">
.layout {
  height: 100%;
}
</style>
