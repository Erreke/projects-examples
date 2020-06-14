export default {
  methods: {
    getStatus(item) {
      if (!item.isAttemptedToPay
        && !item.isPaymentConfirmed
        && !item.isAdRunning
        && !item.isAdStopped
        && !item.isAdExpired
      ) {
        return {
          text: 'Не оплачен',
          alias: 'not-paid',
          class: 'light',
        };
      }

      if (item.isAttemptedToPay
        && !item.isPaymentConfirmed
        && !item.isAdRunning
        && !item.isAdStopped
        && !item.isAdExpired
      ) {
        return {
          text: 'Ожидание подтверждения оплаты',
          alias: 'waiting',
          class: 'warning',
        };
      }

      if (item.isAttemptedToPay
        && item.isPaymentConfirmed
        && !item.isAdRunning
        && !item.isAdStopped
        && !item.isAdExpired
      ) {
        return {
          text: 'Оплата поступила',
          alias: 'confirmed',
          class: 'info',
        };
      }

      if (item.isAttemptedToPay
        && item.isPaymentConfirmed
        && item.isAdRunning
        // && !item.isAdStopped
        // && !item.isAdExpired
      ) {
        return {
          text: 'Реклама запущена',
          alias: 'runned',
          class: 'success',
        };
      }

      if (item.isAttemptedToPay
        && item.isPaymentConfirmed
        // && item.isAdRunning
        && item.isAdStopped
        // && !item.isAdExpired
      ) {
        return {
          text: 'Реклама приостановлена',
          alias: 'stopped',
          class: 'warning',
        };
      }

      if (item.isAttemptedToPay
        && item.isPaymentConfirmed
        // && item.isAdRunning
        // && !item.isAdStopped
        && item.isAdExpired
      ) {
        return {
          text: 'Заказ отработан',
          alias: 'expired',
          class: 'danger',
        };
      }

      return {
        text: 'Неизвестно',
        alias: 'unknown',
        class: 'unknown',
      };
    },
  },
};
