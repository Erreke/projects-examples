<template>
<div class="vc_row wpb_row vc_row-fluid wpb_animate_when_almost_visible
 fadeIn wpb_start_animation animated faq">
  <div class="wpb_column vc_column_container vc_col-sm-12 sc_layouts_column_icons_position_left">
    <div class="vc_column-inner">
      <div class="wpb_wrapper">
        <div class="sc_title color_style_default sc_title_accent">
          <h1 class="sc_item_title sc_title_title sc_align_center
           sc_item_title_style_accent sc_item_title_tag header">Вопросы-ответы</h1>
        </div>
        <div class="vc_row wpb_row vc_inner vc_row-fluid">
          <div class="wpb_column vc_column_container vc_col-sm-6
           sc_layouts_column_icons_position_left">
            <div class="vc_column-inner">
              <div class="wpb_wrapper">
                <div class="vc_tta-container">
                  <div class="vc_general vc_tta vc_tta-accordion vc_tta-color-grey
                   vc_tta-style-classic vc_tta-shape-rounded vc_tta-o-shape-group
                    vc_tta-controls-align-left">
                    <div class="vc_tta-panels-container">
                      <div class="vc_tta-panels">
                        <faq-item
                          v-for="(item, key) in fisrtQuestions"
                          :key="key"
                          :question="item.question"
                          :answer="item.answer"
                          :current-key="key"
                          :active-key="activeInFirstGroup"
                          :is-question-opened="isQuestionOpenedInFirstGroup"
                          @change="setActiveInFirstGroup"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="wpb_column vc_column_container vc_col-sm-6
           sc_layouts_column_icons_position_left">
            <div class="vc_column-inner">
              <div class="wpb_wrapper">
                <div class="vc_tta-container">
                  <div class="vc_general vc_tta vc_tta-accordion vc_tta-color-grey
                   vc_tta-style-classic vc_tta-shape-rounded vc_tta-o-shape-group
                    vc_tta-controls-align-left">
                    <div class="vc_tta-panels-container">
                      <div class="vc_tta-panels">
                        <faq-item
                          v-for="(item, key) in secondQuestions"
                          :key="key"
                          :question="item.question"
                          :answer="item.answer"
                          :current-key="key"
                          :active-key="activeInSecondGroup"
                          :is-question-opened="isQuestionOpenedInSecondGroup"
                          @change="setActiveInSecondGroup"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import FaqItem from './_faq-item.vue';

export default {
  name: 'HomePageFaq',

  components: {
    FaqItem,
  },

  data() {
    return {
      activeInFirstGroup: -1,
      activeInSecondGroup: -1,
      isQuestionOpenedInFirstGroup: false,
      isQuestionOpenedInSecondGroup: false,
      fisrtQuestions: [
        {
          question: 'How can I purchase tokens?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'What is a Hoverex Token (HVR)?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'When and how shall I receive purchased tokens?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'What is the minimum token purchase amount?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'What interest rate will the platform provide?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
      ],
      secondQuestions: [
        {
          question: 'What are the benefits of buying HVR coins?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'When and on which exchanges will the HVR token be listed?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'Can I purchase tokens using a credit card?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'What wallet do I need to store HVR coins?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
        {
          question: 'Are there any extra bonuses for large investors?',
          answer: 'Nunc cursus augue ut massa aliquam, sit amet euismod ligula hendrerit. Quisque finibus nulla erat, sed sagittis tellus est finibus sed. Pellentesque lacus, aliquam turpis eget, accumsan malesuada risus. Integer imperdiet erat tellus, non elementum odio sollicitudin at.',
        },
      ],

    };
  },

  methods: {
    setActive(type, value) {
      if (this[`activeIn${type}Group`] === value) {
        this[`isQuestionOpenedIn${type}Group`] = !this[`isQuestionOpenedIn${type}Group`];
      } else {
        this[`isQuestionOpenedIn${type}Group`] = true;
      }

      this[`activeIn${type}Group`] = value;
    },

    setActiveInFirstGroup(value) {
      this.setActive('First', value);
    },

    setActiveInSecondGroup(value) {
      this.setActive('Second', value);
    },
  },
};
</script>
