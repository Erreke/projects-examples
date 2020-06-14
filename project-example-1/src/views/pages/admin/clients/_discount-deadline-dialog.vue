<template>
  <b-modal :active.sync="isActive" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">Дедлайн для скидки</p>
      </header>
      <section class="modal-card-body">

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child">
              <date-picker
                v-model="discountDeadlineDate"
                :years-range="[-1, 1]"
                :max-date="discountDeadlineMaxDate"
                :min-date="discountDeadlineMinDate"
                :events="datepickerEvents"
                :disabled="discountDeadlineSaving"
                :inline="true"
                indicators="bars"
                @input="startCountDown"
              >
              </date-picker>
            </div>
          </div>

          <div class="tile is-parent content">
            <div class="tile is-child">
              <b-timepicker
                v-model="discountDeadlineTime"
                :disabled="discountDeadlineSaving"
                @input="startCountDown"
              >
              </b-timepicker>

              <hr>

              <p>
                <b-button
                  expanded
                  :disabled="discountDeadlineSaving"
                  type="is-success"
                  @click.prevent="addDiscountDeadlineDate(2)"
                >
                  +2 дня
                </b-button>
              </p>
              <p>
                <b-button
                  expanded
                  :disabled="discountDeadlineSaving"
                  type="is-info"
                  @click.prevent="addDiscountDeadlineDate(5)"
                >
                  +5 дней
                </b-button>
              </p>
              <p>
                <b-button
                  expanded
                  :disabled="discountDeadlineSaving"
                  type="is-warning"
                  @click.prevent="addDiscountDeadlineDate(9)"
                >
                  +9 дней
                </b-button>
              </p>
              <p>
                <b-button
                  expanded
                  :disabled="discountDeadlineSaving"
                  type="is-danger"
                  @click.prevent="addDiscountDeadlineDate(14)"
                >
                  +14 дней
                </b-button>
              </p>
            </div>
          </div>
        </div>

        <table class="table is-narrow is-hoverable is-fullwidth">
          <tbody>
            <tr v-if="currentOperation === 'editDiscount'">
              <th>Старый дедлайн</th>
              <td>{{ clientDeadline.seconds | date_time_format }}</td>
            </tr>
            <tr v-if="currentOperation === 'editDiscount'">
              <th>До истечения старого</th>
              <td>
                <simple-count-down
                  :interval="discountDeadlineIntervalOld"
                  :is-time-to-start="isTimeToStartOldCountDown"
                  :is-long="true"
                  @start="isTimeToStartOldCountDown = false"
                />
              </td>
            </tr>
            <tr>
              <th>Новый дедлайн</th>
              <td>{{ discountDeadlineDateTime | date_time_format }}</td>
            </tr>
            <tr>
              <th>До истечения нового</th>
              <td>
                <simple-count-down
                  :interval="discountDeadlineIntervalNew"
                  :is-time-to-start="isTimeToStartNewCountDown"
                  :is-long="true"
                  @start="isTimeToStartNewCountDown = false"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button
          type="button"
          class="button"
          @click="isActive = false"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>{{ $t("page-admin-clients.button-cancel") }}</span>
        </button>
        <button
          type="button"
          :class="['button is-success', { 'is-loading': discountDeadlineSaving }]"
          :disabled="discountDeadlineSaving"
          @click="addOrEditDiscount"
        >
          <span class="icon">
            <i class="mdi mdi-check"></i>
          </span>
          <span>{{ $t("page-admin-clients.button-save") }}</span>
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { DateTime } from 'luxon';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
    SimpleCountDown: () => import('@/views/blocks/simple-count-down.vue'),
  },

  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },

    discounts: {
      type: Object,
      required: true,
    },

    currentOperation: {
      required: true,
    },

    currentClient: {
      required: true,
    },
  },

  data() {
    return {
      datePickerValue: null,
      discountDeadlineTime: new Date(),
      discountDeadlineMinDate: new Date(),
      isTimeToStartOldCountDown: false,
      isTimeToStartNewCountDown: false,
    };
  },

  computed: {
    ...mapState('admin/clients', ['discountDeadlineSaving']),

    isActive: {
      get() {
        return this.isOpened;
      },

      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },

    clientDeadline() {
      const clientId = this.currentClient && this.currentClient.uid;

      if (!clientId) return null;

      return this.discounts[clientId] && this.discounts[clientId].deadline;
    },

    discountDeadlineDate: {
      get() {
        if (this.datePickerValue) return this.datePickerValue;

        return this.discountDeadlineMaxDate;
      },

      set(value) {
        this.datePickerValue = value;
      },
    },

    discountDeadlineDateTime() {
      if (this.discountDeadlineDate && this.discountDeadlineTime) {
        const d = this.discountDeadlineDate.getDate();
        const m = this.discountDeadlineDate.getMonth();
        const y = this.discountDeadlineDate.getFullYear();
        const hh = this.discountDeadlineTime.getHours();
        const mm = this.discountDeadlineTime.getMinutes();
        const ss = this.discountDeadlineTime.getSeconds();

        return new Date(y, m, d, hh, mm, ss);
      }

      return null;
    },

    discountDeadlineMaxDate() {
      const dt = DateTime.local();

      return dt.plus({ days: 14 }).toJSDate();
    },

    discountDeadlineIntervalNew() {
      const start = DateTime.local();
      const end = DateTime.fromJSDate(this.discountDeadlineDateTime);

      const diff = end.diff(start, 'seconds');
      return diff.toObject().seconds;
    },

    discountDeadlineIntervalOld() {
      const start = DateTime.local();
      const end = DateTime.fromSeconds(this.clientDeadline.seconds);

      const diff = end.diff(start, 'seconds');

      return diff.toObject().seconds;
    },

    datepickerEvents() {
      if (this.clientDeadline) {
        return [{
          date: new Date(this.clientDeadline.seconds * 1000),
          type: 'is-success',
        }];
      }

      return [];
    },
  },

  methods: {
    ...mapActions('admin/clients', {
      createClientDiscountDeadline: 'CREATE_CLIENT_DISCOUNT_DEADLINE',
      updateClientDiscountDeadline: 'UPDATE_CLIENT_DISCOUNT_DEADLINE',
    }),

    addOrEditDiscount() {
      this[this.currentOperation]();
    },

    addDiscount() {
      this.createClientDiscountDeadline({
        uid: this.currentClient.uid,
        deadline: this.discountDeadlineDateTime,
        manager: `${this.$_user.firstName} ${this.$_user.secondName}`,
      })
        .then(() => {
          this.isActive = false;
        });
    },

    editDiscount() {
      this.updateClientDiscountDeadline({
        uid: this.currentClient.uid,
        deadline: this.discountDeadlineDateTime,
        manager: `${this.$_user.firstName} ${this.$_user.secondName}`,
      })
        .then(() => {
          this.isActive = false;
        });
    },

    addDiscountDeadlineDate(value) {
      const dt = DateTime.local();

      this.discountDeadlineDate = dt.plus({ days: value }).toJSDate();

      this.startCountDown();
    },

    startCountDown() {
      if (this.currentOperation === 'editDiscount') {
        this.isTimeToStartOldCountDown = true;
      }

      this.isTimeToStartNewCountDown = true;
    },
  },

  watch: {
    isActive(value) {
      if (value) {
        this.$nextTick(() => {
          this.datePickerValue = null;
          this.discountDeadlineTime = new Date();

          this.startCountDown();
        });
      }
    },
  },
};
</script>
