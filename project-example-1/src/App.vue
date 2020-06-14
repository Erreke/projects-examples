<template>
  <div id="app">
    <div v-if="isNewVersionAvailable" class="notification is-primary new-version-app">
      <p class="new-version-app__content">
        <span class="new-version-app__text">{{ $t('block-global.new-version-is-available') }}</span>
        <button class="button is-primary is-inverted is-rounded" @click="updateApp">
          <span class="icon"><i class="mdi mdi-refresh"></i></span>
          <span>{{ $t('block-global.update-app') }}</span>
        </button>
      </p>
    </div>

    <div class="notification is-info cursobot" v-if="isShowCursobotNotification">
      <button class="delete" @click="closeCursobotNotification"></button>
      <p>Чтобы получить КУРСО-БОТ перейдите по <a href="https://bot.host.com/kursobot/">ссылке в Whatsapp</a> и отправьте готовое сообщение</p>
    </div>

    <router-view :key="$route.fullPath" />

    <debug-board />

    <a
      id="whatsapp"
      href="https://api.whatsapp.com/send?phone=123456"
      title="Написать в WhatsApp"
      class="whatsapp"
      target="_blank"
    >
      Whatsapp
    </a>
  </div>
</template>

<script>
export default {
  name: 'App',

  metaInfo() {
    return {
      title: 'Project-example-1',
      titleTemplate: 'Project-example-1 :: %s',
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    };
  },

  data() {
    return {
      SWRegistration: null,
      isReloadingProcess: false,
      isNewVersionAvailable: false,
      isShowCursobotNotification: false,
    };
  },

  components: {
    DebugBoard: () => import('@/views/blocks/debug-board.vue'),
  },

  methods: {
    showUpdateNotification(e) {
      this.SWRegistration = e.detail;
      this.isNewVersionAvailable = true;
    },

    updateApp() {
      this.isNewVersionAvailable = false;

      if (!this.SWRegistration || !this.SWRegistration.waiting) return;

      this.SWRegistration.waiting.postMessage('skipWaiting');
    },

    closeCursobotNotification() {
      sessionStorage.setItem('isShowCursobotNotification', false);
      this.isShowCursobotNotification = false;
    },

    initCursobotNotification() {
      const isShowCursobot = sessionStorage.getItem('isShowCursobotNotification');

      if (isShowCursobot === null) {
        this.isShowCursobotNotification = true;
      } else {
        this.isShowCursobotNotification = JSON.parse(isShowCursobot);
      }
    },
  },

  created() {
    document.addEventListener('swUpdated', this.showUpdateNotification, { once: true });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.isReloadingProcess) return;

      this.isReloadingProcess = true;

      window.location.reload();
    });

    this.initCursobotNotification();
  },

  watch: {
    $_user(value) {
      if (
        value
        && value.firstName
        && value.secondName
        && value.email
        && value.phone
        && window.jivo_api
      ) {
        window.jivo_api.setContactInfo({
          name: `${value.firstName} ${value.secondName}`,
          email: value.email,
          phone: value.phone,
          description: 'Клиент',
        });
      }
    },
  },
};
</script>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #app {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .darker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 38;
  }

  .cursobot,
  .new-version-app {
    &.notification {
      box-shadow: 0 0 10px rgba(0, 0, 0, .5);
      margin: 0!important;
      position: sticky;
      border-radius: 0;
      z-index: 102;
      top: 0;
    }

    &__content {
      line-height: 2.25rem;
    }

    &__text {
      margin-right: 1rem;
    }
  }

  .cursobot {
    &.notification {
      z-index: 101;
    }
  }

  .whatsapp {
    position: fixed;
    cursor: pointer;
    z-index: 100002;
    right: 2em;
    bottom: 2em;
    width: 3em;
    height: 3em;
    line-height: 3em;
    font-size: 16px;
    overflow: hidden;
    transition: all .5s ease;
    background-image: url('~@/assets/whatsapp.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    text-indent: -1000%;

    @media (max-width: 1679px) {
      font-size: 14px;
    }

    @media (max-width: 1279px) {
      font-size: 13px;
    }

    @media (max-width: 768px) {
      font-size:13px;
    }

    @media (max-width: 479px) {
      font-size: 13px;
    }
  }
</style>
