<template>
  <div class="courses-item__details content">
    <p>{{ currentCourse.description }}</p>

    <p v-if="currentCourse.author">
      <b-icon icon="account" size="is-small" />
      {{
        $t("page-courses-item.author", {
          author: currentCourse.author
        })
      }}
    </p>

    <p v-if="currentCourse.duration">
      <b-icon icon="timer" size="is-small" />
      {{
        $t("page-courses-item.duration", {
          duration: getDurationElements(currentCourse.duration).join(":")
        })
      }}
    </p>

    <p>
      <b-icon icon="star" size="is-small" />
      {{ $t("page-courses-item.rating") }}
      <b-rate
        v-model="currentCourse.rating"
        :show-score="true"
        size="is-small"
        disabled
      ></b-rate>
      <span class="courses-item__details-voters-count">
        {{ ratingVotersCount }}
      </span>
    </p>

    <p>
      <b-icon icon="folder" size="is-small" />
      {{
        $t("page-courses-item.category", {
          category: currentCourse.category
        })
      }}
    </p>

    <p>
      <b-icon icon="tag" size="is-small" />
      {{
        $t("page-courses-item.tags", {
          tags: currentCourse.tags.join(", ")
        })
      }}
    </p>

    <p>
      <b-icon icon="book-open-variant" size="is-small" />
      {{
        $t("page-courses-item.lessons-count", {
          count: lessonsCount
        })
      }}
    </p>

    <p>
      <b-icon icon="account-group" size="is-small" />
      {{
        $t("page-courses-item.students-count", {
          count: studentsCount
        })
      }}
    </p>

    <p>
      <b-icon icon="earth" size="is-small" />
      {{
        $t("page-courses-item.languages", {
          languages: currentCourse.languages.join(", ")
        })
      }}
    </p>

    <p>
      <b-icon icon="subtitles" size="is-small" />
      {{
        $t("page-courses-item.subtitles", {
          subtitles: currentCourse.subtitles.join(", ")
        })
      }}
    </p>

    <p>
      <b-icon icon="calendar" size="is-small" />
      {{
        $t("page-courses-item.updated-at", {
          date: updatedAt
        })
      }}
    </p>
  </div>
</template>

<script>
import getWatchViewFormSeconds from "@/utils/helpers/get-watch-view-form-seconds.js";

export default {
  name: "CourseItemPageDetails",

  props: {
    currentCourse: {
      type: Object,
      required: true
    }
  },

  computed: {
    ratingVotersCount() {
      if (!this.currentCourse.ratingVotersCount)
        return this.$t("page-courses-item.no-rating-voters-count");

      return this.$t("page-courses-item.rating-voters-count", {
        count: this.$options.filters.number_format(
          this.currentCourse.ratingVotersCount
        )
      });
    },

    lessonsCount() {
      return this.$options.filters.number_format(
        this.currentCourse.lessonsCount
      );
    },

    studentsCount() {
      return this.$options.filters.number_format(
        this.currentCourse.studentsCount
      );
    },

    updatedAt() {
      return this.$options.filters.date_time_format(
        this.currentCourse.updatedAt.seconds
      );
    }
  },

  methods: {
    getDurationElements(duration) {
      return getWatchViewFormSeconds(duration);
    }
  }
};
</script>

<style lang="scss">
.courses-item__details {
  padding: 1rem 0;

  .rate {
    display: inline-flex;
    margin: 0;
  }

  &-voters-count {
    font-size: 0.8rem;
    margin: 0 0.5rem;
  }
}
</style>
