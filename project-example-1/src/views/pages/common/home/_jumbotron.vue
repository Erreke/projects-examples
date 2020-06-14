<template>
<div class="wpb_animate_when_almost_visible fadeIn wpb_start_animation animated jumbotron">
  <div class="jumbotron__header">
    <h1 class="jumbotron__title header" v-html="title"></h1>
    <p class="jumbotron__subtitle" v-html="subtitle1"></p>
    <p class="jumbotron__subtitle" v-html="subtitle2"></p>
  </div>
  <div class="home__df-jc">
    <div class="home__w-50">
      <sign-up-for-webinar
        text="Запишись на ближайшую онлайн демонстрацию сервиса"
      />
    </div>
  </div>
</div>
</template>

<script>
import SignUpForWebinar from './_sign-up-for-webinar.vue';

export default {
  name: 'HomePageJumbotron',

  components: {
    SignUpForWebinar,
  },

  data() {
    return {
      title: 'Онлайн сервис, который&nbsp;позволяет увеличить&nbsp;эффективность Вашего бизнеса!',
      subtitle1: 'Эффективность в работе с партнерами, сайтами, сервисами и мобильными приложениями за счет автоматизации более 90% бизнес процессов.',
      subtitle2: 'Детализация бизнес процессов, благодаря чему на нашей платформе можете вести базу своих партнеров и в автоматическом режиме мониторить статусы. Получать аналитику и коммуницировать.',
    };
  },
};
</script>
