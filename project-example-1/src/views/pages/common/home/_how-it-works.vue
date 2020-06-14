<template>
  <!-- <div class="how">
    <div class="sc_title color_style_default sc_title_accent">
      <h1 class="sc_item_title sc_title_title sc_align_center
       sc_item_title_style_accent sc_item_title_tag header">Как это работает</h1>
    </div>

    <iframe :width="frameWidth" :height="frameHeight" src="https://www.youtube-nocookie.com/embed/87UG8UiC1lQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div> -->

  <div class="vc_row wpb_row vc_row-fluid wpb_animate_when_almost_visible
   fadeIn vc_row-has-fill hide_bg_image_on_mobile wpb_start_animation animated how-it-works">

    <b-modal :active.sync="isVideoActive" has-modal-card>
      <div :style="`width: ${popupWidth}px; height: ${popupHeight}px;`" class="modal-card">
        <iframe :width="popupWidth" :height="popupHeight" src="https://www.youtube-nocookie.com/embed/87UG8UiC1lQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </b-modal>

    <div class="sc_title color_style_default sc_title_accent">
      <h1 class="sc_item_title sc_title_title sc_align_center
       sc_item_title_style_accent sc_item_title_tag header">Как это работает</h1>
    </div>

    <div class="how-it-works__graph">
      <p class="how-it-works__graph-instime">С одной стороны есть платформа INSTIME которая
         продает онлайн услуги и предлагает воспользоваться партнерской программой,
         где за рекомендации начисляется % с продаж (сетевой маркетинг - тернар)</p>
      <p class="how-it-works__graph-automaton">С другой стороны есть сервис AUTOMATON который,
         используя вашу реферальную ссылку, продает услуги INSTIME без вашего участия</p>
      <p class="how-it-works__graph-people">А с третьей стороны есть ВЫ как партнер платформы
         INSTIME и как заказчик услуг у сервиса AUTOMATON</p>
      <p class="how-it-works__graph-result">В итоге вы получаете готовый под ключ онлайн
         бизнес, который работает на полном автомате</p>
    </div>

    <div class="how-it-works__video">
      <figure>
        <a @click.prevent="openVideo" href="#popup_video">
          <img width="120" height="120" src="./images/play.png" alt="">
        </a>
      </figure>
    </div>

    <div class="how-it-works__webinar">
      <div class="home__df-jc">
        <div class="home__w-50">
          <sign-up-for-webinar
            text="Подробности на сегодняшнем онлайн-вебинаре,<br> успей записаться"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignUpForWebinar from './_sign-up-for-webinar.vue';

export default {
  name: 'HomePageHowItWorks',

  components: {
    SignUpForWebinar,
  },

  data() {
    return {
      isVideoActive: false,
    };
  },

  computed: {
    frameWidth() {
      if (this.$_device === 'mobile') return this.$_screenWidth - 10;
      if (this.$_device === 'tablet') return this.$_screenWidth - 30;

      return 1130;
    },

    frameHeight() {
      const ratio = 1.77777777777778;

      return Math.ceil(this.frameWidth / ratio);
    },

    popupWidth() {
      if (this.$_device === 'mobile') return this.$_screenWidth - 10;
      if (this.$_device === 'tablet') return this.$_screenWidth - 30;

      return 960;
    },

    popupHeight() {
      const ratio = 1.77777777777778;

      return Math.ceil(this.popupWidth / ratio);
    },
  },

  methods: {
    openVideo() {
      this.isVideoActive = true;
    },
  },
};
</script>
