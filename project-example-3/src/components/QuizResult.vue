<template>
  <div
    class="quiz-result"
    :style="
      `
        background-image: url(${cover});
        padding-left: ${$device === 'mobile' ? paddingLeftMobile : paddingLeft};
      `
    "
  >
    <div class="quiz-result__content">
      <h1 class="quiz-result__title font-weight-thin mb-4">
        {{ title || defaultTitle }}
      </h1>

      <div v-html="text"></div>

      <v-btn
        round
        :large="$device !== 'mobile'"
        color="primary"
        :href="buttonUrl"
      >
        <v-icon light class="mr-1">mdi-check-circle-outline</v-icon>
        {{ buttonCaption }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizResult",

  props: {
    cover: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    defaultTitle: {
      type: String
    },

    text: {
      type: String,
      required: true
    },

    buttonCaption: {
      type: String,
      required: true
    },

    buttonUrl: {
      type: String,
      required: true
    },

    paddingLeft: {
      type: String,
      default: "60%"
    },

    paddingLeftMobile: {
      type: String,
      default: "0"
    }
  }
};
</script>

<style lang="scss">
.quiz-result {
  background-size: cover;
  height: 100%;

  @media only screen and (max-width: 600px) {
    background-size: contain;
    padding-left: 0;
    padding-top: 50%;
  }

  @media only screen and (min-width: 601px) and (max-width: 960px) {
    padding-left: 35%;
    background-position-x: 35%;
  }

  &__content {
    background-color: #fff;
    height: 100%;
    padding: 3em;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-start;
  }

  &__title {
    font-size: 45px !important;
    line-height: 48px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;

    @media only screen and (max-width: 600px) {
      font-size: 34px !important;
      line-height: 40px !important;
    }
  }

  iframe {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
}
</style>
