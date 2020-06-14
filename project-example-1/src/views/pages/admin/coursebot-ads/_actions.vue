<template>
  <div class="admin__table-finances-actions">
    <coursebot-ads-confirmation-dialog
      :isOpened="isConfirmationOpened"
      :operation-type="confirmationOperationType"
      :texts="confirmationTexts"
      :details="confirmationDetails"
      :is-processing="isConfirmationProcessing"
      @close="closeConfirmation"
      @confirm="confirmOperation"
    />

    <b-button
      v-if="getStatus(item).alias === 'waiting'"
      type="is-success"
      icon-right="check"
      :disabled="isPaymentConfirming"
      :loading="isPaymentConfirming"
      @click.prevent="openConfirmation('confirmPayment')"
    >
      Подтвердить оплату
    </b-button>

    <b-button
      v-if="getStatus(item).alias === 'confirmed'"
      type="is-success"
      icon-right="television-play"
      :disabled="isAdRunning"
      :loading="isAdRunning"
      @click.prevent="openConfirmation('runAd')"
    >
      Реклама запущена
    </b-button>

    <b-button
      v-if="getStatus(item).alias === 'runned'"
      type="is-warning"
      icon-right="television-pause"
      :disabled="isAdStopped"
      :loading="isAdStopped"
      @click.prevent="openConfirmation('stopAd')"
    >
      Реклама приостановлена
    </b-button>

    <b-button
      v-if="getStatus(item).alias === 'stopped'"
      type="is-success"
      icon-right="television-play"
      :disabled="isAdRunning"
      :loading="isAdRunning"
      @click.prevent="openConfirmation('runAd')"
    >
      Реклама перезапущена
    </b-button>

    <b-button
      v-if="getStatus(item).alias === 'runned' || getStatus(item).alias === 'stopped'"
      type="is-danger"
      icon-right="television-stop"
      :disabled="isAdStopped"
      :loading="isAdStopped"
      @click.prevent="openConfirmation('expireAd')"
    >
      Реклама отработана
    </b-button>

    <b-button
      type="is-danger"
      icon-right="delete"
      :disabled="isOrderDeleting"
      :loading="isOrderDeleting"
      @click.prevent="openConfirmation('deleteOrder')"
    >
      Удалить заказ
    </b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import StatusMixin from '@/utils/mixins/tariff-status';
import CoursebotAdsConfirmationDialog from './_confirmation.vue';


export default {
  name: 'AdminCoursebotAdsTableDetailsActions',

  mixins: [StatusMixin],

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  components: {
    CoursebotAdsConfirmationDialog,
  },

  data() {
    return {
      isConfirmationOpened: false,
      confirmationOperationType: null,
      confirmationDetails: null,
      isConfirmationProcessing: false,
    };
  },

  computed: {
    ...mapState('admin/tariff', [
      'isPaymentConfirming',
      'isAdRunning',
      'isAdStopped',
      'isOrderDeleting',
    ]),

    confirmationTexts() {
      const texts = {
        confirmPayment: {
          title: 'Подтверждение оплаты',
          subtitle: 'Вы уверены, что хотите подтвердить оплату?',
        },
        runAd: {
          title: 'Запуск рекламы',
          subtitle: 'Вы уверены, что запустили рекламу?',
        },
        stopAd: {
          title: 'Приостановка рекламы',
          subtitle: 'Вы уверены, что приостановили рекламу?',
        },
        expireAd: {
          title: 'Отработка рекламы',
          subtitle: 'Вы уверены, что реклама полностью отработана?',
        },
        deleteOrder: {
          title: 'Удаление заказа',
          subtitle: 'Вы уверены, что хотите удалить заказ?',
        },
      };

      return texts[this.confirmationOperationType] || {};
    },
  },

  methods: {
    ...mapActions('admin/tariff', {
      confirmPayment: 'CONFIRM_PAYMENT',
      runAd: 'RUN_AD',
      stopAd: 'STOP_AD',
      expireAd: 'EXPIRE_AD',
      deleteOrder: 'DELETE_ORDER',
    }),

    openConfirmation(operation) {
      this.confirmationOperationType = operation;
      this.confirmationDetails = this.item;
      this.isConfirmationOpened = true;
    },

    closeConfirmation() {
      this.confirmationOperationType = null;
      this.confirmationDetails = null;
      this.isConfirmationOpened = false;
      this.isConfirmationProcessing = false;
    },

    confirmOperation(payload) {
      this.isConfirmationProcessing = true;

      this[this.confirmationOperationType](payload)
        .then(() => {
          this.closeConfirmation();
        });
    },
  },
};
</script>
