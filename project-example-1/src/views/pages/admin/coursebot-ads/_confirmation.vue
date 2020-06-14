<template>
  <b-modal :active.sync="isActive" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ texts.title }}</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <p>{{ texts.subtitle }}</p>

          <div v-if="operationType === 'confirmPayment'">
            <b-field
              label="Оплачено в тенге"
              :type="{ 'is-danger': formErrorMessages.length }"
              :message="formErrorMessages"
            >
              <b-input v-model="amountTNG"></b-input>
            </b-field>

            <hr>
          </div>

          <p>{{ $t("page-admin-coursebot-ads.confirmation-operation-details") }}</p>

          <div class="admin-confirmation__pseudo-tables">
            <pseudo-table
              v-if="details && details.tariff"
              label="Тариф:"
              :value="details.tariff"
            />

            <pseudo-table
              v-if="details && details.priceUSD"
              label="Сумма в USD:"
              :value="details.priceUSD ? $options.filters.currency_format(details.priceUSD) : '-'"
            />

            <pseudo-table
              v-if="details && details.client && details.client.firstName && details.client.secondName"
              label="Имя и фамилия:"
              :value="`${details.client.firstName} ${details.client.secondName}`"
            />

            <pseudo-table
              v-if="details && details.client && details.client.email"
              label="Email:"
              :value="details.client.email"
            />

            <pseudo-table
              v-if="details && details.client && details.client.phone"
              label="Телефон:"
              :value="details.client.phone"
            />

            <pseudo-table
              v-if="details && details.client && details.client.courseBotReferralLink"
              label="Рефссылка:"
              :value="details.client.courseBotReferralLink"
            />

          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          type="button"
          class="button is-danger"
          @click="cancel"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>Нет</span>
        </button>
        <button
          type="button"
          :class="['button is-success', { 'is-loading': isProcessing }]"
          :disabled="isProcessing"
          @click="confirm"
        >
          <span class="icon">
            <i class="mdi mdi-check"></i>
          </span>
          <span>Да</span>
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { required, between, decimal } from 'vuelidate/lib/validators';

export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },

    isProcessing: {
      type: Boolean,
      required: true,
    },

    texts: {
      type: Object,
      required: true,
    },

    operationType: {
      validator: prop => typeof prop === 'string' || prop === null,
      required: true,
    },

    details: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true,
    },
  },

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },

  data() {
    return {
      amountTNG: 0,
    };
  },

  validations() {
    if (this.operationType === 'confirmPayment') {
      return {
        amountTNG: {
          required,
          between: between(100000, 5000000),
          decimal,
        },
      };
    }

    return null;
  },

  computed: {
    isActive: {
      get() {
        return this.isOpened;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }

        this.amountTNG = 0;
      },
    },

    formErrorMessages() {
      const errors = [];

      if (!this.$v.amountTNG.$dirty) return errors;

      if (!this.$v.amountTNG.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.amountTNG.between) errors.push('Значение должно быть между 100 000 и 5 000 000');
      if (!this.$v.amountTNG.decimal) errors.push('Поле должно содержать только цифры');

      return errors;
    },
  },

  methods: {
    cancel() {
      this.isActive = false;
    },

    confirm() {
      if (this.operationType === 'confirmPayment') {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          this.$emit('confirm', {
            id: this.details.id,
            amountTNG: Math.abs(parseFloat(this.amountTNG)),
          });
        }
      } else {
        this.$emit('confirm', { id: this.details.id });
      }
    },
  },
};
</script>
