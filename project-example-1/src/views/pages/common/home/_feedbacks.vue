<template>
  <div class="feedbacks">
    <div class="sc_title color_style_default sc_title_accent top_line">
      <h1 class="sc_item_title sc_title_title sc_align_center
       sc_item_title_style_accent sc_item_title_tag header">
       Что говорят эти люди про Автоматон</h1>
    </div>

    <swiper :options="swiperOption">
      <swiper-slide v-for="(item, key) in feedbacks" :key="key">
        <div class="sc_testimonials_item">
          <div class="sc_testimonials_item_author_avatar">
            <img
              width="100"
              height="102"
              :alt="item.title"
              class="attachment-trx_addons-thumb-med-avatar
               size-trx_addons-thumb-med-avatar wp-post-image"
              :src="require(`@/views/pages/common/home/images/feedbacks/${key}.jpg`)"
            >
          </div>
          <div class="sc_testimonials_item_content">“ {{ item.text }}</div>
          <div class="sc_testimonials_item_author">
            <div class="sc_testimonials_item_author_data">
              <h4 class="sc_testimonials_item_author_title">{{ item.title }}</h4>
              <div class="sc_testimonials_item_author_subtitle"
               v-if="item.subtitle">{{ item.subtitle }}</div>
            </div>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'HomePageFeedbacks',

  data() {
    return {
      feedbacks: {
        maria: {
          text: 'В Автоматоне меня привлекла возможность создать себе пассивный доход с небольшими вложениями .я не сомневалась 😄.у меня 2 аккаунта хочу ещё потому что понимаю перспективы рекомендую Автоматон всегда и всем))',
          title: 'Мария',
          subtitle: '31 год',
        },
        olga: {
          text: 'Что то новое! И доверилась своей ученице Диане Заировой. И команде молодых людей!! Адам доступно объяснил что, где, когда и что миллионы сразу не обещали. А самое главное что не надо навязывать это никому, приглашать, покупать и покупать...',
          title: 'Олейник Ольга Анатольевна',
          subtitle: 'Учитель математики, 53 года',
        },
        ruslan: {
          text: 'За 2,5 месяца мне поступили 95$. И уверен, что это только начало! На данный момент у меня есть два аккаунта, но я думаю о приобретении еще нескольких аккаунтов.',
          title: 'Руслан Меметов',
        },
      },
      swiperOption: {
        autoplay: {
          delay: 5000,
        },
        breakpoints: {
          768: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          1087: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          1279: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          1472: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          4096: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
        },
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },

  components: {
    swiper,
    swiperSlide,
  },
};
</script>
