<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <div v-if="selected" class="modal-card" style="margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">Закрепление бизнес-места {{ selected.referralCode }}</p>
      </header>
      <section class="modal-card-body">
        <pseudo-table
          label="Рефкод:"
          :value="selected.referralCode"
        />

        <pseudo-table
          label="Имя пакета:"
          :value="selected.packageName"
        />

        <hr>

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

        <hr v-if="selected.automatonPurchasedAt || selected.instimePurchasedAt">

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
          type="is-success"
          :loading="isAssigning"
          :disabled="isAssigning"
          @click="assign"
        >
          Закрепить
        </b-button>

         <b-button
          :disabled="isAssigning"
          @click="closeAssignDialog"
        >
          Закрыть
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  PREMIUM_REGULAR_PRICE,
  BUSINESS_REGULAR_PRICE,
  STANDARD_REGULAR_PRICE,
  PREMIUM_DISCOUNTED_PRICE,
  BUSINESS_DISCOUNTED_PRICE,
  STANDARD_DISCOUNTED_PRICE,
} from '@/config';

export default {
  name: 'BusinessPlaceAssingDialog',

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },

  data() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    return {
      automatonAmount: 0,
      instimeAmount: 0,
      email: '',
      phone: '',
      instagram: '',
      automatonExpiredAt: new Date(year + 1, month, day),
      instimeExpiredAt: new Date(year + 1, month, day),
      automatonPurchasedAt: new Date(),
      instimePurchasedAt: new Date(),
      isAttemptedToPay: true,
      isAttemptedToPayInstime: true,
      isPurchased: true,
      isInstimePurchased: true,
      hasDiscount: true,
      paymentType: 'BY_CARD',
      uid: null,
      discountedPrice: 0,
      regularPrice: 0,
    };
  },

  computed: {
    ...mapState('admin/business-places', [
      'items',
      'currentItemId',
      'isAssignDialogOpened',
      'isAssigning',
    ]),

    selected() {
      return this.items && this.currentItemId && this.items[this.currentItemId];
    },

    isOpened: {
      get() {
        return this.isAssignDialogOpened;
      },

      set(value) {
        if (!value && !this.isAssigning) {
          this.closeAssignDialog();
        }
      },
    },
  },

  methods: {
    ...mapActions('admin/business-places', {
      assignToUser: 'ASSIGN_TO_USER',
    }),

    ...mapMutations('admin/business-places', {
      closeAssignDialog: 'CLOSE_ASSIGN_DIALOG',
    }),

    assign() {
      this.assignToUser({
        id: this.selected.id,
        payload: {
          automatonAmount,
          instimeAmount,
          email,
          phone,
          instagram,
          automatonExpiredAt,
          instimeExpiredAt,
          automatonPurchasedAt,
          instimePurchasedAt,
          isAttemptedToPay,
          isAttemptedToPayInstime,
          isPurchased,
          isInstimePurchased,
          hasDiscount,
          paymentType,
          uid,
          discountedPrice,
          regularPrice,
        },
      });
    },
  },
};
</script>
