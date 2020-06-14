<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <form @submit.prevent="submitForm">
      <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('block-withdrawal-dialog.popup-title-withdrawal') }}</p>
        </header>
        <section class="modal-card-body">
          <b-field
            :label="$t('block-withdrawal-dialog.card-number-label')"
            :type="{ 'is-danger': $v.cardNumber.$error }"
            :message="cardNumberErrorMessages"
          >
            <b-input
              type="text"
              icon="credit-card"
              :placeholder="$t('block-withdrawal-dialog.card-number-placeholder')"
              v-model="cardNumber"
              v-cleave="masks.creditCard"
              @blur="$v.cardNumber.$touch()"
            >
            </b-input>
          </b-field>

          <b-field
            :label="$t('block-withdrawal-dialog.amount-label')"
            :type="{ 'is-danger': $v.amount.$error }"
            :message="amountErrorMessages"
          >
            <b-input
              type="text"
              icon="currency-usd"
              :placeholder="$t('block-withdrawal-dialog.amount-placeholder')"
              v-model="amount"
              v-cleave="masks.thousand"
              @input="$v.amount.$touch()"
              @blur="$v.amount.$touch()"
            >
            </b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            @click="cancel"
          >
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
            <span>{{ $t("block-withdrawal-dialog.cancel-button") }}</span>
          </button>
          <button
            :class="['button is-primary', { 'is-loading': isWithdrawalRequestAddingProcess }]"
            :disabled="!isFormSubmittable"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t("block-withdrawal-dialog.withdrawal-button") }}</span>
          </button>
        </footer>
      </div>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import cardNumber from '@/utils/validators/card-number';
import enoughtMoney from '@/utils/validators/enought-money';
import rightAmount from '@/utils/validators/right-amount';

export default {
  name: 'FinancePageWithdrawalDialog',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      cardNumber: '',
      amount: '',
      masks: {
        creditCard: {
          creditCard: true,
        },
        thousand: {
          numeral: true,
          numeralDecimalMark: ',',
          delimiter: ' ',
        },
      },
    };
  },

  validations: {
    cardNumber: {
      required,
      cardNumber,
    },
    amount: {
      required,
      rightAmount,
      enoughtMoney,
    },
  },

  computed: {
    ...mapState('finance', ['isWithdrawalRequestAddingProcess']),

    isOpened: {
      get() {
        return this.isActive;
      },
      set(value) {
        if (!this.isWithdrawalRequestAddingProcess && !value) {
          this.cardNumber = '';
          this.amount = '';
          this.$v.$reset();
          this.$emit('close');
        }
      },
    },

    isFormSubmittable() {
      return !!(this.cardNumber
        && this.amount
        && !this.isWithdrawalRequestAddingProcess
        && !this.$v.$invalid);
    },

    cardNumberErrorMessages() {
      let result = null;

      if (this.$v.cardNumber.$error) {
        if (!this.$v.cardNumber.required) {
          result = this.$t('block-errors.field-is-required');
        }

        if (!this.$v.cardNumber.cardNumber) {
          result = this.$t('block-errors.field-must-be-card-number');
        }
      }

      return result;
    },

    amountErrorMessages() {
      let result = null;

      if (this.$v.amount.$error) {
        if (!this.$v.amount.required) {
          result = this.$t('block-errors.field-is-required');
        }

        if (!this.$v.amount.rightAmount) {
          result = this.$t('block-errors.field-must-be-right-amount');
        }

        if (!this.$v.amount.enoughtMoney) {
          result = this.$t('block-errors.you-have-not-enought-money');
        }
      }

      return result;
    },

    amountForDB() {
      return -Math.abs(parseFloat(this.amount.replace(/\s/g, '').replace(/,/g, '.'), 10));
    },
  },

  methods: {
    ...mapActions('finance', {
      addWithdrawalRequest: 'ADD_WITHDRAWAL_REQUEST',
    }),

    cancel() {
      this.isOpened = false;
    },

    submitForm() {
      this.$v.$touch();

      if (this.isFormSubmittable) {
        this.addWithdrawalRequest({
          uid: this.$_user.uid,
          cardNumber: this.cardNumber,
          amount: this.amountForDB,
          name: `${this.$_user.firstName} ${this.$_user.secondName}`,
          phone: this.$_user.phone,
          email: this.$_user.email,
          isWithdrawal: true,
          isApproved: false,
          isRejected: false,
          createdAt: new Date(),
          approvedAt: null,
          rejectedAt: null,
        })
          .then(() => {
            this.isOpened = false;
            this.$buefy.toast.open({
              message: this.$t('block-global.withdrawal-successful-done'),
              type: 'is-success',
              duration: 5000,
            });
          });
      }
    },
  },
};
</script>
