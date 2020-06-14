<template>
  <div class="quiz-starter" :style="`background-image: url(${cover})`">
    <div class="quiz-starter__content">
      <h1 class="quiz-starter__title font-weight-thin mb-2">{{ title }}</h1>
      <h2 v-if="subtitle" class="quiz-starter__subtitle font-weight-thin mb-4">
        {{ subtitle }}
      </h2>
      <v-btn
        round
        :large="$device !== 'mobile'"
        color="primary"
        dark
        @click.prevent="startQuiz"
      >
        <v-icon light class="mr-1">mdi-check-circle-outline</v-icon>
        {{ buttonCaption }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizStarter",

  props: {
    title: {
      type: String,
      required: true
    },

    subtitle: {
      type: String
    },

    cover: {
      type: String,
      required: true,
      default:
        "https://lh6.googleusercontent.com/proxy/MdXBfxi4vCF0ZKalCD1XFNnrumrgr3DoIIwdqaPlZG9Q0K4hUVQQUGfBnqzm3-jY1EJEREorVqCj7TUKyEqhPiz32FyE051g9G8sMKhGdyM=w3840-h2160-p-k-no-nd-mv"
    },

    buttonCaption: {
      type: String,
      required: true,
      default: "Начать"
    }
  },

  methods: {
    startQuiz() {
      this.$emit("start");
    }
  }
};
</script>

<style lang="scss">
.quiz-starter {
  background-size: cover;
  padding-left: 60%;
  width: 100%;
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
