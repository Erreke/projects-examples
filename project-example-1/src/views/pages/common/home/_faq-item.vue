<template>
  <div :class="['vc_tta-panel vc_animating', { 'vc_active': isActive }]">
    <div class="vc_tta-panel-heading">
      <h4 class="vc_tta-panel-title vc_tta-controls-icon-position-right">
        <a href="#" @click.prevent="$emit('change', currentKey)">
          <span class="vc_tta-title-text">{{ question }}</span>
          <i class="vc_tta-controls-icon vc_tta-controls-icon-chevron"></i>
        </a>
      </h4>
    </div>
    <div class="vc_tta-panel-body">
      <div class="wpb_text_column wpb_content_element">
        <div class="wpb_wrapper">
          <p>{{ answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageFaqItem',

  props: {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    currentKey: {
      type: Number,
      required: true,
    },
    activeKey: {
      type: Number,
      required: true,
    },
    isQuestionOpened: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    isActive() {
      return this.isQuestionOpened && this.currentKey === this.activeKey;
    },
  },
};
</script>
