<template>
  <div :class="['courses__item content', viewTypeClass]">
    <div class="courses__item-poster">
      <div
        class="courses__item-poster-img"
        :style="`background-image: url(${item.poster})`"
      ></div>
      <div
        v-if="userProgress > 0"
        class="courses__item-poster-progress"
        :style="`width: ${userProgress}%;`"
      >
        {{ userProgress.toFixed(2) }}%
      </div>
    </div>

    <h3 class="courses__item-title">
      <router-link :to="{ name: 'courses-item', params: { id: item.id } }">
        {{ item.title }}
      </router-link>
    </h3>

    <div class="courses__item-meta">
      <div>
        <p v-if="item.author" class="courses__item-meta-item">
          <b-icon icon="account" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.author }}
          </span>
        </p>
        <p v-if="item.duration" class="courses__item-meta-item">
          <b-icon icon="timer" size="is-small" />
          <span class="courses__item-meta-value">
            {{ getDurationElements(item.duration).join(":") }}
          </span>
        </p>
      </div>

      <div>
        <b-rate
          class="courses__item-meta-item courses__item-rating"
          v-model="item.rating"
          :show-score="true"
          size="is-small"
          disabled
        ></b-rate>
        <p class="courses__item-meta-item courses__item-rating">
          <span class="courses__item-meta-value">
            {{ ratingVotersCount }}
          </span>
        </p>
      </div>
    </div>

    <p class="courses__item-desc">{{ item.description }}</p>

    <div class="courses__item-meta">
      <div>
        <p v-if="item.category" class="courses__item-meta-item">
          <b-icon icon="folder" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.category }}
          </span>
        </p>
        <p v-if="item.tags.length" class="courses__item-meta-item">
          <b-icon icon="tag" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.tags.join(", ") }}
          </span>
        </p>
        <p v-if="item.lessonsCount" class="courses__item-meta-item">
          <b-icon icon="book-open-variant" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.lessonsCount }} лекции
          </span>
        </p>
        <p v-if="item.studentsCount" class="courses__item-meta-item">
          <b-icon icon="account-group" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.studentsCount | number_format }} студентов
          </span>
        </p>
      </div>
      <div>
        <p v-if="item.languages" class="courses__item-meta-item">
          <b-icon icon="earth" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.languages.join(", ") }}
          </span>
        </p>
        <p v-if="item.subtitles.length" class="courses__item-meta-item">
          <b-icon icon="subtitles" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.subtitles.join(", ") }}
          </span>
        </p>
        <p v-if="item.updatedAt" class="courses__item-meta-item">
          <b-icon icon="calendar" size="is-small" />
          <span class="courses__item-meta-value">
            {{ item.updatedAt.seconds | date_time_format }}
          </span>
        </p>
      </div>
    </div>

    <b-button
      v-if="isUserEnrolled"
      type="is-primary"
      icon-left="lead-pencil"
      :loading="isEnrolling"
      :disabled="isEnrolling"
      @click.prevent="continueStudy"
    >
      {{ $t("page-courses.continue-study") }}
    </b-button>

    <b-button
      v-else
      type="is-primary"
      icon-left="lead-pencil"
      :loading="isEnrolling"
      :disabled="isEnrolling"
      @click.prevent="startStudy"
    >
      {{ $t("page-courses.start-study") }}
    </b-button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import getWatchViewFormSeconds from "@/utils/helpers/get-watch-view-form-seconds.js";

export default {
  name: "CoursesPageItem",

  props: {
    item: {
      type: Object,
      required: true
    },
    viewType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isSelected: false
    };
  },

  computed: {
    ...mapState("courses", ["isEnrollingToCourse"]),

    isEnrolling() {
      return this.isEnrollingToCourse && this.isSelected;
    },

    isUserEnrolled() {
      return Object.prototype.hasOwnProperty.call(
        this.$_user.enrolledCourses,
        this.item.id
      );
    },

    userProgress() {
      if (!this.item.lessonsCount) return 0;

      if (!this.isUserEnrolled) return 0;

      return (
        (100 / this.item.lessonsCount) *
        this.$_user.enrolledCourses[this.item.id]
      );
    },

    ratingVotersCount() {
      if (!this.item.ratingVotersCount)
        return this.$t("page-courses.no-rating-voters-count");

      return this.$t("page-courses.rating-voters-count", {
        count: this.$options.filters.number_format(this.item.ratingVotersCount)
      });
    },

    viewTypeClass() {
      if (this.viewType === "flexBig") {
        return "is-flex-big";
      }

      if (this.viewType === "flexMedium") {
        return "is-flex-medium";
      }

      return "is-table";
    }
  },

  methods: {
    ...mapActions("user", {
      saveUserInfo: "SAVE_USER_INFO"
    }),

    startStudy() {
      this.isSelected = true;

      this.saveUserInfo({
        uid: this.$_user.uid,
        fields: ["enrolledCourses"],
        values: [
          {
            ...this.$_user.enrolledCourses,
            [this.item.id]: 0
          }
        ],
        loader: "courses/SET_ENROLLING"
      }).then(() => {
        this.$router.push({
          name: "courses-item",
          params: { id: this.item.id }
        });

        this.isSelected = false;
      });
    },

    continueStudy() {
      this.$router.push({
        name: "courses-item",
        params: { id: this.item.id },
        query: { continue: true }
      });
    },

    getDurationElements(duration) {
      return getWatchViewFormSeconds(duration);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.courses__item {
  position: relative;
  padding: 1rem 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;

  &.is-flex-big {
    flex: 0 0 calc(50% - 1rem);
    margin: 0 0.5rem 2rem;
  }

  &.is-flex-medium {
    flex: 0 0 calc(33.33% - 1rem);
    margin: 0 0.5rem 2rem;
  }

  &.is-table {
    flex: 0 0 calc(100% - 1rem);
    margin: 0 0.5rem 2rem;
  }

  @include until($widescreen) {
    flex: 0 0 calc(50% - 1rem);
    margin: 0 0.5rem 2rem;
  }

  @include until($desktop) {
    flex: 0 0 100%;
    margin: 0 0 2rem;
  }

  @include until($tablet) {
    display: flex;
  }

  .progress-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .progress {
      border-radius: 0;
    }
  }

  &-poster {
    position: relative;

    @include until($tablet) {
      order: -3;
    }

    &-img {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      height: 150px;
    }

    &-progress {
      top: 0;
      bottom: 0;
      left: 0;
      color: #fff;
      line-height: 150px;
      text-align: center;
      position: absolute;
      background-color: rgba(60, 186, 160, 0.5);
    }
  }

  &-title {
    @include until($tablet) {
      order: -2;
    }
  }

  &-desc {
    flex-grow: 1;

    @include until($tablet) {
      order: -1;
    }
  }

  &-meta {
    display: flex;
    margin: 0 0 2rem;
    justify-content: space-between;

    @include until($desktop) {
      display: block;
      margin: 0 0 1rem;
    }

    &-item {
      margin: 0 !important;
    }

    &-value {
      font-size: 0.8rem;
    }
  }

  &-rating {
    text-align: center;
    justify-content: center;

    @include until($desktop) {
      text-align: left;
      justify-content: flex-start;
    }
  }
}
</style>
