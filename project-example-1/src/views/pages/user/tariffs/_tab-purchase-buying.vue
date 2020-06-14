<template>
  <div class="tariffs__purchase-buying">
    <div class="tariffs__purchase-buying-meta">
      <div class="tariffs__purchase-buying-meta-name">
        <p v-html="$t('page-tariffs.selected-tariff', {
          tariff: selectedTariffName
        })"></p>
      </div>

      <div class="tariffs__purchase-buying-meta-price">
        <p v-html="$t('page-tariffs.tariff-price', {
          price: price
        })"></p>
      </div>
    </div>

    <b-switch
      v-if="!isSelectedTariffAttemptedToPay && !isSelectedTariffPaymentConfirmed"
      v-model="isAgree"
      :disabled="isAttemptingToPay"
    >
      <span v-html="$t('page-tariffs.agree')"></span>
    </b-switch>

    <p
      v-if="!isSelectedTariffAttemptedToPay && !isSelectedTariffPaymentConfirmed"
      class="tariffs__purchase-buying-buttons"
    >
      <b-button
        type="is-success"
        :loading="isAttemptingToPay"
        :disabled="!isAgree || isAttemptingToPay"
        @click="openPaymentUrl"
      >
        {{ $t('page-tariffs.pay') }}
      </b-button>

      <b-button
        :loading="isBuyCancelling"
        type="is-danger"
        @click="openConfirmationToBuyCancelling"
      >
        Отменить покупку
      </b-button>
    </p>

    <div
      v-else-if="!isSelectedTariffPaymentConfirmed"
      class="tariffs__purchase-buying-waiting"
    >
      <p>Статус покупки:<br> <strong>Ожидание подтверждения оплаты</strong></p>

      <b-button
        :loading="isBuyCancelling"
        type="is-danger"
        @click="openConfirmationToBuyCancelling"
      >
        Отменить покупку
      </b-button>
    </div>

    <div class="tariffs__purchase-buying-item-done" v-else>
      Куплен
    </div>

    <div
      class="tariffs__purchase-buying-footer"
      v-if="isSelectedTariffAttemptedToPay && !isSelectedTariffPaymentConfirmed"
    >
      <p v-html="$t('page-tariffs.if-you-accidentally-close-window', {
        link: paymentUrl
      })"></p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { PAYMENT_URL } from '@/config';

export default {
  name: 'TariffsPagePurchaseTabBuying',

  props: {
    selectedTariffId: {
      type: String,
      required: true,
    },

    selectedTariffName: {
      type: String,
      required: true,
    },

    selectedTariffPrice: {
      type: Number,
      required: true,
    },

    isSelectedTariffPaymentConfirmed: {
      type: Boolean,
      required: true,
    },

    isSelectedTariffAttemptedToPay: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      isAgree: false,
    };
  },

  computed: {
    ...mapState('tariff', [
      'isBuyCancelling',
      'isAttemptingToPay',
    ]),

    price() {
      return this.$options.filters.currency_format(this.selectedTariffPrice);
    },

    paymentUrl() {
      return PAYMENT_URL;
    },
  },

  methods: {
    ...mapActions('tariff', {
      cancelBuying: 'CANCEL_BUYING',
      attemptToPay: 'ATTEMPT_TO_PAY',
    }),

    openPaymentUrl() {
      this.attemptToPay(this.selectedTariffId)
        .then(() => {
          window.open(this.paymentUrl, '_blank');
        });
    },

    openConfirmationToBuyCancelling() {
      if (!this.isBuyCancelling) {
        this.$buefy.dialog.confirm({
          title: 'Отказ от покупки тарифа',
          message: 'Вы уверены, что хотите отказаться от покупки?',
          confirmText: 'Да, отказаться',
          cancelText: 'Нет, передумал',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.cancelBuying(this.selectedTariffId),
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.tariffs__purchase-buying {
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  border-radius: 5px;

  &-meta {
    display: flex;

    @media (max-width: $tablet) {
      display: block;
    }

    &-name,
    &-price {
      padding: 2rem;

      @media (max-width: $tablet) {
        padding: 1rem;
      }

      p,
      strong {
        color: #fff;
        font-size: 1.5rem;
      }
    }

    &-name {
      flex: 0 0 50%;
      border-radius: 5px 0 0 0;
      background-color: #2f4554;

      @media (max-width: $tablet) {
        border-radius: 5px 5px 0 0;
      }
    }

    &-price {
      flex: 0 0 50%;
      border-radius: 0 5px 0 0;
      background-color: #517786;

      @media (max-width: $tablet) {
        border-radius: 0;
      }
    }
  }

  &-waiting {
    font-size: 1.5rem;
    padding: 3rem 2rem;

    @media (max-width: $tablet) {
      padding: 3rem 1rem;
    }

    p {
      margin-bottom: 1rem;
    }
  }

  &-buttons {
    padding: 1rem 2rem 3rem;

    @media (max-width: $tablet) {
      padding: 1rem 1rem 3rem;
    }

    .button {
      margin: 0 1rem 1rem 0;
    }
  }

  &-footer {
    background-color: #f3f3f3;
    border-radius: 0 0 5px 5px;
    padding: 1rem 2rem;

    @media (max-width: $tablet) {
      padding: 1rem;
    }
  }

  .switch {
    display: flex;
    margin: 3rem 2rem 1rem;

    @media (max-width: $tablet) {
      margin: 3rem 1rem 1rem;
    }
  }
}
</style>
