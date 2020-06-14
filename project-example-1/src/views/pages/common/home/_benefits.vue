<template>
  <div class="benefit">
    <b-modal :active.sync="isVideoActive" has-modal-card>
      <div :style="`width: ${popupWidth}px; height: ${popupHeight}px;`" class="modal-card">
        <iframe :width="popupWidth" :height="popupHeight" src="https://www.youtube-nocookie.com/embed/Y1ui8ZYUZpw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </b-modal>

    <div class="sc_title color_style_default sc_title_accent">
      <h1 class="sc_item_title sc_title_title sc_align_center sc_item_title_style_accent
     sc_item_title_tag header">Что такое Автоматон и как он работает</h1>
    </div>

    <div class="benefit__video">
      <figure>
        <a @click.prevent="openVideo" href="#popup_video">
          <img width="120" height="120" src="./images/play.png" alt="">
        </a>
      </figure>
    </div>

    <div class="benefit__desc">
      <div class="benefit__items sc_icons sc_icons_modern sc_icons_size_medium sc_align_center">
        <div class="sc_icons_columns_wrap sc_item_columns
         trx_addons_columns_wrap columns_padding_bottom">
          <div class="trx_addons_column-1_2" v-for="(item, key) in benefits" :key="key">
            <div class="sc_icons_item">
              <div :class="['sc_icons_icon sc_icon_type_', item.class]">
                <span :class="['sc_icon_type_', item.class]"></span>
              </div>
              <h4 class="sc_icons_item_title">
                <span v-html="item.text"></span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div class="benefit__subscribe sc_title color_style_default sc_title_default">
        <h1 class="sc_item_title sc_title_title sc_align_left sc_item_title_style_default
        sc_item_title_tag header">Успей на вебинар</h1>
        <sign-up-for-webinar
          text="На вебинаре вы детально узнаете, что такое Автоматон, как это работает, сколько это стоит, какую прибыль приносит и многое другое. Также будет много полезной и познавательной информации, бонусы, подарки, розыгрыш среди участников вебинара."
          text-align="left"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SignUpForWebinar from './_sign-up-for-webinar.vue';

export default {
  name: 'HomePageBenefits',

  data() {
    return {
      isVideoActive: false,
      benefits: [
        {
          text: 'Это онлайн платформа, поэтому доступна с любого устройства в любой точке мира',
          class: 'icon-18-global',
        },
        {
          text: 'Безопасность. Конфиденциальность данных пользователей',
          class: 'icon-21-reliable',
        },
        {
          text: 'Отличный инструмент для поиска партнёров и работы с реферальными программами',
          class: 'icon-19-partner',
        },
      ],
    };
  },

  computed: {
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

  components: {
    SignUpForWebinar,
  },

  methods: {
    openVideo() {
      this.isVideoActive = true;
    },
  },
};
</script>
