<template>
  <div class="webinar">
    <div class="container">
      <h1 class="webinar__title">Что интересного будет на вебинаре?</h1>

      <iframe
        class="webinar__video"
        width="560"
        height="315"
        src="https://www.youtube-nocookie.com/embed/Jej2i-4HdrQ?controls=0"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>

      <p class="webinar__subtitle">Нажми на кнопку и получи ссылку на WhatsApp</p>

      <a
        href="https://bot.automaton.bz/registration/"
        class="button webinar__button"
        size="is-medium"
      >
        <span class="icon">
          <i class="mdi mdi-whatsapp"></i>
        </span>
        <span>Получить ссылку</span>
            
      </a>

      <p class="webinar__agree">
        * Отправляя нам сообщение, вы соглашаетесь
         на получение уведомений на свой WhatsApp
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebinarPage',

  methods: {
    redirect() {
      window.location.href = '';
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.webinar {
  padding: 5rem 0;
  min-height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
  background-image: url(~@/assets/lines.png);

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    background-image:url(~@/assets/lines@2x.png);
  }

  @media (max-width: $desktop) {
    background-image: url(~@/assets/lines-mobile.png);

    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      background-image:url(~@/assets/lines-mobile@2x.png);
    }
  }

  &__title {
    position: relative;
    text-transform: uppercase;
    margin: 0 3rem 2rem;
    font-size: 1.35rem;
    line-height: 1.2;

    &::after {
      content: "";
      width: 70px;
      height: 4px;
      left: 50%;
      bottom: -14px;
      position: absolute;
      background-color: #0000ff;
      transform: translate(-50%, 0);
    }
  }

  &__video {
    height: 315px;
    margin: 0 0 1rem;
    max-width: 100%;

    @media (max-width: $desktop) {
      height: 222px;
    }
  }

  &__subtitle {
    margin: 0 auto 2rem;
    font-size: 0.9rem;
    line-height: 1.3;
    width: 200px;
  }

  &__button {
    background: linear-gradient(to left, #04d7c7, #04d79e);
    box-shadow: 0 3px 0 #04b7a6;
    font-size: 1.25rem;
    padding: 0 2.5rem;
    margin: 0 0 1rem;
    color: #fff;
    border: 0;

    &:focus,
    &.is-focused {
      box-shadow: none;
      color: #fff;
      border: 0;
    }
  }

  &__agree {
    color: rgba(0, 0 ,0, 0.4);
    margin: 0 auto 3rem;
    font-size: 0.7rem;
    width: 250px;
  }
}
</style>
