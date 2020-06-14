<template>
  <cabinet-layout
    :title="courseTitle"
    :metatitle="courseTitle"
    :breadcrumbs="breadcrumbs"
  >
    <div class="courses-item">
      <b-loading :active="isTimeToShowLoader" :is-full-page="false"></b-loading>

      <p v-if="isTimeToShowNotFound">Курс не найден</p>

      <b-button
        v-if="isTimeToShowEnrollButton"
        class="courses-item__start"
        type="is-primary"
        :loading="isEnrollingToCourse"
        :disabled="isEnrollingToCourse"
        @click="startStudy"
      >
        {{ $t("page-courses-item.start-study") }}
      </b-button>

      <b-tabs
        v-model="activeTab"
        v-if="isTimeToShowProgress || isTimeToShowLessons"
      >
        <b-tab-item label="Обучение">
          <lessons-progress
            v-if="isTimeToShowProgress"
            :items="currentLessons"
            :done-lesson="doneLesson"
          />

          <hr v-if="isTimeToShowProgress" class="courses-item__separator" />

          <lessons-legenda v-if="isTimeToShowProgress" />

          <lessons
            v-if="isTimeToShowLessons"
            :items="currentLessons"
            :done-lesson="doneLesson"
            :is-user-enrolled="isUserEnrolled"
            :is-player-opened="isPlayerOpened"
            :current-video-id="currentVideoId"
          />
        </b-tab-item>

        <b-tab-item label="Детали курса">
          <lessons-details :current-course="currentCourse" />
        </b-tab-item>

        <b-tab-item label="Отзывы">
          Отзывы
        </b-tab-item>
      </b-tabs>
    </div>
  </cabinet-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CourseItemPage",

  usedVuexModules: ["courses", "lessons"],

  components: {
    LessonsProgress: () => import("./_lessons-progress.vue"),
    LessonsLegenda: () => import("./_lessons-legenda.vue"),
    LessonsDetails: () => import("./_lessons-details.vue"),
    Lessons: () => import("./_lessons.vue")
  },

  data() {
    return {
      courseId: this.$route.params.id,
      currentCourse: null,
      currentLessons: null,
      isCourseNotFound: false,
      activeTab: 0
    };
  },

  computed: {
    ...mapState("courses", {
      coursesItems: state => state.items,
      isCourseFetching: state => state.isCourseFetching
    }),

    ...mapState("lessons", {
      lessonsItems: state => state.items,
      currentVideoId: state => state.currentVideoId,
      isEnrollingToCourse: state => state.isEnrollingToCourse,
      isPlayerOpened: state => state.isPlayerOpened
    }),

    isTimeToShowLoader() {
      return (
        this.isCourseFetching &&
        !this.isCourseNotFound &&
        !this.currentCourse &&
        !this.currentLessons
      );
    },

    isTimeToShowNotFound() {
      return (
        !this.isCourseFetching &&
        this.isCourseNotFound &&
        !this.currentCourse &&
        !this.currentLessons
      );
    },

    isTimeToShowEnrollButton() {
      return (
        !this.isCourseFetching &&
        !this.isCourseNotFound &&
        this.currentCourse &&
        this.currentLessons &&
        !this.isUserEnrolled
      );
    },

    isTimeToShowProgress() {
      return (
        !this.isCourseFetching &&
        !this.isCourseNotFound &&
        this.currentCourse &&
        this.currentLessons &&
        this.isUserEnrolled
      );
    },

    isTimeToShowLessons() {
      return (
        !this.isCourseFetching &&
        !this.isCourseNotFound &&
        this.currentCourse &&
        this.currentLessons
      );
    },

    courseTitle() {
      if (!this.currentCourse) return null;

      return this.currentCourse.title;
    },

    breadcrumbs() {
      if (!this.currentCourse) return [];

      return [
        {
          route: "courses",
          title: this.$t("block-navigation.courses")
        },
        {
          route: "courses-item",
          title: this.currentCourse && this.currentCourse.title,
          params: { id: this.courseId }
        }
      ];
    },

    isUserEnrolled() {
      if (!this.currentCourse) return false;

      return Object.prototype.hasOwnProperty.call(
        this.$_user.enrolledCourses,
        this.currentCourse.id
      );
    },

    doneLesson() {
      return this.$_user.enrolledCourses[this.currentCourse.id];
    }
  },

  methods: {
    ...mapActions("courses", {
      fetchCourse: "FETCH_COURSE"
    }),

    ...mapActions("lessons", {
      fetchLessons: "FETCH_LESSONS"
    }),

    ...mapActions("user", {
      saveUserInfo: "SAVE_USER_INFO"
    }),

    startStudy() {
      this.saveUserInfo({
        uid: this.$_user.uid,
        fields: ["enrolledCourses"],
        values: [
          {
            ...this.$_user.enrolledCourses,
            [this.courseId]: 0
          }
        ],
        loader: "lessons/SET_ENROLLING"
      });
    }
  },

  mounted() {
    Promise.all([
      this.fetchCourse(this.courseId),
      this.fetchLessons(this.courseId)
    ]).then(result => {
      if (result.some(r => !r)) {
        this.isCourseNotFound = true;
      } else {
        this.currentCourse = this.coursesItems[this.courseId];
        this.currentLessons = this.lessonsItems[this.courseId];
        this.isCourseNotFound = false;
      }
    });
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.courses-item {
  padding: 2rem;
  position: relative;

  @include until($desktop) {
    padding: 1rem;
  }

  &__separator {
    margin: 0;
    border-top: 1px solid #cbd6e8;
  }

  &__start {
    margin: 0 0 2rem;
  }

  .b-tabs .tab-content {
    padding: 0;
  }
}
</style>
