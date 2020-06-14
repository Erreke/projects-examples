<template>
  <div>
    <div class="business-buy__selected-package">
      <div :class="[
        'business-buy__selected-package-name',
        { 'has-discount' : hasDiscount }
      ]">
        <p v-html="$t('page-business.selected-package', {
          package: selectedPackageName
        })"></p>
      </div>

      <div :class="[
        'business-buy__selected-package-regular-price',
        { 'has-discount' : hasDiscount }
      ]">
        <p v-if="hasDiscount" v-html="$t('page-business.package-price-old', {
          price: packageRegularPrice
        })"></p>
        <p v-else v-html="$t('page-business.package-price', {
          price: packageRegularPrice
        })"></p>
      </div>

      <div v-if="hasDiscount" :class="[
        'business-buy__selected-package-discounted-price',
        { 'has-discount' : hasDiscount }
      ]">
        <p v-html="$t('page-business.package-price-discounted', {
          price: packageDiscountedPrice
        })"></p>
      </div>
    </div>

    <div class="business-buy__items">
      <div class="business-buy__item">
        <div class="business-buy__item-top-logo-title" data-company="automaton">
          <h2 class="business-buy__item-top-title">Project-example-1</h2>
          <img
            data-company="automaton"
            class="business-buy__item-top-logo"
            src="@/assets/logo-white.svg"
          >
        </div>

        <div class="business-buy__item-offer">
          <!--
            <div class="business-buy__item-offer-content content">
              OFFER
            </div>
          -->

          <div class="business-buy__item-desc">
            <div class="content">
              <p>Аутсорсинг и автоматизация бизнес-процессов:</p>
              <ol>
                <li>анализ рынка и аудитории;</li>
                <li>поиск или создание потенциальных клиентов;</li>
                <li>установка контакта с клиентами;</li>
                <li>утепление и поддержание с клиентами отношений;</li>
                <li>переговоры с потенциальными клиентами;</li>
                <li>профессиональные онлайн презентации;</li>
                <li>регистрация новых клиентов по реферальной ссылке;</li>
                <li>продажа товара или услуги;</li>
                <li>конвертация пользователя в активного партнера;</li>
                <li>работа в глубину с реферальной системой.</li>
              </ol>
            </div>
          </div>

          <b-switch
            v-if="!isAttemptedToPay && !selectedPackagePurchased"
            v-model="isAgree"
            :disabled="isAttemptingToPay"
          >
            <span v-html="$t('page-business.agree')"></span>
          </b-switch>

          <div v-else-if="!selectedPackagePurchased">
            <p>Если вы случайно закрыли окно оплаты, можно по этой ссылке <a :href="selectedPackagePaymentUrl" target="_blank">Оплатить</a></p>
          </div>
        </div>
        <div class="business-buy__item-details" data-company="automaton">
          <div class="business-buy__item-bottom-logo-title">
            <h2 class="business-buy__item-bottom-title">Project-example-1</h2>
            <img
              data-company="automaton"
              class="business-buy__item-bottom-logo"
              src="@/assets/logo-white.svg"
            >
          </div>

          <p class="business-buy__item-price">
            {{ $t('page-business.service-price', {
              price: automatonPrice
            }) }}
          </p>

          <b-button
            v-if="!isAttemptedToPay && !selectedPackagePurchased"
            type="is-success"
            class="business-buy__item-buy"
            :loading="isAttemptingToPay"
            :disabled="!isAgree || isAttemptingToPay"
            @click="openPaymentUrl"
          >
            {{ $t('page-business.pay') }}
          </b-button>

          <div v-else-if="!selectedPackagePurchased">
            <p class="business-buy__item-waiting">Ждём оплату из банка</p>
            <b-button
              type="is-success"
              class="business-buy__item-waiting-update"
              :loading="isPaymentInfoChecking"
              :disabled="isPaymentInfoChecking"
              @click.prevent="checkPaymentInfo(selectedPackageId)"
            >
              Обновить
            </b-button>
          </div>

          <div class="business-buy__item-purchased" v-else>
            Куплен
          </div>
        </div>
      </div>

      <div class="business-buy__item">
        <div class="business-buy__item-top-logo-title" data-company="instime">
          <h2 class="business-buy__item-top-title">Instime</h2>
          <img
            data-company="instime"
            class="business-buy__item-top-logo"
            src="@/assets/instime-logo-white.svg"
          >
        </div>

        <div class="business-buy__item-offer">
          <!--
            <div class="business-buy__item-offer-content content">
              OFFER
            </div>
          -->
          <div class="business-buy__item-desc">
            <div class="content">
              <p>Сервис для эффективного продвижения и монетизации вашего Instagram аккаунта:</p>
              <ol>
                <li>лайки;</li>
                <li>комментарии;</li>
                <li>просмотры;</li>
                <li>сохранения;</li>
                <li>подписки;</li>
                <li>масслукинг;</li>
                <li>интеллект;</li>
                <li>реферальная программа.</li>
              </ol>
              <hr>
              <p><i>Инструменты сервиса:</i></p>
              <ul>
                <li><i>Повышайте активность своей страницы, оставляя и получая лайки, комментарии, сохранения.</i></li>
                <li><i>Приумножьте охват ваших публикаций, настроив массовый просмотр Stories.</i></li>
                <li><i>Используйте максимально эффективное органическое продвижение вашего аккаунта.</i></li>
              </ul>
            </div>
          </div>

          <b-switch
            v-if="!isAttemptedToPayInstime && !selectedPackageInstimePurchased"
            v-model="isAgreeByInstime"
            :disabled="isAttemptingToPayInstime"
          >
            <span v-html="$t('page-business.agree-by-instime')"></span>
          </b-switch>

          <div v-else-if="!selectedPackageInstimePurchased">
            <p>Если вы случайно закрыли окно оплаты, можно по этой ссылке <a :href="selectedPackageInstimePaymentUrl" target="_blank">Оплатить</a></p>
          </div>
        </div>
        <div class="business-buy__item-details" data-company="instime">
          <div class="business-buy__item-bottom-logo-title">
            <h2 class="business-buy__item-bottom-title">Instime</h2>
            <img
              data-company="instime"
              class="business-buy__item-bottom-logo"
              src="@/assets/instime-logo-white.svg"
            >
          </div>

          <p class="business-buy__item-price">
            {{ $t('page-business.service-price', {
              price: instimePrice
            }) }}
          </p>

          <b-button
            v-if="!isAttemptedToPayInstime && !selectedPackageInstimePurchased"
            type="is-success"
            class="business-buy__item-buy"
            :loading="isAttemptingToPayInstime"
            :disabled="!isAgreeByInstime || isAttemptingToPayInstime"
            @click="openInstimePaymentUrl"
          >
            {{ $t('page-business.pay') }}
          </b-button>

          <div v-else-if="!selectedPackageInstimePurchased">
            <p class="business-buy__item-waiting">Ждём оплату от Instime</p>
            <p class="business-buy__item-waiting-countdown" v-if="!isUpdateButtonShowed">
              <simple-count-down
                v-if="isAttemptedToPayInstime"
                :interval="120"
                :is-auto-start="true"
                :is-time-to-start="isTimeToStartCountDown"
                @start="handleCountDownStart"
                @done="handleCountDownStop"
              />
            </p>
            <b-button
              v-else
              type="is-success"
              class="business-buy__item-waiting-update"
              :loading="isInstimePaymentInfoChecking"
              :disabled="isInstimePaymentInfoChecking"
              @click.prevent="checkInstimePayment"
            >
              Обновить
            </b-button>
          </div>

          <div class="business-buy__item-purchased" v-else>
            Куплен
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { INSTIME_PRICE, PAYMENT_URL } from '@/config';

