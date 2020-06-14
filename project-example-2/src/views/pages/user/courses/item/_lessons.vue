<template>
  <div class="courses-item__lessons">
    <div
      v-for="(item, key) in items"
      :key="key"
      :class="[
        'courses-item__lessons-item',
        {
          'is-done': doneLesson >= item.number,
          'is-saving': isUserStepSavingProcess
        }
      ]"
    >
      <lessons-header
        :lesson="item"
        :lessons-count="itemsLength"
        :is-player-opened="isPlayerOpened"
        :current-video-id="currentVideoId"
        :done-lesson="doneLesson"
        @play="play"
      />

      <div
        v-if="!isUserEnrolled || item.number > doneLesson + 1"
        class="courses-item__lessons-locked"
      ></div>

      <div v-if="item.type === 'video' && item.videoId === currentVideoId">
        <video-player
          :sources="playerSource"
          :is-time-to-play="isTimeToPlay"
          @destroy="onPlayerDestroyed"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CourseItemPageLessons",

  props: {
    items: {
      validator: prop =>
        typeof prop === "object" || prop === null || prop === undefined,
      required: true
    },
    doneLesson: {
      type: Number,
      required: true,
      default: 0
    },
    isUserEnrolled: {
      type: Boolean,
      required: true
    },
    isPlayerOpened: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      currentVideoId: "",
      isTimeToPlay: false,
      playerSource: []
    };
  },

  components: {
    VideoPlayer: () => import("@/views/blocks/video-player.vue"),
    LessonsHeader: () => import("./_lessons-header.vue")
  },

  computed: {
    ...mapState("lessons", ["isUserStepSavingProcess"]),

    itemsLength() {
      return Object.keys(this.items).length;
    }
  },

  methods: {
    play(payload) {
      this.currentVideoId = payload.videoID;
      this.lessonNumber = payload.lessonNumber;
      this.playerSource = [
        {
          src: `https://www.youtube.com/watch?v=${payload.videoID}`,
          type: "video/youtube"
        }
      ];
      this.isTimeToPlay = true;
    },

    onPlayerDestroyed() {
      this.isTimeToPlay = false;
    }
  }
};
</script>

<style lang="scss">
.courses-item__lessons {
  &-item {
    position: relative;
    margin-bottom: 1rem;
    background: #fff;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1);

    &.is-done {
      .courses-item__header-score {
        background-color: #1fa890;
      }

      .courses-item__header-number {
        border-left-color: #1fa890;
      }
    }
  }

  &-locked {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: 50% 50% no-repeat rgba(52, 66, 90, 0.8);
    background-image: url(~@/assets/images/level__step-locked.svg);
    content: "";
  }
}
</style>
