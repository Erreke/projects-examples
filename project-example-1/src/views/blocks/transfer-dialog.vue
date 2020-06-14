<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <form @submit.prevent="submitForm">
      <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('block-transfer-dialog.popup-title-transfer') }}</p>
        </header>
        <section class="modal-card-body">
          <b-field
            :label="$t('block-transfer-dialog.beneficiar-email-label')"
            :type="{ 'is-danger': $v.email.$error }"
            :message="beneficiarEmailErrorMessages"
          >
            <b-input
              type="text"
              icon="email"
              :placeholder="$t('block-transfer-dialog.beneficiar-email-placeholder')"
              v-model="email"
              :loading="isBeneficiarByEmailGettingProcess"
              :disabled="isBeneficiarByEmailGettingProcess"
              @input="clearBeneficiarGettingError"
              @blur="blurEmailInput"
            >
            </b-input>
          </b-field>

          <transition name="slide-fade">
            <b-field
              v-if="beneficiarFirstName"
              :label="$t('block-transfer-dialog.beneficiar-first-name-label')"
            >
              <b-input
                type="text"
                icon="account"
                v-model="beneficiarFirstName"
                :disabled="true"
              >
              </b-input>
            </b-field>
          </transition>

          <transition name="slide-fade">
            <b-field
              v-if="beneficiarSecondName"
              :label="$t('block-transfer-dialog.beneficiar-second-name-label')"
            >
              <b-input
                type="text"
                icon="account"
                v-model="beneficiarSecondName"
                :disabled="true"
              >
              </b-input>
            </b-field>
          </transition>

          <b-field
            :label="$t('block-transfer-dialog.amount-label')"
            :type="{ 'is-danger': $v.amount.$error }"
            :message="amountErrorMessages"
          >
            <b-input
              type="text"
              icon="currency-usd"
              :placeholder="$t('block-transfer-dialog.amount-placeholder')"
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
            <span>{{ $t("block-transfer-dialog.cancel-button") }}</span>
          </button>
          <button
            :class="['button is-primary', { 'is-loading': isTransferRequestAddingProcess }]"
            :disabled="!isFormSubmittable"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t("block-transfer-dialog.transfer-button") }}</span>
          </button>
        </footer>
      </div>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import selfEmail from '@/utils/validators/self-email';
import beneficiarExist from '@/utils/validators/beneficiar-exist';
import beneficiarEmail from '@/utils/validators/beneficiar-email';
import enoughtMoney from '@/utils/validators/enought-money';
import rightAmount from '@/utils/validators/right-amount';


export default {
  name: 'FinancePageTransferDialog',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      email: '',
      amount: '',
      masks: {
        thousand: {
          numeral: true,
          numeralDecimalMark: ',',
          delimiter: ' ',
        },
      },
    };
  },

  validations: {
    email: {
      required,
      email,
      selfEmail,
      beneficiarExist,
      beneficiarEmail,
    },
    amount: {
      required,
      rightAmount,
      enoughtMoney,
    },
  },

  computed: {
    ...mapState('finance', [
      'isTransferRequestAddingProcess',
      'isBeneficiarByEmailGettingProcess',
    ]),

    ...mapState('finance', {
      beneficiarId: state => state.beneficiarData.id,
      beneficiarEmail: state => state.beneficiarData.email,
      beneficiarFirstName: state => state.beneficiarData.firstName,
      beneficiarSecondName: state => state.beneficiarData.secondName,
    }),

    isOpened: {
      get() {
        return this.isActive;
      },
      set(value) {
        if (!this.isTransferRequestAddingProcess && !value) {
          this.email = '';
          this.amount = '';
          this.clearBeneficiarData();
          this.$v.$reset();
          this.$emit('close');
        }
      },
    },

    isFormSubmittable() {
      return !!(this.email
        && this.amount
        && this.beneficiarId
        && this.beneficiarEmail
        && this.beneficiarFirstName
        && this.beneficiarSecondName
        && !this.isTransferRequestAddingProcess
        && !this.$v.$invalid);
    },

    beneficiarEmailErrorMessages() {
      let result = null;

      if (this.$v.email.$error) {
        if (!this.$v.email.required) {
          result = this.$t('block-errors.field-is-required');
        }

        if (!this.$v.email.email) {
          result = this.$t('block-errors.field-must-be-email');
        }

        if (!this.$v.email.selfEmail) {
          result = this.$t('block-errors.you-can-not-send-money-to-yourself');
        }

        if (!this.$v.email.beneficiarEmail) {
          result = this.$t('block-errors.field-must-be-email');
        }

        if (!this.$v.email.beneficiarExist) {
          result = this.$t('block-errors.user-not-found');
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

    outAmountForDB() {
      return -Math.abs(parseFloat(this.amount.replace(/\s/g, '').replace(/,/g, '.'), 10));
    },

    inAmountForDB() {
      return Math.abs(parseFloat(this.amount.replace(/\s/g, '').replace(/,/g, '.'), 10));
    },
  },

  methods: {
    ...mapActions('finance', {
      addTransferRequest: 'ADD_TRANSFER_REQUEST',
      getBeneficiarByEmail: 'GET_BENEFICIAR_BY_EMAIL',
    }),

    ...mapMutations('finance', {
      clearBeneficiarData: 'CLEAR_BENEFICIAR_DATA',
      clearBeneficiarGettingError: 'CLEAR_BENEFICIAR_GETTING_ERROR',
    }),

    cancel() {
      this.isOpened = false;
    },

    submitForm() {
      this.$v.$touch();

      if (this.isFormSubmittable) {
        this.addTransferRequest([
          {
            uid: this.beneficiarId,
            amount: this.inAmountForDB,
            fromWhomUid: this.$_user.uid,
            fromWhomName: `${this.$_user.firstName} ${this.$_user.secondName}`,
            fromWhomEmail: this.$_user.email,
            isTransferIn: true,
            isApproved: false,
            isRejected: false,
            createdAt: new Date(),
            approvedAt: null,
            rejectedAt: null,
          },
          {
            uid: this.$_user.uid,
            amount: this.outAmountForDB,
            toWhomUid: this.beneficiarId,
            toWhomName: `${this.beneficiarFirstName} ${this.beneficiarSecondName}`,
            toWhomEmail: this.beneficiarEmail,
            isTransferOut: true,
            isApproved: false,
            isRejected: false,
            createdAt: new Date(),
            approvedAt: null,
            rejectedAt: null,
          },
        ])
          .then(() => {
            this.isOpened = false;
            this.$buefy.toast.open({
              message: this.$t('block-global.transfer-successful-done'),
              type: 'is-success',
              duration: 5000,
            });
          });
      }
    },

    blurEmailInput() {
      this.$v.email.$touch();

      if (!this.$v.email.$invalid) {
        this.getBeneficiarByEmail(this.email);
      }
    },
  },
};
</script>

<style lang="scss">
.slide-fade {
  &-enter-active {
    transition: all .3s ease;
  }
  &-leave-active {
    transition: all .3s ease;
  }
  &-enter,
  &-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>