export default {
  name: 'BusinessPageBuying',

  props: {
    hasDiscount: {
      type: Boolean,
      required: true,
    },

    isAttemptedToPay: {
      type: Boolean,
      required: true,
    },

    isAttemptedToPayInstime: {
      type: Boolean,
      required: true,
    },

    selectedPackagePurchased: {
      type: Boolean,
      required: true,
    },

    selectedPackageInstimePurchased: {
      type: Boolean,
      required: true,
    },

    selectedPackageId: {
      type: String,
      required: true,
    },

    selectedPackageName: {
      type: String,
      required: true,
    },

    selectedPackageInstimePaymentUrl: {
      type: String,
      required: true,
    },

    selectedRegularPrice: {
      type: Number,
      required: true,
    },

    selectedDiscountedPrice: {
      type: Number,
      required: true,
    },
  },

  components: {
    SimpleCountDown: () => import('@/views/blocks/simple-count-down.vue'),
  },

  data() {
    return {
      isAgree: false,
      isAgreeByInstime: false,
      isTimeToStartCountDown: false,
      isUpdateButtonShowed: false,
    };
  },

  computed: {
    ...mapState('business-place', [
      'isAttemptingToPay',
      'isAttemptingToPayInstime',
      'isPaymentInfoChecking',
      'isInstimePaymentInfoChecking',
    ]),

    instimePrice() {
      return this.$options.filters.currency_format(INSTIME_PRICE);
    },

    automatonPrice() {
      return this.$options.filters.currency_format(this.selectedPrice - INSTIME_PRICE);
    },

    packageRegularPrice() {
      return this.$options.filters.currency_format(this.selectedRegularPrice);
    },

    packageDiscountedPrice() {
      return this.$options.filters.currency_format(this.selectedDiscountedPrice);
    },

    selectedPrice() {
      return this.hasDiscount
        ? this.selectedDiscountedPrice
        : this.selectedRegularPrice;
    },

    selectedPackagePaymentUrl() {
      return PAYMENT_URL;
    },
  },

  methods: {
    ...mapActions('business-place', {
      attemptToPay: 'ATTEMPT_TO_PAY_AUTOMATON',
      attemptToPayInstime: 'ATTEMPT_TO_PAY_INSTIME',
      checkPaymentInfo: 'CHECK_AUTOMATON_PAYMENT_INFO',
      checkInstimePaymentInfo: 'CHECK_INSTIME_PAYMENT_INFO',
    }),

    checkInstimePayment() {
      this.checkInstimePaymentInfo(this.selectedPackageId)
        .then(() => {
          this.isTimeToStartCountDown = true;
          this.isUpdateButtonShowed = false;
        });
    },

    openPaymentUrl() {
      this.attemptToPay(this.selectedPackageId)
        .then(() => {
          window.open(this.selectedPackagePaymentUrl, '_blank');
        });
    },

    openInstimePaymentUrl() {
      this.attemptToPayInstime(this.selectedPackageId)
        .then(() => {
          window.open(this.selectedPackageInstimePaymentUrl, '_blank');
        });
    },

    handleCountDownStart() {
      this.isTimeToStartCountDown = false;
      this.isUpdateButtonShowed = false;
    },

    handleCountDownStop() {
      this.isUpdateButtonShowed = true;
    },
  },

  watch: {
    isAttemptedToPayInstime(value) {
      if (value) {
        this.isTimeToStartCountDown = true;
        this.isUpdateButtonShowed = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.business-buy {
  &__selected-package {
    display: flex;
    margin-top: 1rem;

    @media (max-width: $tablet) {
      display: block;
    }

    &-name,
    &-regular-price,
    &-discounted-price {
      padding: 2rem;
      margin: 0 1rem;
      border-radius: 6px;

      p,
      strong {
        color: #fff;
        font-size: 1.5rem;
      }
    }

    &-name {
      margin: 0 1rem 0 0;
      flex: 0 0 calc(50% - 1rem);
      background-color: #2f4554;

      @media (max-width: $tablet) {
        margin: 1rem 0;
      }

      &.has-discount {
        flex: 0 0 calc(33.3333% - 1rem);
      }
    }

    &-regular-price {
      margin: 0 0 0 1rem;
      flex: 0 0 calc(50% - 1rem);
      background-color: #517786;

      @media (max-width: $tablet) {
        margin: 1rem 0;
      }

      &.has-discount {
        margin: 0 1rem;
        flex: 0 0 calc(33.3333% - 2rem);

        @media (max-width: $tablet) {
          margin: 1rem 0;
        }
      }
    }

    &-discounted-price {
      margin: 0 0 0 1rem;
      flex: 0 0 calc(33.3333% - 1rem);
      background-color: #609fa7;

      @media (max-width: $tablet) {
        margin: 1rem 0;
      }
    }
  }

  &__items {
    display: flex;

    @media (max-width: 1400px) {
      display: block;
    }
  }

  &__item {
    flex: 0 0 calc(50% - 1rem);
    margin: 3rem 1rem 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    border-radius: 5px;
    overflow: hidden;
    display: flex;

    @media (max-width: 1400px) {
      margin: 3rem 0 0;
    }

    @media (max-width: $tablet) {
      display: block;
    }

    &:last-child {
      margin: 3rem 0 0 1rem;

       @media (max-width: 1400px) {
        margin: 1rem 0 3rem;
      }
    }

    &-offer {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 0 0 70%;
      padding: 2rem;

      &-content {
        height: 500px;
        overflow: scroll;
        padding-right: 1rem;
      }
    }

    &-desc {
      padding-bottom: 4rem;

      @media (max-width: $tablet) {
        min-height: 200px;
      }
    }

    &-details {
      flex: 0 0 30%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      color: #fff;

      &[data-company="automaton"] {
        background-color: #517786;
      }

      &[data-company="instime"] {
        background-color: #609fa7;
      }
    }

    &-top-logo-title {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      color: #fff;

      &[data-company="automaton"] {
        background-color: #517786;
      }

      &[data-company="instime"] {
        background-color: #609fa7;
      }

      @media (max-width: $tablet) {
        display: flex;
      }
    }

    &-bottom-logo-title {
      display: block;

      @media (max-width: $tablet) {
        display: none;
      }
    }

    &-top-title {
      font-size: 1.7rem;
      padding: 1rem 0 0;
    }

    &-top-logo {
      margin: 1rem auto;

      &[data-company="automaton"] {
        width: auto;
      }

      &[data-company="instime"] {
        width: auto;
      }
    }

    &-bottom-title {
      font-size: 1.7rem;
      padding: 1rem 0;
    }

    &-bottom-logo {
      margin: 2rem auto;

      &[data-company="automaton"] {
        width: 70%;
      }

      &[data-company="instime"] {
        width: 38%;
      }
    }

    &-price {
      font-size: 1.5rem;
      padding: 0 .5rem;

      @media (max-width: $tablet) {
        padding: 3rem .5rem;
      }
    }

    &-waiting {
      padding: 1rem;
      background-color: #eb9515;

      &-countdown {
        padding: 1rem;
        background-color: #23d160;
        font-size: 26px;
      }
    }

    &-purchased {
      background-color: #2f4554;
      font-size: 26px;
      height: 75px;
      line-height: 75px;
    }

    &-waiting-update,
    &-buy {
      padding: 0;
      width: 100%;
      border-radius: 0;
      height: 75px;
      line-height: 75px;
      background-color: #23d160;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 26px;

      &:hover {
        background-color: #22c65b;
      }

      &:active {
        background-color: #20bc56;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 0.125rem rgba(35, 209, 96, 0.25);
      }

      &[disabled],
      &[disabled]:hover {
        opacity: 0.5;
        box-shadow: none;
        cursor: not-allowed;
        background-color: #23d160;
      }
    }
  }
}
</style>
