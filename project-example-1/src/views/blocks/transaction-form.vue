<template>
  <form @submit.prevent="submitPaymentInfoForm">
    <b-field
      grouped
      class="transaction-form__field"
      :type="{ 'is-danger': form.hasError }"
    >
      <b-input
        :size="$_interfaceSize"
        v-model="form.transaction"
        :placeholder="form.placeholder"
        :disabled="isInputDisabled"
        expanded
        is-rounded
      >
      </b-input>

      <p class="control">
        <button
          type="submit"
          :class="[
            'button is-rounded',
            { 'is-primary': !isShowCancelButton },
            { 'is-danger': isShowCancelButton },
            { 'is-medium': $_interfaceSize },
            { 'is-loading': isTransactionSaving }
          ]"
        >
          {{ submitButtonText }}
        </button>
      </p>
      <p class="control" v-if="isShowCancelButton">
        <button
          type="button"
          :class="[
            'button is-rounded',
            { 'is-medium': $_interfaceSize },
          ]"
          @click.prevent="setTransactionChangingProcess(false)"
        >
          {{ $t('block-global.cancel') }}
        </button>
      </p>
    </b-field>
  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'BlockTransactionForm',

  props: {
    transaction: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      form: {
        transaction: this.transaction,
        placeholder: this.$t('block-transaction-form.enter-wallet-transaction'),
      },
    };
  },

  computed: {
    ...mapState('user', [
      'isTransactionSaving',
      'isTransactionChanging',
    ]),

    isShowCancelButton() {
      return (this.$_mode !== 'REFERRAL_LINK_APPROVED_MODE' || this.$_mode === 'TRANSACTION_REJECTED_MODE') && !this.isInputDisabled;
    },

    isInputDisabled() {
      return (this.$_mode === 'TRANSACTION_CHECKING_MODE' || this.$_mode === 'TRANSACTION_REJECTED_MODE') && !this.isTransactionChanging;
    },

    submitButtonText() {
      if ((this.$_mode === 'TRANSACTION_CHECKING_MODE' || this.$_mode === 'TRANSACTION_REJECTED_MODE') && !this.isTransactionChanging) {
        return this.$t('block-global.change');
      }

      if ((this.$_mode === 'TRANSACTION_CHECKING_MODE' || this.$_mode === 'TRANSACTION_REJECTED_MODE') && this.isTransactionChanging) {
        return this.$t('block-global.save');
      }

      return this.$t('block-global.paid');
    },
  },

  methods: {
    ...mapActions('user', {
      saveUserInfo: 'SAVE_USER_INFO',
    }),

    ...mapMutations('user', {
      setTransactionChangingProcess: 'SET_TRANSACTION_CHANGING_PROCESS',
    }),

    submitPaymentInfoForm() {
      if (this.$_mode === 'TRANSACTION_CHECKING_MODE' && !this.isTransactionChanging) {
        this.setTransactionChangingProcess(true);

        return;
      }

      if (!this.form.transaction) {
        this.form.hasError = true;
        this.form.placeholder = this.$t('block-transaction-form.not-empty-transaction');

        return;
      }

      this.form.hasError = false;
      this.form.placeholder = this.$t('block-transaction-form.enter-wallet-transaction');

      this.saveUserInfo({
        uid: this.$_user.uid,
        fields: [
          'transaction',
          'transactionUpdatedAt',
          'transactionConfirmedAt',
          'transactionRejectedAt',
          'isTransactionConfirmed',
          'isTransactionRejected',
        ],
        values: [
          this.form.transaction,
          new Date(),
          null,
          null,
          false,
          false,
        ],
        loader: 'user/SET_TRANSACTION_SAVING_PROCESS',
      })
        .then(() => {
          this.setTransactionChangingProcess(false);
        });
    },
  },

  watch: {
    $_user() {
      this.form.transaction = this.$_user.transaction;
    },
  },
};
</script>

<style lang="scss">
  @import '~bulma/sass/utilities/initial-variables.sass';

  .transaction-form {
    &__field.field.is-grouped {
      @media (max-width: $tablet) {
        display: block;

        .control {
          margin: 0 0 1em 0;
        }
      }
    }
  }
</style>
