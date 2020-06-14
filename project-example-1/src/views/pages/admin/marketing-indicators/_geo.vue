<template>
  <div class="admin-marketing-indicators__geo">
    <city-add-dialog
      :is-opened="isCityAddDialogOpened"
      @close="isCityAddDialogOpened = false"
    />

    <city-edit-dialog
      :is-opened="isCityEditDialogOpened"
      :selected-city="selectedCity"
      @close="isCityEditDialogOpened = false"
    />

    <date-picker
      v-model="selectedDate"
      :max-date="todayDate"
      :events="geoDatepickerEvents"
      :years-range="[-5, 1]"
      indicators="bars"
      :inline="true"
      @input="pickDate"
    >
    </date-picker>

    <form @submit.prevent="submitForm" class="admin-marketing-indicators__geo-form content">
      <p>{{ selectedDate | date_format }}</p>

      <b-collapse
        v-if="isCreating || isEditing"
        class="admin-marketing-indicators__geo-collapse"
        :open="true"
        position="is-top"
        aria-id="contentIdForA11y1"
      >
        <a
          class="admin-marketing-indicators__geo-collapser"
          slot="trigger"
          slot-scope="props"
          aria-controls="contentIdForA11y1"
        >
            <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
            {{
              !props.open
                ? $t('page-admin-marketing-indicators.collapse-show-cities')
                : $t('page-admin-marketing-indicators.collapse-hide-cities')
              }}
        </a>

        <div class="admin-marketing-indicators__geo-multiple-select-container">
          <multiple-select
            v-model="selectedCity"
            :items="geoCities"
            :current-data="currentData.keys"
            :is-loading="isGeoCitiesFetchingProcess"
            :is-disabled="isGeoSavingProcess"
            class="admin-marketing-indicators__geo-multiple-select"
          />

          <div class="admin-marketing-indicators__geo-city-list-btns">
            <button
              v-if="isCreating || isEditing"
              type="button"
              class="button is-small is-warning admin-marketing-indicators__geo-city-list-btn"
              :disabled="!selectedCity || isGeoSavingProcess"
              @click="editCityInList"
            >
              <span class="icon is-small">
                <i class="mdi mdi-square-edit-outline"></i>
              </span>
            </button>

            <button
              v-if="isCreating || isEditing"
              type="button"
              class="button is-small is-success admin-marketing-indicators__geo-city-list-btn"
              :disabled="isGeoSavingProcess"
              @click="addCityToList"
            >
              <span class="icon is-small">
                <i class="mdi mdi-plus"></i>
              </span>
            </button>

            <button
              v-if="isCreating || isEditing"
              type="button"
              class="button is-small is-danger admin-marketing-indicators__geo-city-list-btn"
              :disabled="!selectedCity || isGeoSavingProcess"
              @click="askDeletionCityFromList"
            >
              <span class="icon is-small">
                <i class="mdi mdi-minus"></i>
              </span>
            </button>
          </div>
        </div>

        <b-button
          type="is-success"
          icon-right="arrow-down"
          :disabled="!selectedCity || isGeoSavingProcess"
          @click="addCityToChart"
        >
          {{ $t("page-admin-marketing-indicators.button-add-to-chart") }}
        </b-button>
      </b-collapse>

      <div v-if="currentData.keys && currentData.values">
        <b-field
          v-for="(item, key) in currentData.keys"
          :key="key"
          grouped
        >
          <b-field
            :disabled="(!isCreating && !isEditing) || isGeoSavingProcess"
            :label="item"
            expanded
          >
            <b-slider
              size="is-medium"
              :value="currentData.values[key]"
              :disabled="(!isCreating && !isEditing) || isGeoSavingProcess"
              :custom-formatter="val => val + '%'"
              @change="(value) => sliderChange(key, value)"
            >
              <template v-for="val in [25, 50, 75]">
                <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
              </template>
            </b-slider>
          </b-field>

          <b-field v-if="isCreating || isEditing">
            <button
              type="button"
              class="button is-small is-danger admin-marketing-indicators__geo-remove-city"
              :disabled="isGeoSavingProcess"
              @click="removeCityFromChart(key)"
            >
              <span class="icon is-small">
                <i class="mdi mdi-close"></i>
              </span>
            </button>
          </b-field>
        </b-field>
      </div>

      <b-field
        :type="formErrors.length ? 'is-danger' : null"
        :message="formErrors"
        :disabled="(!isCreating && !isEditing) || isGeoSavingProcess"
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
          :loading="isGeoSavingProcess"
          :disabled="isGeoSavingProcess"
        >
          {{ $t("page-admin-marketing-indicators.button-save") }}
        </b-button>

        <b-button
          icon-left="cancel"
          :disabled="isGeoSavingProcess"
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
      :data="geoBarChartData"
      :is-loading="isGeoFetchingProcess"
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
    MultipleSelect: () => import('@/views/blocks/multiple-select.vue'),
    CityEditDialog: () => import('./_geo-city-edit-dialog.vue'),
    CityAddDialog: () => import('./_geo-city-add-dialog.vue'),
  },

  data() {
    return {
      isCreating: false,
      isEditing: false,
      selectedDate: new Date(),
      todayDate: new Date(),
      selectedCity: null,
      currentData: {
        keys: [],
        values: [],
      },
      isCityEditDialogOpened: false,
      isCityAddDialogOpened: false,
    };
  },

  validations: {
    summ: {
      moreZero() {
        return this.summAllFields > 0;
      },

      lessOrEqualHundred() {
        return this.summAllFields <= 100;
      },
    },
  },

  computed: {
    ...mapState('admin/marketing-indicators', [
      'geoCities',
      'geoIndicators',
      'isGeoSavingProcess',
      'isGeoFetchingProcess',
      'isGeoCitiesFetchingProcess',
    ]),

    ...mapGetters('admin/marketing-indicators', [
      'geoDatepickerEvents',
    ]),

    selectedDateKeyInStore() {
      const day = this.selectedDate.getDate();
      const month = this.selectedDate.getMonth();
      const year = this.selectedDate.getFullYear();

      return `${day}.${month}.${year}`;
    },

    geoBarChartData() {
      return this.currentData.keys.map((key, index) => ({
        name: key,
        type: 'bar',
        barGap: 0,
        data: [this.currentData.values[index]],
        color: CHART_COLORS[index],
      }));
    },

    summAllFields() {
      if (this.currentData.values.length) {
        return this.currentData.values.reduce((prev, curr) => prev + curr, 0);
      }

      return 0;
    },

    isDataForThisDateExist() {
      return this.selectedDateKeyInStore in this.geoIndicators;
    },

    noDataText() {
      if ((this.isCreating || this.isEditing) && this.summAllFields === 0) {
        return this.$t('page-admin-marketing-indicators.chart-add-and-start-drag-sliders');
      }

      return this.$t('page-admin-marketing-indicators.chart-no-data');
    },

    formErrors() {
      const errors = [];

      if (!this.$v.summ.$dirty) return errors;

      if (!this.$v.summ.moreZero) {
        errors.push(this.$t('block-errors.summ-all-fields-must-be-more-zero'));
      }

      if (!this.$v.summ.lessOrEqualHundred) {
        errors.push(this.$t('block-errors.summ-all-fields-must-be-less-or-equal-hundred'));
      }

      return errors;
    },
  },

  methods: {
    ...mapActions('admin/marketing-indicators', {
      fetchGeoCities: 'FETCH_GEO_CITIES',
      fetchGeoIndicators: 'FETCH_GEO_INDICATORS',
      createGeoIndicator: 'CREATE_GEO_INDICATOR',
      updateGeoIndicator: 'UPDATE_GEO_INDICATOR',
      deleteGeoIndicator: 'DELETE_GEO_INDICATOR',
      deleteGeoCity: 'DELETE_GEO_CITY',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        if (this.isCreating) {
          this.createIndicator();
        }

        if (this.isEditing) {
          this.updateIndicator();
        }
      }
    },

    createIndicator() {
      this.createGeoIndicator({
        createdAt: this.selectedDate,
        keys: this.currentData.keys,
        values: this.currentData.values,
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    updateIndicator() {
      this.updateGeoIndicator({
        id: this.currentData.id,
        keys: this.currentData.keys,
        values: this.currentData.values,
      })
        .then(() => {
          this.cancelAnyMode();
        });
    },

    deleteIndicator() {
      this.deleteGeoIndicator(this.geoIndicators[this.selectedDateKeyInStore].id)
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
        onConfirm: () => this.deleteIndicator(),
      });
    },

    pickDate() {
      this.cancelAnyMode();
    },

    setSlidersValue() {
      if (this.isDataForThisDateExist) {
        this.currentData = {
          ...this.geoIndicators[this.selectedDateKeyInStore],
          keys: [...this.geoIndicators[this.selectedDateKeyInStore].keys],
          values: [...this.geoIndicators[this.selectedDateKeyInStore].values],
        };
      } else {
        this.currentData = {
          keys: [],
          values: [],
        };
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
      this.selectedCity = null;
      this.setSlidersValue();
      this.$v.$reset();
    },

    addCityToChart() {
      const { keys, values } = this.currentData;

      keys.push(this.selectedCity.countryCity);
      values.push(0);

      this.currentData = {
        ...this.currentData,
        keys,
        values,
      };

      this.selectedCity = null;
    },

    removeCityFromChart(index) {
      const { keys, values } = this.currentData;

      keys.splice(index, 1);
      values.splice(index, 1);

      this.currentData = {
        ...this.currentData,
        keys,
        values,
      };

      this.selectedCity = null;
    },

    sliderChange(index, value) {
      const { values } = this.currentData;
      values[index] = value;

      this.currentData = {
        ...this.currentData,
        values,
      };
    },

    editCityInList() {
      if (this.selectedCity) {
        this.isCityEditDialogOpened = true;
      }
    },

    addCityToList() {
      this.isCityAddDialogOpened = true;
    },

    deleteCityFromList() {
      this.deleteGeoCity(this.selectedCity.id)
        .then(() => {
          this.selectedCity = null;
          this.$buefy.toast.open({
            message: this.$t('page-admin-marketing-indicators.dialog-city-deleted'),
            type: 'is-success',
          });
        });
    },

    askDeletionCityFromList() {
      this.$buefy.dialog.confirm({
        title: this.$t('page-admin-marketing-indicators.dialog-city-delete-title'),
        message: this.$t('page-admin-marketing-indicators.dialog-city-delete-text', {
          city: this.selectedCity.countryCity,
        }),
        confirmText: this.$t('page-admin-marketing-indicators.button-delete'),
        cancelText: this.$t('page-admin-marketing-indicators.button-cancel'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteCityFromList(),
      });
    },
  },

  mounted() {
    this.fetchGeoIndicators()
      .then(() => {
        this.setSlidersValue();
      });

    this.fetchGeoCities();
  },
};
</script>

<style lang="scss">
.admin-marketing-indicators__geo {
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

  &-collapse {
    margin: 1em 0;
  }

  &-collapser {
    display: block;
    margin: 1em 0;
  }

  &-multiple-select-container {
    display: flex;
    margin-bottom: 1em;
  }

  &-multiple-select {
    flex: 1 1 auto;
  }

  &-remove-city {
    margin-top: 2.5em;
  }

  &-city-list-btns {
    margin-left: .75em;
  }

  &-city-list-btn {
    display: block;
    margin-bottom: 1em;
  }

  .field.is-grouped,
  .field.is-expanded {
    margin: 0;
  }
}
</style>
