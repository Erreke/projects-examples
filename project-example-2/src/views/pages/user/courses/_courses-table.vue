<template>
  <b-table
    ref="table"
    detail-key="id"
    class="courses__table"
    :data="items"
    :striped="true"
    :hoverable="true"
    :paginated="true"
    :per-page="20"
    :detailed="true"
    :opened-detailed="[openedRow]"
    :show-detail-icon="false"
    @details-close="closeRow"
    @details-open="closeOtherRows"
  >
    <template slot-scope="props">
      <b-table-column field="title" label="Название">
        <div class="courses__table-td" @click="toggle(props.row)">
          <router-link
            :to="{ name: 'courses-item', params: { id: props.row.id } }"
            @click.native="stopPropagation"
          >
            {{ props.row.title }}
          </router-link>
        </div>
      </b-table-column>

      <b-table-column field="duration" label="Продолжительность">
        <div class="courses__table-td" @click="toggle(props.row)">
          {{ getDurationElements(props.row.duration).join(":") }}
        </div>
      </b-table-column>

      <b-table-column field="rating" label="Рейтинг">
        <div class="courses__table-td" @click="toggle(props.row)">
          <b-rate
            v-model="props.row.rating"
            :show-score="true"
            size="is-small"
            disabled
          ></b-rate>
          <p class="courses__table-td-small">
            {{ getRatingVotersCount(props.row.ratingVotersCount) }}
          </p>
        </div>
      </b-table-column>

      <b-table-column field="updatedAt" label="Обновлено">
        <div class="courses__table-td" @click="toggle(props.row)">
          {{ dateTimeFormat(props.row.updatedAt) }}
        </div>
      </b-table-column>
    </template>

    <template slot="detail" slot-scope="props">
      <div class="courses__table-detail">
        <div class="courses__table-detail-poster">
          <div
            class="courses__table-detail-poster-img"
            :style="`background-image: url(${props.row.poster})`"
          ></div>
          <div
            v-if="userProgress(props.row.lessonsCount, props.row.id) > 0"
            class="courses__table-detail-poster-progress"
            :style="
              `width: ${userProgress(props.row.lessonsCount, props.row.id)}%;`
            "
          >
            {{ userProgress(props.row.lessonsCount, props.row.id).toFixed(2) }}%
          </div>
        </div>

        <div class="courses__table-detail-desc">
          <p>{{ props.row.description }}</p>
          <b-button
            v-if="checkUserEnrolled(props.row.id)"
            type="is-primary"
            icon-left="lead-pencil"
            :loading="isEnrolling(props.row.id)"
            :disabled="isEnrolling(props.row.id)"
            @click.prevent="continueStudy(props.row.id)"
          >
            {{ $t("page-courses.continue-study") }}
          </b-button>

          <b-button
            v-else
            type="is-primary"
            icon-left="lead-pencil"
            :loading="isEnrolling(props.row.id)"
            :disabled="isEnrolling(props.row.id)"
            @click.prevent="startStudy(props.row.id)"
          >
            {{ $t("page-courses.start-study") }}
          </b-button>
        </div>

        <div class="courses__table-detail-meta">
          <div class="courses__table-detail-meta-content">
            <p v-if="props.row.author">
              <b-icon icon="account" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.author }}
              </span>
            </p>

            <p v-if="props.row.category">
              <b-icon icon="folder" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.category }}
              </span>
            </p>

            <p v-if="props.row.tags.length">
              <b-icon icon="tag" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.tags.join(", ") }}
              </span>
            </p>
          </div>

          <div class="courses__table-detail-meta-content">
            <p v-if="props.row.languages.length">
              <b-icon icon="earth" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.languages.join(", ") }}
              </span>
            </p>

            <p v-if="props.row.subtitles.length">
              <b-icon icon="subtitles" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.subtitles.join(", ") }}
              </span>
            </p>

            <p v-if="props.row.lessonsCount">
              <b-icon icon="book-open-variant" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.lessonsCount }} лекции
              </span>
            </p>

            <p v-if="props.row.studentsCount">
              <b-icon icon="account-group" size="is-small" />
              <span class="courses__table-detail-meta-content-value">
                {{ props.row.studentsCount | number_format }} студентов
              </span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </b-table>
