<template>
  <v-navigation-drawer
    fixed
    v-model="isActive"
    right
    clipped
    app
    class="comments"
  >
    <div class="comments__bg"></div>
    <div class="comments__container" ref="container">
      <ul class="comments__list">
        <li
          v-for="(item, index) in comments"
          :class="[
            'comments__item',
            { 'comments__item-out': item.authorId === ($user && $user.uid) },
            { 'comments__item-in': item.authorId !== ($user && $user.uid) }
          ]"
          :key="index"
          @mouseenter="hoveredItemIndex = index"
          @mouseleave="hoveredItemIndex = null"
        >
          <span class="comments__item-tail"></span>
          <div
            class="comments__item-author"
            v-if="item.authorId !== ($user && $user.uid)"
          >
            {{ item.authorName }}
          </div>

          <div class="comments__item-text">{{ item.text }}</div>
          <div class="comments__item-time">
            {{ item.createdAt.seconds | TIME_SIMPLE }}
          </div>

          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn icon flat v-on="on" color="grey" class="qwe">
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile @click="reply">
                <v-list-tile-title>Ответить</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="ban" v-if="$user.isAdmin">
                <v-list-tile-title>Забанить</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </li>
      </ul>
    </div>

    <v-alert
      v-model="hasSendMessageError"
      dismissible
      type="error"
      class="comments__form-error"
    >
      {{ formError }}
    </v-alert>

    <v-form class="comments__form" @submit.prevent="submitForm">
      <v-text-field
        v-model="message"
        :disabled="isMessageSendProcessing"
        :label="$t('block-global.type-message')"
      ></v-text-field>
      <v-btn
        flat
        icon
        color="blue-grey"
        type="submit"
        :disabled="!message"
        :loading="isMessageSendProcessing"
      >
        <v-icon dark>send</v-icon>
      </v-btn>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  props: {
    isShowed: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      message: "",
      hoveredItemIndex: null
    };
  },

  computed: {
    ...mapState(["isMessageSendProcessing", "sendMessageError"]),

    ...mapGetters(["comments"]),

    formError() {
      if (this.sendMessageError === "permission-denied")
        return this.$t("block-errors.permission-denied");

      if (this.sendMessageError) return this.$t("block-errors.error-unknown");

      return null;
    },

    hasSendMessageError: {
      get() {
        return !!this.sendMessageError;
      },
      set() {
        this.clearSendMessageError();
      }
    },

    isActive: {
      get() {
        return this.isShowed;
      },
      set(value) {
        this.$emit("toggle", value);
      }
    }
  },

  methods: {
    ...mapActions({
      fetchComments: "FETCH_COMMENTS",
      sendComment: "SEND_COMMENT"
    }),

    ...mapMutations({
      clearSendMessageError: "CLEAR_SEND_MESSAGE_ERROR"
    }),

    submitForm() {
      this.sendComment({
        text: this.message,
        authorId: this.$user && this.$user.uid,
        authorName: this.$user && this.$user.fullname,
        createdAt: new Date()
      }).then(() => {
        this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
        this.message = "";
      });
    },

    scrollContainer() {
      const clientHeight = this.$refs.container.clientHeight;
      const scrollHeight = this.$refs.container.scrollHeight;
      const scrollTop = this.$refs.container.scrollTop;

      this.$nextTick(() => {
        if (clientHeight === scrollHeight - scrollTop) {
          this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
        }
      });
    },

    reply() {
      console.log("REPLY");
    },

    ban() {
      console.log("BAN");
    }
  },

  mounted() {
    this.fetchComments();
  },

  watch: {
    comments() {
      this.scrollContainer();
    }
  }
};
</script>

