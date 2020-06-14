import Vue from 'vue';
import VueI18n from 'vue-i18n';

import errorsEN from './block-errors.en.json';
import globalEN from './block-global.en.json';
import initialPasswordChangerEN from './block-initial-password-changer.en.json';
import authEN from './block-auth.en.json';
import loaderEN from './block-loader.en.json';
import navigationEN from './block-navigation.en.json';
import transactionFormEN from './block-transaction-form.en.json';
import transferDialogEN from './block-transfer-dialog.en.json';
import withdrawalDialogEN from './block-withdrawal-dialog.en.json';
import fillAllDataAlertEN from './block-fill-all-data-alert.en.json';
import homePageEN from './page-home.en.json';

import errorsRU from './block-errors.ru.json';
import globalRU from './block-global.ru.json';
import initialPasswordChangerRU from './block-initial-password-changer.ru.json';
import authRU from './block-auth.ru.json';
import loaderRU from './block-loader.ru.json';
import navigationRU from './block-navigation.ru.json';
import transactionFormRU from './block-transaction-form.ru.json';
import transferDialogRU from './block-transfer-dialog.ru.json';
import withdrawalDialogRU from './block-withdrawal-dialog.ru.json';
import fillAllDataAlertRU from './block-fill-all-data-alert.ru.json';
import homePageRU from './page-home.ru.json';

Vue.use(VueI18n);

const messages = {
  en: {
    'block-errors': errorsEN,
    'block-global': globalEN,
    'block-initial-password-changer': initialPasswordChangerEN,
    'block-auth': authEN,
    'block-loader': loaderEN,
    'block-navigation': navigationEN,
    'block-transaction-form': transactionFormEN,
    'block-transfer-dialog': transferDialogEN,
    'block-withdrawal-dialog': withdrawalDialogEN,
    'block-fill-all-data-alert': fillAllDataAlertEN,
    'page-home': homePageEN,
  },
  ru: {
    'block-errors': errorsRU,
    'block-global': globalRU,
    'block-initial-password-changer': initialPasswordChangerRU,
    'block-auth': authRU,
    'block-loader': loaderRU,
    'block-navigation': navigationRU,
    'block-transaction-form': transactionFormRU,
    'block-transfer-dialog': transferDialogRU,
    'block-withdrawal-dialog': withdrawalDialogRU,
    'block-fill-all-data-alert': fillAllDataAlertRU,
    'page-home': homePageRU,
  },
};

let i18n;

export default function createI18n() {
  if (!i18n) {
    i18n = new VueI18n({
      locale: localStorage.getItem('lang') || 'ru',
      messages,
    });
  }

  return i18n;
}
