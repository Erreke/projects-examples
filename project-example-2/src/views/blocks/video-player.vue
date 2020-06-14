<template>
  <video ref="videoPlayer" class="video-js vjs-default-skin" controls></video>
</template>

<script>
import videojs from "video.js";
import "videojs-youtube";

export default {
  name: "BlockVideoPlayer",

  props: {
    sources: {
      type: Array,
      required: true
    },

    isTimeToPlay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      player: null
    };
  },

  computed: {
    options() {
      return {
        fluid: true,
        aspectRatio: "16:9",
        responsive: true,
        controls: true,
        techOrder: ["youtube"],
        sources: this.sources
      };
    }
  },

  mounted() {
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        this.play();
        console.log("onPlayerReady", this);
      }
    );
  },

  beforeDestroy() {
    console.log("beforeDestroy");

    if (this.player) {
      this.$emit("destroy");
      this.player.dispose();
    }
  },

  watch: {
    isTimeToPlay(value) {
      if (value) {
        // this.player.play();
      }
    }
  }
};
</script>

<style lang="scss">
.video-js {
  width: 100%;
  // height: 574px;
}
</style>