</template>

<script>
import { mapActions, mapState } from "vuex";
import getWatchViewFormSeconds from "@/utils/helpers/get-watch-view-form-seconds.js";

export default {
  name: "CoursesPageTable",

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      openedRow: null,
      selectedCourseId: null
    };
  },

  computed: {
    ...mapState("courses", ["isEnrollingToCourse"])
  },

  methods: {
    ...mapActions("user", {
      saveUserInfo: "SAVE_USER_INFO"
    }),

    getDurationElements(duration) {
      return getWatchViewFormSeconds(duration);
    },

    getRatingVotersCount(value) {
      if (!value) return this.$t("page-courses.no-rating-voters-count");

      return this.$t("page-courses.rating-voters-count", {
        count: this.$options.filters.number_format(value)
      });
    },

    dateTimeFormat(value) {
      if (!value) return "-";

      return this.$options.filters.date_time_format(value.seconds);
    },

    numberFormat(value) {
      if (!value) return "-";

      return this.$options.filters.number_format(value);
    },

    closeRow() {
      this.openedRow = null;
    },

    closeOtherRows(row) {
      this.openedRow = row.id;
    },

    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },

    checkUserEnrolled(courseId) {
      return Object.prototype.hasOwnProperty.call(
        this.$_user.enrolledCourses,
        courseId
      );
    },

    userProgress(lessonsCount, courseId) {
      if (!lessonsCount) return 0;

      if (!this.checkUserEnrolled(courseId)) return 0;

      return (100 / lessonsCount) * this.$_user.enrolledCourses[courseId];
    },

    isEnrolling(id) {
      return this.isEnrollingToCourse && this.selectedCourseId === id;
    },

    startStudy(id) {
      this.selectedCourseId = id;

      this.saveUserInfo({
        uid: this.$_user.uid,
        fields: ["enrolledCourses"],
        values: [
          {
            ...this.$_user.enrolledCourses,
            [id]: 0
          }
        ],
        loader: "courses/SET_ENROLLING"
      }).then(() => {
        this.$router.push({
          name: "courses-item",
          params: { id }
        });

        this.selectedCourseId = null;
      });
    },

    continueStudy(id) {
      this.$router.push({
        name: "courses-item",
        params: { id },
        query: { continue: true }
      });
    },

    stopPropagation(e) {
      e.stopPropagation();
    }
  }
};
</script>

<style lang="scss">
.courses__table {
  .table > tbody > tr > td {
    padding: 0;
  }

  &-td {
    cursor: pointer;
    padding: 0.5rem 0.75rem;

    .rate {
      justify-content: center;
      margin: 0 auto;
    }

    &-small {
      text-align: center;
      font-size: 0.8rem;
    }
  }

  .detail {
    td,
    .detail-container {
      padding: 0 !important;
    }
  }

  &-detail {
    display: flex;
    cursor: default;
    justify-content: space-between;
    padding: 0.5rem;

    &-poster {
      margin: 0.5rem;
      flex: 0 0 250px;
      position: relative;

      &-img {
        height: 250px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }

      &-progress {
        top: 0;
        bottom: 0;
        left: 0;
        color: #fff;
        line-height: 250px;
        text-align: center;
        position: absolute;
        background-color: rgba(60, 186, 160, 0.5);
      }
    }

    &-desc {
      margin: 0.5rem;

      p {
        margin: 0 0 0.5rem;
      }
    }

    &-meta {
      display: flex;
      flex: 0 0 360px;

      &-content {
        margin: 0.5rem;
        flex: 0 0 164px;

        &-value {
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
