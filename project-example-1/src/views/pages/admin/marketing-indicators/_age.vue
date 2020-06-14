<template>
  <div class="admin-marketing-indicators__age">
    <date-picker
      v-model="selectedDate"
      :max-date="todayDate"
      :events="ageDatepickerEvents"
      :years-range="[-5, 1]"
      indicators="bars"
      :inline="true"
      @input="pickDate"
    >
    </date-picker>


    <form @submit.prevent="submitForm" class="admin-marketing-indicators__age-form content">
      <p>{{ selectedDate | date_format }}</p>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-under-18')"
      >
        <b-slider
          size="is-medium"
          v-model="under18"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-between-18-25')"
      >
        <b-slider
          size="is-medium"
          v-model="between1825"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-between-26-35')"
      >
        <b-slider
          size="is-medium"
          v-model="between2635"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-between-36-55')"
      >
        <b-slider
          size="is-medium"
          v-model="between3655"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-between-56-85')"
      >
        <b-slider
          size="is-medium"
          v-model="between5685"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-more-85')"
      >
        <b-slider
          size="is-medium"
          v-model="more85"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
          :custom-formatter="val => val + '%'"
        >
          <template v-for="val in [25, 50, 75]">
            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>

      <b-field
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
        :label="$t('page-admin-marketing-indicators.label-age-unknown')"
      >
        <b-slider
          size="is-medium"
          v-model="unknownAge"
          :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
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
        :disabled="(!isCreating && !isEditing) || isAgeSavingProcess"
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
          :loading="isAgeSavingProcess"
          :disabled="isAgeSavingProcess"
        >
          {{ $t("page-admin-marketing-indicators.button-save") }}
        </b-button>

        <b-button
          icon-left="cancel"
          :disabled="isAgeSavingProcess"
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

    <bar-chart
      width="400px"
      :data="ageBarChartData"
      :is-loading="isAgeFetchingProcess"
      :no-data-text="noDataText"
      :is-legend-active="false"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { CHART_COLORS } from '@/config';

export default {
  components: {
    BarChart: () => import('@/views/blocks/charts/_bar-chart.vue'),
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
  },

  data() {
    return {
      isCreating: false,
      isEditing: false,
      selectedDate: new Date(),
      todayDate: new Date(),

      under18: 0,
      between1825: 0,
      between2635: 0,
      between3655: 0,
      between5685: 0,
      more85: 0,
      unknownAge: 0,
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
      'ageIndicators',
      'isAgeSavingProcess',
      'isAgeFetchingProcess',
    ]),

    ...mapGetters('admin/marketing-indicators', [
      'ageDatepickerEvents',
    ]),

    selectedDateKeyInStore() {
      const day = this.selectedDate.getDate();
      const month = this.selectedDate.getMonth();
      const year = this.selectedDate.getFullYear();

      return `${day}.${month}.${year}`;
    },

    isDataForThisDateExist() {
      return this.selectedDateKeyInStore in this.ageIndicators;
    },

    noDataText() {
      if ((this.isCreating || this.isEditing) && this.summAllFields === 0) {
        return this.$t('page-admin-marketing-indicators.chart-start-drag-sliders');
      }

      return this.$t('page-admin-marketing-indicators.chart-no-data');
    },

    summAllFields() {
      return this.under18
        + this.between1825
        + this.between2635
        + this.between3655
        + this.between5685
        + this.more85
        + this.unknownAge;
    },

    ageBarChartData() {
      if (this.summAllFields === 0) {
        return [];
      }

      const under18 = {
        name: '< 18',
        type: 'bar',
        barGap: 0,
        data: [this.under18],
        color: CHART_COLORS[0],
      };

      const between1825 = {
        name: '18-25',
        type: 'bar',
        barGap: 0,
        data: [this.between1825],
        color: CHART_COLORS[1],
      };

      const between2635 = {
        name: '26-35',
        type: 'bar',
        barGap: 0,
        data: [this.between2635],
        color: CHART_COLORS[2],
      };

      const between3655 = {
        name: '36-55',
        type: 'bar',
        barGap: 0,
        data: [this.between3655],
        color: CHART_COLORS[3],
      };

      const between5685 = {
        name: '56-85',
        type: 'bar',
        barGap: 0,
        data: [this.between5685],
        color: CHART_COLORS[4],
      };

      const more85 = {
        name: '85 <',
        type: 'bar',
        barGap: 0,
        data: [this.more85],
        color: CHART_COLORS[5],
      };

      const unknownAge = {
        name: this.$t('block-global.undefined'),
        type: 'bar',
        barGap: 0,
        data: [this.unknownAge],
        color: CHART_COLORS[6],
      };

      return [
        this.under18 > 0 ? under18 : null,
        this.between1825 > 0 ? between1825 : null,
        this.between2635 > 0 ? between2635 : null,
        this.between3655 > 0 ? between3655 : null,
        this.between5685 > 0 ? between5685 : null,
        this.more85 > 0 ? more85 : null,
        this.unknownAge > 0 ? unknownAge : null,
      ];
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
      fetchAgeIndicators: 'FETCH_AGE_INDICATORS',
      createAgeIndicator: 'CREATE_AGE_INDICATOR',
      updateAgeIndicator: 'UPDATE_AGE_INDICATOR',
      deleteAgeIndicator: 'DELETE_AGE_INDICATOR',
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
      this.createAgeIndicator({
        createdAt: this.selectedDate,
        under18: parseInt(this.under18, 10),
        between1825: parseInt(this.between1825, 10),
        between2635: parseInt(this.between2635, 10),
        between3655: parseInt(this.between3655, 10),
        between5685: parseInt(this.between5685, 10),
        more85: parseInt(this.more85, 10),
        unknownAge: parseInt(this.unknownAge, 10),
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    update() {
      this.updateAgeIndicator({
        id: this.ageIndicators[this.selectedDateKeyInStore].id,
        under18: parseInt(this.under18, 10),
        between1825: parseInt(this.between1825, 10),
        between2635: parseInt(this.between2635, 10),
        between3655: parseInt(this.between3655, 10),
        between5685: parseInt(this.between5685, 10),
        more85: parseInt(this.more85, 10),
        unknownAge: parseInt(this.unknownAge, 10),
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    delete() {
      this.deleteAgeIndicator(this.ageIndicators[this.selectedDateKeyInStore].id)
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
        this.under18 = this.ageIndicators[this.selectedDateKeyInStore].under18;
        this.between1825 = this.ageIndicators[this.selectedDateKeyInStore].between1825;
        this.between2635 = this.ageIndicators[this.selectedDateKeyInStore].between2635;
        this.between3655 = this.ageIndicators[this.selectedDateKeyInStore].between3655;
        this.between5685 = this.ageIndicators[this.selectedDateKeyInStore].between5685;
        this.more85 = this.ageIndicators[this.selectedDateKeyInStore].more85;
        this.unknownAge = this.ageIndicators[this.selectedDateKeyInStore].unknownAge;
      } else {
        this.under18 = 0;
        this.between1825 = 0;
        this.between2635 = 0;
        this.between3655 = 0;
        this.between5685 = 0;
        this.more85 = 0;
        this.unknownAge = 0;
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
    this.fetchAgeIndicators()
      .then(() => {
        this.setSlidersValue();
      });
  },
};
</script>

<style lang="scss">
.admin-marketing-indicators__age {
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
