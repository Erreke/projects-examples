<template>
  <div class="stream-page">
    <AppMembers
      v-if="$mode !== 'STREAM_NOT_FOUND' && $mode !== 'STREAM_LOADING'"
      :isShowed="isMembersShowed"
      @toggle="setMembersPanelVisible"
    />

    <AppComments
      v-if="$mode !== 'STREAM_NOT_FOUND' && $mode !== 'STREAM_LOADING'"
      :isShowed="isCommentsShowed"
      @toggle="setCommentsPanelVisible"
    />

    <AppToolbar
      v-if="$mode !== 'STREAM_NOT_FOUND' && $mode !== 'STREAM_LOADING'"
      :title="pageTitle"
      @startPlayer="startPlayer"
      @toggleMembersPanel="toggleMembersPanel"
      @toggleCommentsPanel="toggleCommentsPanel"
    />

    <v-content
      v-if="$mode !== 'STREAM_NOT_FOUND' && $mode !== 'STREAM_LOADING'"
    >
      <video
        ref="player"
        :poster="streamPoster"
        class="stream-page__video"
      ></video>
      <div
        v-if="isStartBtnShowed"
        @click="startPlayer"
        class="stream-page__play-btn"
      >
        <v-icon>play_circle_filled</v-icon>
      </div>
    </v-content>

    <AppFooter
      v-if="$mode !== 'STREAM_NOT_FOUND' && $mode !== 'STREAM_LOADING'"
    />

    <SignInUser
      v-if="$mode.includes('AUTHORIZING')"
      :title="pageTitle"
      :start="streamStart"
      :duration="streamDuration"
    />

    <StreamNotFound :isActive="$mode === 'STREAM_NOT_FOUND'" />

    <Loader :isActive="$mode === 'STREAM_LOADING'" />
  </div>
</template>

<script>
import hls from "hls.js";
import { mapState, mapActions, mapMutations } from "vuex";
import AppMembers from "@/components/AppMembers";
import AppComments from "@/components/AppComments";
import AppToolbar from "@/components/AppToolbar";
import AppFooter from "@/components/AppFooter";
import SignInUser from "@/components/sign-in-user";
import StreamNotFound from "@/components/StreamNotFound";
import Loader from "@/components/Loader";

export default {
  name: "StreamPage",

  metaInfo() {
    return {
      title: this.pageTitle
    };
  },

  components: {
    AppMembers,
    AppComments,
    AppToolbar,
    AppFooter,
    SignInUser,
    StreamNotFound,
    Loader
  },

  data() {
    return {
      hls: null,
      player: null,
      isStartBtnShowed: true,
      membersShowingStatus: null,
      commentsShowingStatus: null,
      pageTitle: this.$t("page-stream.loading")
    };
  },

  computed: {
    ...mapState(["stream"]),

    isMembersShowed: {
      get() {
        return (
          this.membersShowingStatus ||
          (this.$device !== "tablet" && this.$device !== "mobile")
        );
      },
      set(value) {
        this.membersShowingStatus = value;
      }
    },

    isCommentsShowed: {
      get() {
        return (
          this.commentsShowingStatus ||
          (this.$device !== "tablet" && this.$device !== "mobile")
        );
      },
      set(value) {
        this.commentsShowingStatus = value;
      }
    },

    streamId() {
      return this.$route.params.streamId;
    },

    streamCommentsId() {
      const date = new Date();
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      const yy = date.getFullYear();

      return `${this.streamId}-${dd}${mm}${yy}`;
    },

    streamUrl() {
      return this.stream && this.stream.url;
    },

    streamPoster() {
      return this.stream && this.stream.poster;
    },

    streamStart() {
      return this.stream && this.stream.start;
    },

    streamDuration() {
      return this.stream && this.stream.duration;
    }
  },

  methods: {
    ...mapActions({
      fetchStream: "FETCH_STREAM",
      registerUserAsMember: "REGISTER_USER_AS_MEMBER"
    }),

    ...mapMutations({
      setStreamNotFoundStatus: "SET_STREAM_NOT_FOUND_STATUS"
    }),

    initPlayer(streamUrl) {
      if (hls.isSupported() && this.player) {
        this.player.addEventListener("contextmenu", e => {
          e.preventDefault();
          return false;
        });

        this.hls = new hls();
        this.hls.loadSource(streamUrl);
        this.hls.attachMedia(this.player);

        this.hls.on(hls.Events.MANIFEST_PARSED, () => {
          this.startPlayer();
        });
      }
    },

    startPlayer() {
      console.log("startPlayer");
      var playPromise = this.player.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isStartBtnShowed = false;
          })
          .catch(() => {
            this.isStartBtnShowed = true;
          });
      }
    },

    toggleMembersPanel() {
      console.log("toggleMembersPanel");
      this.membersShowingStatus = !this.isMembersShowed;
    },

    toggleCommentsPanel() {
      console.log("toggleCommentsPanel");
      this.commentsShowingStatus = !this.isCommentsShowed;
    },

    setMembersPanelVisible(value) {
      this.membersShowingStatus = value;
    },

    setCommentsPanelVisible(value) {
      this.commentsShowingStatus = value;
    }
  },

  created() {
    window.AUTOMATON_WEBINAR_STREAM_ID = this.streamId;
    window.AUTOMATON_WEBINAR_STREAM_DAILY_ID = this.streamCommentsId;

    this.fetchStream().then(stream => {
      if (stream) {
        this.pageTitle = this.stream.title;
        this.setStreamNotFoundStatus(false);
        //
      } else {
        this.pageTitle = this.$t("page-stream.not-found");
        this.setStreamNotFoundStatus(true);
      }
    });
  },

  mounted() {
    this.player = this.$refs.player;
  },

  watch: {
    streamUrl(value) {
      this.initPlayer(value);
    },

    $user(value) {
      if (value) {
        this.registerUserAsMember();
      }
    }
  }
};
</script>

<style lang="scss">
.stream-page {
  height: 100%;

  &__play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .v-icon {
      color: rgba(255, 255, 255, 0.8);
      font-size: 10rem;
      cursor: pointer;

      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  &__video {
    background: black;
    width: 100%;
    height: 100%;
  }
}
</style>
