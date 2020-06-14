
const errorsRU = require('./i18n/block-errors.ru.json');
const enrollToWebinarPageRU = require('./i18n/page-enroll-to-webinar.ru.json');
const webinarRecordingPageEN = require('./i18n/page-webinar-recording.en.json');

const errorsEN = require('./i18n/block-errors.en.json');
const enrollToWebinarPageEN = require('./i18n/page-enroll-to-webinar.en.json');
const webinarRecordingPageRU = require('./i18n/page-webinar-recording.ru.json');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Automaton',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Automaton' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "stylesheet", href: "https://cdn.materialdesignicons.com/5.0.45/css/materialdesignicons.css", crossorigin: "anonymous" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bulma@0.8.1/css/bulma.min.css", crossorigin: "anonymous" }
    ],
    script: [
      {
        src: '/pixel.js',
        body: true,
      },
      {
        src: '/ym.js',
        body: true,
      },
    ],
    noscript: [
      {
        innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=497865697521309&ev=PageView&noscript=1" />',
        body: true,
      },
      {
        innerHTML: '<img src="https://mc.yandex.ru/watch/56816047" style="position:absolute; left:-9999px;" alt="" />',
        body: true,
      }
    ],
    __dangerouslyDisableSanitizers: [
      'noscript'
    ],
  },
  modules: [
    'nuxt-buefy',
    [
      'nuxt-i18n',
      {
        strategy: 'no_prefix',
        locales: ['ru'],
        defaultLocale: 'ru',
        vueI18n: {
          fallbackLocale: 'ru',
          messages: {
            ru: {
              'block-errors': errorsRU,
              'page-enroll-to-webinar': enrollToWebinarPageRU,
              'page-webinar-recording': webinarRecordingPageRU,
            },
            en: {
              'block-errors': errorsEN,
              'page-enroll-to-webinar': enrollToWebinarPageEN,
              'page-webinar-recording': webinarRecordingPageEN,
            },
          }
        }
      }
    ]
  ],
  plugins: [
    {
      src: '~/plugins/vuelidate'
    }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  server: {
    port: 8080, // default: 3000
  }
}

