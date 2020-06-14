<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <div v-if="selected" class="modal-card" style="margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">Детали бизнес-места {{ selected.referralCode }}</p>
      </header>
      <section class="modal-card-body">
        <pseudo-table
          v-if="selected.client"
          label="ID клиента:"
          :value="selected.uid"
        />

        <pseudo-table
          v-if="selected.client"
          label="Имя:"
          :value="selected.client.firstName"
        />

        <pseudo-table
          v-if="selected.client"
          label="Фамилия:"
          :value="selected.client.secondName"
        />

        <hr>

        <pseudo-table
          label="Рефкод:"
          :value="selected.referralCode"
        />

        <pseudo-table
          v-if="selected.email"
          label="E-mail:"
          :value="selected.email"
        />

        <pseudo-table
          v-if="selected.phone"
          label="Телефон:"
          :value="selected.phone"
        />

        <pseudo-table
          v-if="selected.instagram"
          label="Инстаграм:"
          :value="selected.instagram"
        />

        <pseudo-table
          v-if="selected.balance"
          label="Баланс:"
          :value="selected.balance | currency_format"
        />

        <pseudo-table
          v-if="selected.totalEarned"
          label="Всего заработано:"
          :value="selected.totalEarned | currency_format"
        />

        <hr>

        <pseudo-table
          label="Имя пакета:"
          :value="selected.packageName"
        />

        <pseudo-table
          v-if="selected.regularPrice"
          label="Цена:"
          :value="selected.regularPrice | currency_format"
        />

        <pseudo-table
          v-if="selected.discountedPrice"
          label="Скидка:"
          :value="selected.discountedPrice | currency_format"
        />

        <pseudo-table
          v-if="selected.automatonAmount"
          label="Оплачено за Project-example-1:"
          :value="selected.automatonAmount | currency_format"
        />

        <pseudo-table
          v-if="selected.instimeAmount"
          label="Оплачено за Instime:"
          :value="selected.instimeAmount | currency_format"
        />

        <hr v-if="selected.paymentType">

        <pseudo-table
          v-if="selected.paymentType"
          label="Тип оплаты:"
          :value="selected.paymentType"
        />

        <pseudo-table
          v-if="selected.paymentCardDate"
          label="Дата карты:"
          :value="selected.paymentCardDate"
        />

        <pseudo-table
          v-if="selected.paymentCardNumber"
          label="Номер карты:"
          :value="selected.paymentCardNumber"
        />

        <pseudo-table
          v-if="selected.paymentCardType"
          label="Тип карты:"
          :value="selected.paymentCardType"
        />

        <hr v-if="selected.automatonPurchasedAt">

        <pseudo-table
          v-if="selected.automatonPurchasedAt"
          label="Дата покупки Project-example-1:"
          :value="selected.automatonPurchasedAt && selected.automatonPurchasedAt.seconds | date_time_format"
        />

        <pseudo-table
          v-if="selected.instimePurchasedAt"
          label="Дата покупки Instime:"
          :value="selected.instimePurchasedAt && selected.instimePurchasedAt.seconds | date_time_format"
        />

        <pseudo-table
          v-if="selected.automatonExpiredAt"
          label="Дата окончания Project-example-1:"
          :value="selected.automatonExpiredAt && selected.automatonExpiredAt.seconds | date_time_format"
        />

        <pseudo-table
          v-if="selected.instimeExpiredAt"
          label="Дата окончания Instime:"
          :value="selected.instimeExpiredAt && selected.instimeExpiredAt.seconds | date_time_format"
        />

        <pseudo-table
          v-if="selected.synchronizedAt"
          label="Синхронизирован c Instime:"
          :value="selected.synchronizedAt && selected.synchronizedAt.seconds | date_time_format"
        />
      </section>
      <footer class="modal-card-foot">
         <b-button
          type="is-warning"
          :disabled="isSyncing"
          @click="$emit('assing-to-user', selected.referralCode)"
        >
          Закрепить за юзером
        </b-button>

        <b-button
          type="is-success"
          :loading="isSyncing"
          :disabled="isSyncing"
          @click="sync(selected.referralCode)"
        >
          Синхронизировать с Instime
        </b-button>

         <b-button
          :disabled="isSyncing"
          @click="closeDetailsDialog"
        >
          Закрыть
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'BusinessPlaceDetailsDialog',

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },

  computed: {
    ...mapState('admin/business-places', [
      'items',
      'currentItemId',
      'isDetailsDialogOpened',
      'isSyncing',
    ]),

    selected() {
      return this.items && this.currentItemId && this.items[this.currentItemId];
    },

    isOpened: {
      get() {
        return this.isDetailsDialogOpened;
      },

      set(value) {
        if (!value && !this.isSyncing) {
          this.closeDetailsDialog();
        }
      },
    },
  },

  methods: {
    ...mapActions('admin/business-places', {
      sync: 'SYNC',
    }),

    ...mapMutations('admin/business-places', {
      closeDetailsDialog: 'CLOSE_DETAILS_DIALOG',
    }),
  },
};
</script>