<style lang="scss">
.comments {
  background-color: #e5ddd5 !important;
  display: flex;
  flex-direction: column;

  &__bg {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0.06;
    background-image: url(/chat.png);
    background-repeat: repeat;
  }

  &__container {
    flex: 1 1 0;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 1em 8%;
    z-index: 1;
    position: relative;
  }

  &__list {
    display: flex;
    flex-flow: column;
    list-style: none;
    padding: 0;
  }

  &__item {
    margin-bottom: 12px;
    padding: 6px 7px 8px 9px;
    background: white;
    border-radius: 7.5px;
    box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
    align-self: flex-start;
    display: list-item;
    position: relative;
    max-width: 95%;

    &-in {
      border-top-left-radius: 0;

      .comments__item-tail {
        left: -12px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURUxpccPDw9ra2m9vbwAAAAAAADExMf///wAAABoaGk9PT7q6uqurqwsLCycnJz4+PtDQ0JycnIyMjPf3915eXvz8/E9PT/39/RMTE4CAgAAAAJqamv////////r6+u/v7yUlJeXl5f///5ycnOXl5XNzc/Hx8f///xUVFf///+zs7P///+bm5gAAAM7Ozv///2fVensAAAAvdFJOUwCow1cBCCnqAhNAnY0WIDW2f2/hSeo99g1lBYT87vDXG8/6d8oL4sgM5szrkgl660OiZwAAAHRJREFUKM/ty7cSggAABNFVUQFzwizmjPz/39k4YuFWtm55bw7eHR6ny63+alnswT3/rIDzUSC7CrAziPYCJCsB+gbVkgDtVIDh+DsE9OTBpCtAbSBAZSEQNgWIygJ0RgJMDWYNAdYbAeKtAHODlkHIv997AkLqIVOXVU84AAAAAElFTkSuQmCC);
      }
    }

    &-out {
      background: #dcf8c6;
      align-self: flex-end;
      border-top-right-radius: 0;

      .comments__item-tail {
        right: -12px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURUxpcXmHa4maet/4yA0aDRMTE8fhsgAAAAAAAMDXrCsxJeX/z1xzXIiYetPsvGBsVUdPPuH8zOH8zNDrvMvmtrrOpwAAAAAAABUVFRoaGtnyxLTMozQ+MMfftFBeSR8nH5aoh6q/mW9+ZN/4yMjhtRwlHAAAAIOWd+r/06C1kkNLOwsLC9z4xur/0+n/0t76x9v4xeL9y+b/z+j/0d/7yeH8yuX/zeD8ytz5xt76yOP/zeH+y+b/zuD8yd35xuf/0MY9jkkAAAAsdFJOUwBvd/ATDZIBAsMp/At/11c9yPbizHoICQwT4bY1ykkgjahl6s8bBYT6nUAWOLbtFAAAAIhJREFUKM/tzbUWwlAURNFBE9zdg0NecLf//yvKUJyUdDnl7HXXletXqmXl9wPbQ9JCcC+VJsOj2mDwovzj3osjHGNFEVxNRAj7UR1hlx+I4FbuC8HkZBE8OwnRxamdFsEmUxCCGdoI51RLBK9xVwTvjyMEbzlDMJMp7lqseNc8YNc6CGyF/a0vcmwhZbCG+kEAAAAASUVORK5CYII=);
      }
    }

    &-tail {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      top: 0;
      width: 12px;
      height: 19px;
    }

    &-author {
      font-size: 13px;
      font-weight: 500;
      line-height: 22px;
    }

    &-text {
      &::after {
        content: "";
        display: inline;
        margin-right: 78px;
      }
    }

    &-time {
      float: right;
      color: rgba(0, 0, 0, 0.45);
      font-size: 11px;
    }
  }

  &__form {
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    background-color: #efefef;
    padding: 5px 10px;
    align-items: flex-end;
    box-sizing: border-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    max-width: 100%;
    min-height: 62px;
    position: relative;
    z-index: 2;

    input {
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 21px;
      padding: 9px 12px 11px;
      margin: 5px 0;

      box-sizing: border-box;
      flex: 1 1 auto;
      font-size: 15px;
      font-weight: 400;
      line-height: 20px;
      min-height: 20px;
      min-width: 0;
      outline: none;
      width: inherit;
      will-change: width;
    }

    button {
      margin-right: 0px;
    }
  }

  &__form-error {
    margin: 0;
  }

  .qwe {
    position: absolute;
    top: 0;
    right: 0;
  }

  ._1ebw2 {
    background-color: #efefef;
    padding-top: 5px;
  }
  ._1ebw2 {
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-flex;
    display: flex;
    width: 100%;
  }
  .FkdAD {
    margin-left: 11px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    overflow: hidden;
  }
  .Drque {
    width: 100%;
  }
  ._2I-yY {
    background-color: transparent;
    border-radius: 0;
  }
  ._2HTIU {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 7.5px;
  }
  ._2HTIU {
    display: -webkit-flex;
    display: flex;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  ._1dvF4 {
    border-top-left-radius: 7.5px;
    border-bottom-left-radius: 7.5px;
  }
  ._1dvF4 {
    -webkit-flex: none;
    flex: none;
    width: 4px;
  }
  ._2I-yY ._3LVMN,
  ._7Q1c5 ._3LVMN {
    padding: 8px 12px 9px 11px;
    max-height: 66px;
  }
  ._3LVMN {
    min-height: 42px;
    max-height: 82px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    overflow: hidden;
    -webkit-flex-grow: 1;
    flex-grow: 1;
  }
  ._2I-yY .SdGy6,
  ._7Q1c5 .SdGy6 {
    max-width: 500px;
  }

  .SdGy6 {
    overflow: hidden;
  }
  .color-1 {
    color: #35cd96 !important;
  }
  ._1QjgA {
    color: #74cff8;
    display: -webkit-flex;
    display: flex;
    font-size: 12.8px;
    font-weight: 500;
    line-height: 22px;
  }
  ._1uQFN {
    padding-left: 2px;
    margin-left: -2px;
  }
  ._1uQFN {
    flex: 0 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .hJLQA._2HHbr {
    max-height: 40px;
  }
  ._2HHbr {
    font-size: 12.6px;
    font-size: 13.2px;
    line-height: 20px;
    max-height: 60px;
    overflow: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
    color: rgba(0, 0, 0, 0.6);
  }
  ._3LVMN {
    padding: 5px 12px 7px 8px;
  }

  .color-1 {
    color: #35cd96 !important;
  }

  .color-2 {
    color: #6bcbef !important;
  }

  .color-3 {
    color: #e542a3 !important;
  }

  .color-4 {
    color: #91ab01 !important;
  }

  .color-5 {
    color: #ffa97a !important;
  }

  .color-6 {
    color: #1f7aec !important;
  }

  .color-7 {
    color: #dfb610 !important;
  }

  .color-8 {
    color: #029d00 !important;
  }

  .color-9 {
    color: #8b7add !important;
  }

  .color-10 {
    color: #fe7c7f !important;
  }

  .color-11 {
    color: #ba33dc !important;
  }

  .color-12 {
    color: #59d368 !important;
  }

  .color-13 {
    color: #b04632 !important;
  }

  .color-14 {
    color: #fd85d4 !important;
  }

  .color-15 {
    color: #8393ca !important;
  }

  .color-16 {
    color: #ff8f2c !important;
  }

  .color-17 {
    color: #3bdec3 !important;
  }

  .color-18 {
    color: #b4876e !important;
  }

  .color-19 {
    color: #c90379 !important;
  }

  .color-20 {
    color: #ef4b4f !important;
  }
  .bg-color-1 {
    background-color: #35cd96 !important;
  }
  .bg-color-2 {
    background-color: #6bcbef !important;
  }

  .bg-color-3 {
    background-color: #e542a3 !important;
  }

  .bg-color-4 {
    background-color: #91ab01 !important;
  }

  .bg-color-5 {
    background-color: #ffa97a !important;
  }

  .bg-color-6 {
    background-color: #1f7aec !important;
  }

  .bg-color-7 {
    background-color: #dfb610 !important;
  }

  .bg-color-8 {
    background-color: #029d00 !important;
  }

  .bg-color-9 {
    background-color: #8b7add !important;
  }

  .bg-color-10 {
    background-color: #fe7c7f !important;
  }

  .bg-color-11 {
    background-color: #ba33dc !important;
  }

  .bg-color-12 {
    background-color: #59d368 !important;
  }

  .bg-color-13 {
    background-color: #b04632 !important;
  }

  .bg-color-14 {
    background-color: #fd85d4 !important;
  }

  .bg-color-15 {
    background-color: #8393ca !important;
  }

  .bg-color-16 {
    background-color: #ff8f2c !important;
  }

  .bg-color-17 {
    background-color: #3bdec3 !important;
  }

  .bg-color-18 {
    background-color: #b4876e !important;
  }
  .bg-color-19 {
    background-color: #c90379 !important;
  }
  .bg-color-20 {
    background-color: #ef4b4f !important;
  }
}
</style>
