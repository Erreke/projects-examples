<template>
  <div class="admin-marketing-indicators__growth">
    <date-picker
      v-model="selectedDate"
      :max-date="todayDate"
      :events="growthDatepickerEvents"
      :years-range="[-5, 1]"
      indicators="bars"
      :inline="true"
      @input="pickDate"
    >
    </date-picker>

    <form @submit.prevent="submitForm" class="admin-marketing-indicators__growth-form content">
      <p>{{ selectedDate | date_format }}</p>
      <b-field
        :type="growthErrors.length ? 'is-danger' : null"
        :message="growthErrors"
        :label="$t('page-admin-marketing-indicators.label-growth')"
        :disabled="(!isCreating && !isEditing) || isGrowthSavingProcess"
      >
        <b-input
          v-model="inputValue"
          :disabled="(!isCreating && !isEditing) || isGrowthSavingProcess"
          @input="clearErrors"
        />
      </b-field>

      <div class="buttons" v-if="isCreating || isEditing" key="form-buttons">
        <b-button
          type="is-success"
          native-type="submit"
          icon-left="check"
          :loading="isGrowthSavingProcess"
          :disabled="isGrowthSavingProcess"
        >
          {{ $t("page-admin-marketing-indicators.button-save") }}
        </b-button>

        <b-button
          icon-left="cancel"
          :disabled="isGrowthSavingProcess"
          @click="cancelAnyMode"
        >
          {{ $t("page-admin-marketing-indicators.button-cancel") }}
        </b-button>
      </div>

      <div class="buttons" v-else key="create-edit-buttons">
        <b-button
          v-if="isDataForThisDateExist"
          @click="setEditMode"
        >
          {{ $t("page-admin-marketing-indicators.button-edit") }}
        </b-button>

        <b-button
          v-if="isDataForThisDateExist"
          type="is-danger"
          @click="askIndicatorDeletion"
        >
          {{ $t("page-admin-marketing-indicators.button-delete") }}
        </b-button>

        <b-button
          v-else
          type="is-success"
          @click="setCreateMode"
        >
          {{ $t("page-admin-marketing-indicators.button-create") }}
        </b-button>
      </div>
    </form>

    <area-chart
      width="400px"
      :data="growthAreaChartData"
      :is-loading="isGrowthFetchingProcess"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import {
  required, numeric, minValue, maxValue,
} from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      isCreating: false,
      isEditing: false,
      growth: 0,
      selectedDate: new Date(),
      todayDate: new Date(),
      values: {},
    };
  },

  components: {
    AreaChart: () => import('@/views/blocks/charts/_area-chart.vue'),
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
  },

  validations: {
    inputValue: {
      required,
      numeric,
      minValue: minValue(1),
      maxValue: maxValue(1000000000),
    },
  },

  computed: {
    ...mapState('admin/marketing-indicators', [
      'growthIndicators',
      'isGrowthSavingProcess',
      'isGrowthFetchingProcess',
    ]),

    ...mapGetters('admin/marketing-indicators', [
      'growthDatepickerEvents',
    ]),

    growthAreaChartData() {
      const xAxis = [];
      const series = [];
      const keys = Object.keys(this.values).sort((a, b) => {
        const [ad, am, ay] = a.split('.');
        const [bd, bm, by] = b.split('.');

        if (ay === by && am === bm) {
          return ad - bd;
        }

        if (ay === by) {
          return am - bm;
        }
        return ay - by;
      });

      const { length } = keys;
      let i = length > 7 ? length - 7 : 0;

      if (length > 0) {
        for (i; i < length; i += 1) {
          const dateParts = keys[i].split('.');

          if (dateParts[0] < 10) {
            dateParts[0] = `0${dateParts[0]}`;
          }

          if (dateParts[1] < 10) {
            dateParts[1] = `0${parseInt(dateParts[1], 10) + 1}`;
          } else {
            dateParts[1] = parseInt(dateParts[1], 10) + 1;
          }

          xAxis.push(`${dateParts[0]}.${dateParts[1]}`);
          series.push(this.values[keys[i]]);
        }
      }

      return {
        xAxis,
        series,
      };
    },

    selectedDateKeyInStore() {
      const day = this.selectedDate.getDate();
      const month = this.selectedDate.getMonth();
      const year = this.selectedDate.getFullYear();

      return `${day}.${month}.${year}`;
    },

    isDataForThisDateExist() {
      return this.selectedDateKeyInStore in this.values;
    },

    inputValue: {
      get() {
        if (this.isDataForThisDateExist) {
          return this.values[this.selectedDateKeyInStore];
        }

        return 'На выбранную дату данных нет';
      },

      set(value) {
        this.values[this.selectedDateKeyInStore] = parseInt(value, 10);
      },
    },

    growthErrors() {
      const errors = [];

      if (!this.$v.inputValue.$dirty) return errors;

      if (!this.$v.inputValue.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.inputValue.numeric) errors.push(this.$t('block-errors.field-must-be-numeric'));
      if (!this.$v.inputValue.minValue) {
        errors.push(this.$t('block-errors.field-must-be-min-value', {
          value: this.$v.inputValue.$params.minValue.min,
        }));
      }
      if (!this.$v.inputValue.maxValue) {
        errors.push(this.$t('block-errors.field-must-be-max-value', {
          value: this.$v.inputValue.$params.maxValue.max,
        }));
      }

      return errors;
    },
  },

  methods: {
    ...mapActions('admin/marketing-indicators', {
      fetchGrowthIndicators: 'FETCH_GROWTH_INDICATORS',
      createGrowthIndicator: 'CREATE_GROWTH_INDICATOR',
      updateGrowthIndicator: 'UPDATE_GROWTH_INDICATOR',
      deleteGrowthIndicator: 'DELETE_GROWTH_INDICATOR',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        if (this.isCreating) {
          this.create();
        }

        if (this.isEditing) {
          this.update();
        }
      }
    },

    create() {
      this.createGrowthIndicator({
        createdAt: this.selectedDate,
        value: parseInt(this.inputValue, 10),
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    update() {
      this.updateGrowthIndicator({
        id: this.growthIndicators[this.selectedDateKeyInStore].id,
        value: parseInt(this.inputValue, 10),
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    delete() {
      this.deleteGrowthIndicator(this.growthIndicators[this.selectedDateKeyInStore].id)
        .then(() => {
          this.cancelAnyMode();
          this.$buefy.toast.open({
            message: this.$t('page-admin-marketing-indicators.dialog-indicator-deleted'),
            type: 'is-success',
          });
        });
    },

    askIndicatorDeletion() {
      this.$buefy.dialog.confirm({
        title: this.$t('page-admin-marketing-indicators.dialog-indicator-delete-title'),
        message: this.$t('page-admin-marketing-indicators.dialog-indicator-delete-text', {
          date: this.$options.filters.date_format(this.selectedDate),
        }),
        confirmText: this.$t('page-admin-marketing-indicators.button-delete'),
        cancelText: this.$t('page-admin-marketing-indicators.button-cancel'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.delete(),
      });
    },

    setValues() {
      const values = {};

      Object.keys(this.growthIndicators).forEach((key) => {
        values[key] = this.growthIndicators[key].value;
      });

      this.values = values;
    },

    setCreateMode() {
      this.values = {
        ...this.values,
        [this.selectedDateKeyInStore]: 0,
      };

      this.isCreating = true;
    },

    setEditMode() {
      this.isEditing = true;
    },

    cancelAnyMode() {
      this.isCreating = false;
      this.isEditing = false;
      this.setValues();
      this.$v.$reset();
    },

    pickDate() {
      this.cancelAnyMode();
    },

    clearErrors() {
      this.$v.$reset();
    },
  },

  mounted() {
    this.fetchGrowthIndicators().then(() => {
      this.setValues();
    });
  },
};
</script>

<style lang="scss">
.admin-marketing-indicators__growth {
  display: flex;
  margin: 1em -1em 0;

  [disabled] .label {
    color: #7a7a7a;
  }

  .buttons {
    margin-top: 2em;
  }

  &-form {
    padding: 0 2em;
    flex: 1 1 auto;
  }
}
</style>
