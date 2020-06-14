<template>
  <b-modal :active.sync="isActive" has-modal-card :can-cancel="!isGeoCitySavingProcess">
    <form @submit.prevent="submit" class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ $t('page-admin-marketing-indicators.modal-add-city-title') }}
        </p>
      </header>

      <section class="modal-card-body">
        <b-field
          :label="$t('page-admin-marketing-indicators.label-country')"
          :type="{ 'is-danger': countryErrorMessages.length }"
          :message="countryErrorMessages"
        >
          <b-input
            type="text"
            name="country"
            v-model="country"
            :disabled="isGeoCitySavingProcess"
            :placeholder="$t('page-admin-marketing-indicators.placeholder-country')"
          />
        </b-field>

        <b-field
          :label="$t('page-admin-marketing-indicators.label-city')"
          :type="{ 'is-danger': cityErrorMessages.length }"
          :message="cityErrorMessages"
        >
          <b-input
            type="text"
            name="city"
            v-model="city"
            :disabled="isGeoCitySavingProcess"
            :placeholder="$t('page-admin-marketing-indicators.placeholder-city')"
          />
        </b-field>
      </section>

      <footer class="modal-card-foot">
        <button
          type="button"
          class="button is-danger"
          :disabled="isGeoCitySavingProcess"
          @click="close"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>{{ $t("page-admin-marketing-indicators.button-cancel") }}</span>
        </button>

        <button
          type="submit"
          :class="['button is-success', { 'is-loading': isGeoCitySavingProcess }]"
          :disabled="isGeoCitySavingProcess"
        >
          <span class="icon">
            <i class="mdi mdi-check"></i>
          </span>
          <span>{{ $t("page-admin-marketing-indicators.button-save") }}</span>
        </button>
      </footer>
    </form>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import i18nAlpha from '@/utils/validators/i18n-alpha';

const MIN_LENGTH = 1;
const MAX_LENGTH = 256;

export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      country: '',
      city: '',
    };
  },

  validations: {
    country: {
      required,
      i18nAlpha,
      minLength: minLength(MIN_LENGTH),
      maxLength: maxLength(MAX_LENGTH),
    },

    city: {
      required,
      i18nAlpha,
      minLength: minLength(MIN_LENGTH),
      maxLength: maxLength(MAX_LENGTH),
    },
  },

  computed: {
    ...mapState('admin/marketing-indicators', ['isGeoCitySavingProcess']),

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

    countryErrorMessages() {
      const errors = [];

      if (!this.$v.country.$dirty) return errors;

      if (!this.$v.country.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.country.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-alpha'));
      if (!this.$v.country.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.country.$params.minLength.min,
        }));
      }
      if (!this.$v.country.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.country.$params.maxLength.max,
        }));
      }

      return errors;
    },

    cityErrorMessages() {
      const errors = [];

      if (!this.$v.city.$dirty) return errors;

      if (!this.$v.city.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.city.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-alpha'));
      if (!this.$v.city.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.city.$params.minLength.min,
        }));
      }
      if (!this.$v.city.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.city.$params.maxLength.max,
        }));
      }

      return errors;
    },
  },

  methods: {
    ...mapActions('admin/marketing-indicators', {
      createGeoCity: 'CREATE_GEO_CITY',
    }),

    close() {
      this.isActive = false;
    },

    clearFields() {
      this.country = '';
      this.city = '';
    },

    submit() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.createGeoCity({
          city: this.city,
          country: this.country,
          countryCity: `${this.country}, ${this.city}`,
          createdAt: new Date(),
          createdBy: `${this.$_user.firstName} ${this.$_user.secondName}`,
          updatedAt: null,
          updatedBy: null,
        })
          .then(() => {
            this.clearFields();
            this.close();
          });
      }
    },
  },
};
</script>
