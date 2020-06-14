/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as Sentry from '@sentry/browser';

import '@/utils/firebase/init';

import createApp from '@/app';
import createRouter from '@/router';
import createStore from '@/store';
import createI18n from '@/i18n';
import progressBar from '@/views/blocks/progress-bar.vue';

let isRouterHooksInited = false;
let app;

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: '',
    integrations: [new Sentry.Integrations.Vue({ Vue })],
  });
}

// global progress bar
Vue.prototype.$bar = new Vue(progressBar).$mount();
const bar = Vue.prototype.$bar;
document.body.appendChild(bar.$el);

bar.start();

const router = createRouter();
const store = createStore();
const i18n = createI18n();

async function tryToAuth(user) {
  if (user) {
    await store.dispatch('user/INIT_USER', user);
  }
}

async function loadI18nMessagesAsync(lang, domainName) {
  const messages = await import(/* webpackChunkName: "lang-[request]" */ `@/i18n/${domainName}.${lang}.json`);

  return messages.default;
}

async function loadVuexModuleAsync(moduleName) {
  const vuexModule = await import(/* webpackChunkName: "vuex-module-[request]" */ `@/store/modules/${moduleName}/index.js`);

  return vuexModule.default;
}

function initRouterHooks() {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!firebase.auth().currentUser;
    const isForbiddenArea = to.matched.some(record => record.meta.isForbiddenArea);
    const isAdminArea = to.matched.some(record => record.meta.isAdminArea);
    const isUserArea = to.matched.some(record => record.meta.isClientArea);

    const isAdmin = (store.state.user
                  && store.state.user.profile
                  && store.state.user.profile.isAdmin) || false;

    const isClient = store.state.user
                  && store.state.user.profile
                  && !store.state.user.profile.isAdmin;

    const isAnonAttemptsAccessToForbiddenArea = !isAuthenticated && isForbiddenArea;
    const isAdminAttemptsAccessToUserArea = isAuthenticated && isAdmin && isUserArea;
    const isUserAttemptsAccessToAdminArea = isAuthenticated && isClient && isAdminArea;

    if (isAnonAttemptsAccessToForbiddenArea) {
      next({ name: 'home' });
    } else if (isAdminAttemptsAccessToUserArea) {
      next({ name: 'admin-clients' });
    } else if (isUserAttemptsAccessToAdminArea) {
      next({ name: 'dashboard' });
    } else {
      next();
    }
  });

  router.afterEach((to) => {
    if (to.matched.some(record => record.meta.isForbiddenArea)) {
      store.commit('interface/TOGGLE_SIDEBAR_ACTIVE_STATE', false);
    }
  });

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;

    const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));

    const localeAndVuexLoaders = [];

    const pageName = to.name;
    const domainName = `page-${pageName}`;
    const lang = i18n.locale;
    const isLocaleLoaded = !!i18n.messages[lang][domainName];

    if (!isLocaleLoaded) {
      const loadI18nMessages = loadI18nMessagesAsync(lang, domainName)
        .then((messages) => {
          i18n.mergeLocaleMessage(lang, {
            [domainName]: messages,
          });
        });

      localeAndVuexLoaders.push(loadI18nMessages);
    }

    activated.forEach((component) => {
      if (component.usedVuexModules) {
        component.usedVuexModules.forEach((moduleName) => {
          const isModuleLoaded = !!store._modules.root._children[moduleName];

          if (!isModuleLoaded) {
            const loadVuexModule = loadVuexModuleAsync(moduleName)
              .then((vuexModule) => {
                store.registerModule(moduleName, vuexModule);

                if (Array.isArray(vuexModule.plugins)) {
                  vuexModule.plugins.forEach((vuexModulePlugin) => {
                    vuexModulePlugin(store);
                  });
                }
              });

            localeAndVuexLoaders.push(loadVuexModule);
          }
        });
      }
    });

    if (localeAndVuexLoaders.length) {
      return Promise.all(localeAndVuexLoaders)
        .then(() => {
          bar.finish();
          return next();
        });
    }

    bar.finish();
    return next();
  });

  isRouterHooksInited = true;
}

function unregisterVuexModules() {
  const staticModules = ['interface', 'auth', 'user', 'business-place'];
  const registeredModules = Object.keys(store._modules.root._children);
  const modulesForUnregister = registeredModules.filter(x => !staticModules.includes(x));

  modulesForUnregister.forEach((module) => {
    store.unregisterModule(module);
  });
}

function unMergeI18nMessages() {
  const i18nLangs = Object.keys(i18n.messages);

  i18nLangs.forEach((lang) => {
    const domains = Object.keys(i18n.messages[lang]).filter(x => !x.includes('block-') && !x.includes('page-home'));

    domains.forEach((domain) => {
      delete i18n.messages[lang][domain];
    });
  });
}

function moveWhatsappAndToTopScroller(state) {
  setTimeout(() => {
    const label = document.getElementById('jvlabelWrap');
    const content = document.getElementById('jcont');

    if (label && content) {
      const element = state === 'chat' ? content : label;
      const height = element.getBoundingClientRect().height;
      const whatsapp = document.getElementById('whatsapp');
      const scrollToTop = document.getElementById('scrollToTop');

      if (whatsapp) {
        whatsapp.style.bottom = `${height + 20}px`;
      }

      if (scrollToTop) {
        scrollToTop.style.bottom = `${height + 90}px`;
      }
    }
  }, 0);
}

function handleUserSignOut() {
  unregisterVuexModules();
  unMergeI18nMessages();
}

function handleJivoSiteLoad() {
  const { profile } = store.state.user;

  if (profile) {
    window.jivo_api.setContactInfo({
      name: `${profile.firstName} ${profile.secondName}`,
      email: profile.email,
      phone: profile.phone,
      description: 'Клиент',
    });
  }
}

function handleJivoSiteResize() {
  moveWhatsappAndToTopScroller('chat');
}

function handleJivoSiteStateChange(e) {
  moveWhatsappAndToTopScroller(e.detail.state);
}

document.addEventListener('userSignedOut', handleUserSignOut);

document.addEventListener('jivoSiteLoaded', handleJivoSiteLoad);
document.addEventListener('jivoSiteResized', handleJivoSiteResize);
document.addEventListener('jivoSiteChangedState', handleJivoSiteStateChange);

firebase.auth()
  .onAuthStateChanged(user => tryToAuth(user)
    .then(() => {
      if (!isRouterHooksInited) initRouterHooks();

      if (!app) {
        app = createApp(router, store, i18n);
        app.$mount('#app');
      }

      bar.finish();
    })
    .catch((error) => {
      console.log('error.message', error.message);
      console.log('error.code', error.code);
      console.log('error', error);
    }));
