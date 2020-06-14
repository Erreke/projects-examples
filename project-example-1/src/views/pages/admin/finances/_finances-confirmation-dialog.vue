<template>
  <b-modal :active.sync="isActive" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ texts.title }}</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <p>{{ texts.subtitle }}</p>
          <p>{{ $t("page-admin-finances.confirmation-operation-client") }}</p>

          <table class="table is-fullwidth admin-confirmation__table" v-if="client">
            <tbody>
              <tr v-for="(value, key) in clientFields" :key="key">
                <th>{{ value }}</th>
                <td>{{ client[key] || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="content" v-if="details">
          <p>{{ $t("page-admin-finances.confirmation-operation-details") }}</p>

          <table class="table is-fullwidth admin-confirmation__table">
            <tbody>
              <tr>
                <th>{{ $t("page-admin-finances.confirmation-th-amount") }}</th>
                <td>{{ Math.abs(details.amount) | currency_format }}</td>
              </tr>
              <tr v-if="details.cardNumber">
                <th>{{ $t("page-admin-finances.confirmation-th-card-number") }}</th>
                <td>{{ details.cardNumber }}</td>
              </tr>
              <tr>
                <th>{{ $t("page-admin-finances.confirmation-th-id") }}</th>
                <td>{{ details.id }}</td>
              </tr>
              <tr>
                <th>{{ $t("page-admin-finances.confirmation-th-created-at") }}</th>
                <td>{{ details.createdAt.seconds | date_time_format }}</td>
              </tr>
              <tr v-if="details.approvedAt">
                <th>{{ $t("page-admin-finances.confirmation-th-approved-at") }}</th>
                <td>{{ details.approvedAt.seconds | date_time_format }}</td>
              </tr>
              <tr v-if="details.rejectedAt">
                <th>{{ $t("page-admin-finances.confirmation-th-rejected-at") }}</th>
                <td>{{ details.rejectedAt.seconds | date_time_format }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="operationType === 'rejectWithdrawal'">
          <b-field :label="$t('page-admin-finances.confirmation-type-a-reason')">
            <b-input type="textarea" v-model="reason"></b-input>
          </b-field>
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
          <span>{{ $t("page-admin-finances.confirmation-button-no") }}</span>
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
          <span>{{ $t("page-admin-finances.confirmation-button-yes") }}</span>
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
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

    client: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true,
    },
  },

  data() {
    return {
      reason: '',
      clientFields: {
        firstName: 'Имя:',
        secondName: 'Фамилия:',
        email: 'Е-мейл:',
        phone: 'Телефон:',
      },
    };
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

        this.reason = '';
      },
    },
  },

  methods: {
    cancel() {
      this.isActive = false;
    },

    confirm() {
      this.$emit('confirm', { reason: this.reason });
      this.reason = '';
    },
  },
};
</script>
