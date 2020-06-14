<template>
  <div class="courses-item__header">
    <div class="courses-item__header-number">
      <h3>
        <span v-if="lesson.number === lessonsCount">Финиш</span>
        <span v-else>Урок №{{ lesson.number }}</span>
      </h3>
    </div>
    <img :src="poster" />
    <div class="courses-item__header-desc">
      <h3 class="courses-item__header-desc-title">{{ lesson.title }}</h3>
      <div class="courses-item__header-desc-text">{{ lesson.comment }}</div>
    </div>
    <div class="courses-item__header-score"></div>
    <a
      href="#"
      :class="{
        'courses-item__header-material': true,
        'courses-item__header-material_type_video': lesson.type === 'video',
        'courses-item__header-material_type_video-opened':
          lesson.type === 'video' &&
          isPlayerOpened &&
          lesson.videoId === currentVideoId,
        'courses-item__header-material_type_test': lesson.type === 'test'
      }"
      @click.prevent="handleToggleVideo(lesson.videoId, lesson.number)"
    >
      <p v-if="lesson.type === 'video'">
        <span
          class="courses-item__header-material-action"
          v-if="isPlayerOpened && lesson.videoId === currentVideoId"
        >
          Закрыть
        </span>
        <span class="courses-item__header-material-action" v-else>
          Смотреть
        </span>
        <span class="courses-item__header-material-description">
          {{ lesson.duration }}
        </span>
      </p>
      <p class="courses-item__header-material-action" v-else>Обновить</p>
    </a>
  </div>
</template>

<script>
export default {
  name: "CourseItemPageHeader",

  props: {
    lesson: {
      type: Object,
      required: true
    },
    lessonsCount: {
      type: Number,
      required: true
    },
    doneLesson: {
      type: Number,
      required: true,
      default: 0
    },
    isPlayerOpened: {
      type: Boolean,
      required: true
    },
    currentVideoId: {
      validator: prop => typeof prop === "string" || prop === null,
      required: true
    }
  },

  computed: {
    poster() {
      if (this.lesson.poster) return this.lesson.poster;

      return `https://img.youtube.com/vi/${this.lesson.videoId}/default.jpg`;
    }
  },

  methods: {
    scrollTo(value) {
      window.scrollTo({
        top: value,
        behavior: "smooth"
      });
    },

    handleToggleVideo(videoID, lessonNumber) {
      if (this.doneLesson >= this.lesson.number) {
        this.$emit("play", { videoID, lessonNumber });
        this.scrollTo(350);
      } else {
        this.$buefy.dialog.alert({
          title: "Ошибка воспроизведения",
          message: "Данный урок пока закрыт, Вам необходимо пройти предыдущие.",
          type: "is-danger",
          hasIcon: true,
          icon: "alert-circle"
        });
      }
    }
  }
};
</script>

<style lang="scss">
.courses-item__header {
  position: relative;
  display: flex;

  &-number {
    position: relative;
    padding: 20px 15px;
    border-left: 4px solid #fa6801;
    text-align: center;
    flex: 0 0 110px;

    &::after {
      position: absolute;
      top: 20px;
      right: 0;
      bottom: 20px;
      border-right: 1px solid #ccc;
      content: "";
    }
  }

  &-video {
    height: 377px;
  }

  &-desc {
    padding: 20px;
    flex: 1 1 auto;

    &-title {
      margin: 0 0 15px;
    }

    &-text {
      color: #777;
    }
  }

  &-score {
    background-color: #fa6801;
    flex: 0 0 4px;
  }

  &-material {
    display: block;
    padding: 60px 20px 20px;
    background: 50% 25px no-repeat #34425a;
    text-align: center;
    flex: 0 0 102px;

    &:focus,
    &:hover {
      background-color: #2b384e;
      text-decoration: none;

      .courses-item__lessons-material-action {
        color: #899dc1;
        text-decoration: underline;
      }
    }

    p {
      margin: 0;
    }

    &_type_video {
      background-image: url(~@/assets/images/level__step-material_type_video.svg);
    }

    &_type_video-opened {
      background-image: url(~@/assets/images/level__step-material_type_video-opened.svg);
    }

    &_type_test {
      background-image: url(~@/assets/images/level__step-material_type_test.svg);
    }

    &_type_wallets {
      background-image: url(~@/assets/images/level__step-material_type_test.svg);
    }

    &-action {
      display: block;
      margin: 0;
      color: #fff;
    }

    &-description {
      display: block;
      color: #899dc1;
    }
  }
}
</style>
