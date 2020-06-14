<template>
  <div class="admin-marketing-indicators__gender">
    <date-picker
      v-model="selectedDate"
      :max-date="todayDate"
      :events="genderDatepickerEvents"
      :years-range="[-5, 1]"
      indicators="bars"
      :inline="true"
      @input="pickDate"
    >
    </date-picker>

    <form @submit.prevent="submitForm" class="admin-marketing-indicators__gender-form content">
      <p>{{ selectedDate | date_format }}</p>

      <b-field
        :label="$t('page-admin-marketing-indicators.label-gender-male')"
        :disabled="(!isCreating && !isEditing) || isGenderSavingProcess"
      >
        <b-slider
          size="is-medium"
          v-model="genderMale"
          :disabled="(!isCreating && !isEditing) || isGenderSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :label="$t('page-admin-marketing-indicators.label-gender-female')"
        :disabled="(!isCreating && !isEditing) || isGenderSavingProcess"
      >
        <b-slider
          size="is-medium"
          v-model="genderFemale"
          :disabled="(!isCreating && !isEditing) || isGenderSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :type="formErrors.length ? 'is-danger' : null"
        :message="formErrors"
        :disabled="(!isCreating && !isEditing) || isGenderSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-summ-all-fields')"
      >
        <b-input
          :value="summAllFields"
          :disabled="true"
        />
      </b-field>

      <div class="buttons" v-if="isCreating || isEditing" key="form-buttons">
        <b-button
          type="is-success"
          native-type="submit"
          icon-left="check"
          :loading="isGenderSavingProcess"
          :disabled="isGenderSavingProcess"
        >
          {{ $t("page-admin-marketing-indicators.button-save") }}
        </b-button>

        <b-button
          icon-left="cancel"
          :disabled="isGenderSavingProcess"
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

    <pie-chart
      width="400px"
      :data="genderPieChartData"
      :is-loading="isGenderFetchingProcess"
      :no-data-text="noDataText"
      :is-legend-active="false"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  components: {
    PieChart: () => import('@/views/blocks/charts/_pie-chart.vue'),
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
  },

  data() {
    return {
      isCreating: false,
      isEditing: false,
      genderMale: 0,
      genderFemale: 0,
      selectedDate: new Date(),
      todayDate: new Date(),
    };
  },

  validations: {
    summ: {
      equalHundred() {
        return this.summAllFields === 100;
      },
    },
  },

  computed: {
    ...mapState('admin/marketing-indicators', [
      'genderIndicators',
      'isGenderSavingProcess',
      'isGenderFetchingProcess',
    ]),

    ...mapGetters('admin/marketing-indicators', [
      'genderDatepickerEvents',
    ]),

    selectedDateKeyInStore() {
      const day = this.selectedDate.getDate();
      const month = this.selectedDate.getMonth();
      const year = this.selectedDate.getFullYear();

      return `${day}.${month}.${year}`;
    },

    isDataForThisDateExist() {
      return this.selectedDateKeyInStore in this.genderIndicators;
    },

    genderPieChartData() {
      const chartData = [
        {
          name: this.$t('block-global.gender-female'),
          value: 0,
        },
        {
          name: this.$t('block-global.gender-male'),
          value: 0,
        },
      ];

      if (this.isDataForThisDateExist && !this.isCreating && !this.isEditing) {
        chartData[0].value = this.genderIndicators[this.selectedDateKeyInStore].female;
        chartData[1].value = this.genderIndicators[this.selectedDateKeyInStore].male;

        return chartData;
      }

      if (this.isCreating) {
        if (this.genderMale === 0 && this.genderFemale === 0) {
          return [];
        }

        chartData[0].value = this.genderFemale;
        chartData[1].value = this.genderMale;

        return chartData;
      }

      if (this.isEditing) {
        chartData[0].value = this.genderFemale;
        chartData[1].value = this.genderMale;

        return chartData;
      }

      return [];
    },

    noDataText() {
      if ((this.isCreating || this.isEditing) && this.summAllFields === 0) {
        return this.$t('page-admin-marketing-indicators.chart-start-drag-sliders');
      }

      return this.$t('page-admin-marketing-indicators.chart-no-data');
    },

    summAllFields() {
      return this.genderMale + this.genderFemale;
    },

    formErrors() {
      const errors = [];

      if (!this.$v.summ.$dirty) return errors;

      if (!this.$v.summ.equalHundred) {
        errors.push(this.$t('block-errors.summ-all-fields-must-be-hundred'));
      }

      return errors;
    },
  },

  methods: {
    ...mapActions('admin/marketing-indicators', {
      fetchGenderIndicators: 'FETCH_GENDER_INDICATORS',
      createGenderIndicator: 'CREATE_GENDER_INDICATOR',
      updateGenderIndicator: 'UPDATE_GENDER_INDICATOR',
      deleteGenderIndicator: 'DELETE_GENDER_INDICATOR',
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
      this.createGenderIndicator({
        createdAt: this.selectedDate,
        male: parseInt(this.genderMale, 10),
        female: parseInt(this.genderFemale, 10),
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    update() {
      this.updateGenderIndicator({
        id: this.genderIndicators[this.selectedDateKeyInStore].id,
        male: parseInt(this.genderMale, 10),
        female: parseInt(this.genderFemale, 10),
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    delete() {
      this.deleteGenderIndicator(this.genderIndicators[this.selectedDateKeyInStore].id)
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

    pickDate() {
      this.cancelAnyMode();
    },

    setSlidersValue() {
      if (this.isDataForThisDateExist) {
        this.genderMale = this.genderIndicators[this.selectedDateKeyInStore].male;
        this.genderFemale = this.genderIndicators[this.selectedDateKeyInStore].female;
      } else {
        this.genderMale = 0;
        this.genderFemale = 0;
      }
    },

    setCreateMode() {
      this.isCreating = true;
    },

    setEditMode() {
      this.isEditing = true;
    },

    cancelAnyMode() {
      this.isCreating = false;
      this.isEditing = false;
      this.setSlidersValue();
      this.$v.$reset();
    },
  },

  mounted() {
    this.fetchGenderIndicators()
      .then(() => {
        this.setSlidersValue();
      });
  },

  watch: {
    genderMale(value) {
      if (this.isCreating || this.isEditing) {
        this.genderFemale = 100 - value;
      }
    },

    genderFemale(value) {
      if (this.isCreating || this.isEditing) {
        this.genderMale = 100 - value;
      }
    },
  },
};
</script>

<style lang="scss">
.admin-marketing-indicators__gender {
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
