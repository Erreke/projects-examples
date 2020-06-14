<template>
  <b-modal :active.sync="isActive" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
      </header>
      <section class="modal-card-body">
        <b-field
          label="Имя"
          :message="firstNameErrors"
          :type="{ 'is-danger': firstNameErrors.length }"
        >
          <b-input
            icon="account"
            v-model="$v.firstName.$model"
            placeholder="Введите имя клиента"
            :disabled="isClientSaving"
            @input="handleInput('firstName')"
          />
        </b-field>

        <b-field
          label="Фамилия"
          :message="secondNameErrors"
          :type="{ 'is-danger': secondNameErrors.length }"
        >
          <b-input
            icon="account"
            v-model="$v.secondName.$model"
            placeholder="Введите фамилию клиента"
            :disabled="isClientSaving"
            @input="handleInput('secondName')"
          />
        </b-field>

        <b-field
          label="Е-мейл"
          :message="emailErrors"
          :type="{ 'is-danger': emailErrors.length }"
        >
          <b-input
            icon="email"
            v-model="$v.email.$model"
            placeholder="Введите электронную почту клиента"
            :disabled="isClientSaving"
            @input="handleInput('email')"
          />
        </b-field>

        <b-field
          label="Телефон"
          :message="phoneErrors"
          :type="{ 'is-danger': phoneErrors.length }"
        >
          <b-input
            icon="phone"
            v-model="$v.phone.$model"
            placeholder="Введите телефонный номер клиента"
            :disabled="isClientSaving"
            @input="handleInput('phone')"
          />
        </b-field>

        <b-field
          label="Город"
          :type="{ 'is-danger': cityErrors.length }"
          :message="cityErrors"
        >
          <b-autocomplete
            icon="earth"
            field="name"
            v-model.trim="$v.city.$model"
            :data="fetchedCities"
            :loading="isFetchingCities"
            :disabled="isClientSaving"
            placeholder="Введите город клиента"
            @keyup.native="debouncedFetchCities"
            @select="selectCityAndCountry"
            required
            autocomplete="none"
            @input="handleInput('city')"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-content">
                  <span>{{ props.option.name }}</span>
                  <br>
                  <small>{{ props.option.countryName }}, {{ props.option.regionName }}</small>
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>

        <b-field
          v-if="country"
          label="Страна"
        >
          <b-input
            icon="earth"
            :value="`${country}, ${region}`"
            placeholder="Введите страну клиента"
            :disabled="true"
          />
        </b-field>

        <b-field
          label="Дата рождения"
          :type="{ 'is-danger': birthdayErrors.length }"
          :message="birthdayErrors"
        >
          <date-picker
            v-model="$v.birthday.$model"
            :years-range="[-50, 50]"
            :max-date="maxDate"
            :min-date="minDate"
            :focused-date="maxDate"
            :disabled="isClientSaving"
            placeholder="Введите дату рождения клиента"
            @input="handleInput('birthday')"
          >
          </date-picker>
        </b-field>

        <div class="gender-selector">
          <label class="label">Пол</label>
          <b-field
            :type="{ 'is-danger': genderErrors.length }"
          >
            <b-radio-button
              :class="{ 'is-danger': genderErrors.length }"
              type="is-info"
              native-value="male"
              :disabled="isClientSaving"
              v-model.trim="$v.gender.$model"
              @input="handleInput('gender')"
            >
              <b-icon pack="fas" icon="male"></b-icon>
              <span>{{ $t('block-auth.gender-male') }}</span>
            </b-radio-button>
            <b-radio-button
              :class="{ 'is-danger': genderErrors.length }"
              type="is-danger"
              native-value="female"
              :disabled="isClientSaving"
              v-model.trim="$v.gender.$model"
              @input="handleInput('gender')"
            >
              <b-icon pack="fas" icon="female"></b-icon>
              <span>{{ $t('block-auth.gender-female') }}</span>
            </b-radio-button>
          </b-field>
          <span
            v-if="genderErrors.length"
            :class="['help', { 'is-danger': genderErrors.length }]"
          >{{ genderErrors[0] }}</span>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button
          type="button"
          class="button"
          :disabled="isClientSaving"
          @click="isActive = false"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>{{ $t("page-admin-clients.button-cancel") }}</span>
        </button>
        <button
          type="button"
          :class="['button is-success', { 'is-loading': isClientSaving }]"
          :disabled="isClientSaving"
          @click.prevent="addOrEditClient"
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
import debounce from 'lodash/debounce';
import { mapState, mapActions, mapMutations } from 'vuex';

import {
  required, minLength, maxLength, email,
} from 'vuelidate/lib/validators';

import i18nAlpha from '@/utils/validators/i18n-alpha';
import phone from '@/utils/validators/phone';
import alreadyInUse from '@/utils/validators/already-in-use';
import requiredFromServer from '@/utils/validators/required-from-server';
import invalidFromServer from '@/utils/validators/invalid-from-server';
import minLengthFromServer from '@/utils/validators/min-length-from-server';
import maxLengthFromServer from '@/utils/validators/max-length-from-server';

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const SECOND_NAME_MIN_LENGTH = 2;
const SECOND_NAME_MAX_LENGTH = 32;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;

export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },

  components: {
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
  },

  data() {
    return {
      firstName: '',
      secondName: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      region: '',
      birthday: null,
      gender: '',
    };
  },

  validations: {
    firstName: {
      required,
      i18nAlpha,
      minLength: minLength(FIRST_NAME_MIN_LENGTH),
      maxLength: maxLength(FIRST_NAME_MAX_LENGTH),
      requiredFromServer: requiredFromServer('first-name', ['admin', 'clients', 'clientCreatingErrors']),
      invalidFromServer: invalidFromServer('first-name', ['admin', 'clients', 'clientCreatingErrors']),
      minLengthFromServer: minLengthFromServer('first-name', ['admin', 'clients', 'clientCreatingErrors'], FIRST_NAME_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('first-name', ['admin', 'clients', 'clientCreatingErrors'], FIRST_NAME_MAX_LENGTH),
    },
    secondName: {
      required,
      i18nAlpha,
      minLength: minLength(SECOND_NAME_MIN_LENGTH),
      maxLength: maxLength(SECOND_NAME_MAX_LENGTH),
      requiredFromServer: requiredFromServer('second-name', ['admin', 'clients', 'clientCreatingErrors']),
      invalidFromServer: invalidFromServer('second-name', ['admin', 'clients', 'clientCreatingErrors']),
      minLengthFromServer: minLengthFromServer('second-name', ['admin', 'clients', 'clientCreatingErrors'], SECOND_NAME_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('second-name', ['admin', 'clients', 'clientCreatingErrors'], SECOND_NAME_MAX_LENGTH),
    },
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
      emailAlreadyInUse: alreadyInUse('email', ['admin', 'clients', 'clientCreatingErrors']),
      requiredFromServer: requiredFromServer('email', ['admin', 'clients', 'clientCreatingErrors']),
      invalidFromServer: invalidFromServer('email', ['admin', 'clients', 'clientCreatingErrors']),
      minLengthFromServer: minLengthFromServer('email', ['admin', 'clients', 'clientCreatingErrors'], EMAIL_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('email', ['admin', 'clients', 'clientCreatingErrors'], EMAIL_MAX_LENGTH),
    },
    phone: {
      required,
      phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
      phoneAlreadyInUse: alreadyInUse('phone-number', ['admin', 'clients', 'clientCreatingErrors']),
      requiredFromServer: requiredFromServer('phone', ['admin', 'clients', 'clientCreatingErrors']),
      invalidFromServer: invalidFromServer('phone', ['admin', 'clients', 'clientCreatingErrors']),
      minLengthFromServer: minLengthFromServer('phone', ['admin', 'clients', 'clientCreatingErrors'], PHONE_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('phone', ['admin', 'clients', 'clientCreatingErrors'], PHONE_MAX_LENGTH),
    },
    country: {
      required,
    },
    region: {
      required,
    },
    city: {
      required,
    },
    birthday: {
      required,
    },
    gender: {
      required,
    },
  },

  computed: {
    ...mapState('admin/clients', [
      'isClientSaving',
      'clientCreatingErrors',
    ]),

    ...mapState('user', [
      'fetchedCities',
      'cityFetchingError',
      'isFetchingCities',
    ]),

    isActive: {
      get() {
        return this.isOpened;
      },

      set(value) {
        if (!value && !this.isClientSaving) {
          this.$emit('close');
        }
      },
    },

    firstNameErrors() {
      const errors = [];

      if (!this.$v.firstName.$dirty) return errors;

      if (!this.$v.firstName.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.firstName.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-first-name'));
      if (!this.$v.firstName.minLength) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.firstName.$params.minLength.min,
        }));
      }
      if (!this.$v.firstName.maxLength) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.firstName.$params.maxLength.max,
        }));
      }
      if (!this.$v.firstName.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.firstName.invalidFromServer) errors.push(this.$t('block-errors.first-name-must-be-valid'));
      if (!this.$v.firstName.minLengthFromServer) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.firstName.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.firstName.maxLengthFromServer) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.firstName.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    secondNameErrors() {
      const errors = [];

      if (!this.$v.secondName.$dirty) return errors;

      if (!this.$v.secondName.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.secondName.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-first-name'));
      if (!this.$v.secondName.minLength) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.secondName.$params.minLength.min,
        }));
      }
      if (!this.$v.secondName.maxLength) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.secondName.$params.maxLength.max,
        }));
      }
      if (!this.$v.secondName.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.secondName.invalidFromServer) errors.push(this.$t('block-errors.first-name-must-be-valid'));
      if (!this.$v.secondName.minLengthFromServer) {
        errors.push(this.$t('block-errors.first-name-must-be-min-length', {
          length: this.$v.secondName.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.secondName.maxLengthFromServer) {
        errors.push(this.$t('block-errors.first-name-must-be-max-length', {
          length: this.$v.secondName.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.email.email) errors.push(this.$t('block-errors.email-must-be-valid'));
      if (!this.$v.email.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.email.$params.minLength.min,
        }));
      }
      if (!this.$v.email.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.email.$params.maxLength.max,
        }));
      }
      if (!this.$v.email.emailAlreadyInUse) errors.push(this.$t('block-errors.email-already-in-use'));
      if (!this.$v.email.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.email.invalidFromServer) errors.push(this.$t('block-errors.email-must-be-valid'));
      if (!this.$v.email.minLengthFromServer) {
        errors.push(this.$t('block-errors.email-must-be-min-length', {
          length: this.$v.email.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.email.maxLengthFromServer) {
        errors.push(this.$t('block-errors.email-must-be-max-length', {
          length: this.$v.email.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    phoneErrors() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      if (!this.$v.phone.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.phone.phone) errors.push(this.$t('block-errors.field-must-be-phone'));
      if (!this.$v.phone.minLength) {
        errors.push(this.$t('block-errors.phone-must-be-min-length', {
          length: this.$v.phone.$params.minLength.min,
        }));
      }
      if (!this.$v.phone.maxLength) {
        errors.push(this.$t('block-errors.phone-must-be-max-length', {
          length: this.$v.phone.$params.maxLength.max,
        }));
      }
      if (!this.$v.phone.phoneAlreadyInUse) errors.push(this.$t('block-errors.phone-already-in-use'));
      if (!this.$v.phone.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.phone.invalidFromServer) errors.push(this.$t('block-errors.phone-must-be-valid'));
      if (!this.$v.phone.minLengthFromServer) {
        errors.push(this.$t('block-errors.phone-must-be-min-length', {
          length: this.$v.phone.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.phone.maxLengthFromServer) {
        errors.push(this.$t('block-errors.phone-must-be-max-length', {
          length: this.$v.phone.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    cityErrors() {
      const errors = [];

      if (!this.$v.city.$dirty && !this.$v.region.$dirty && !this.$v.country.$dirty) return errors;

      if (!this.$v.city.required && !this.$v.region.required && !this.$v.country.required) errors.push(this.$t('block-errors.field-is-required'));

      if (this.cityFetchingError === 'ARGUMENTS_NOT_VALID') {
        errors.push(this.$t('block-errors.arguments-not-valid'));
      }

      if (this.cityFetchingError === 'CITY_NOT_FOUND') {
        errors.push(this.$t('block-errors.city-not-found'));
      }

      return errors;
    },

    birthdayErrors() {
      const errors = [];
      if (!this.$v.birthday.$dirty) return errors;

      if (!this.$v.birthday.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    genderErrors() {
      const errors = [];

      if (!this.$v.gender.$dirty) return errors;

      if (!this.$v.gender.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    formErrors() {
      const errors = [];

      if (this.clientCreatingErrors.indexOf('unknown-error') > -1) errors.push(this.$t('block-errors.unknown-error'));

      return errors;
    },

    minDate() {
      const now = new Date();

      return new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    },

    maxDate() {
      const now = new Date();

      return new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    },
  },

  methods: {
    ...mapActions('admin/clients', {
      createClient: 'CREATE_CLIENT',
    }),

    ...mapActions('user', {
      fetchCities: 'FETCH_CITIES',
    }),

    ...mapMutations('admin/clients', {
      clearError: 'CLEAR_CLIENT_CREATING_ERROR',
    }),

    selectCityAndCountry(option) {
      this.country = option.countryName;
      this.region = option.regionName;
      this.city = option.name;
    },

    handleInput(key) {
      this.clearError(key);
      this.$v[key].$reset();
    },

    addOrEditClient() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.createClient({
          firstName: this.firstName,
          secondName: this.secondName,
          email: this.email,
          phone: this.phone,
          city: this.city,
          country: this.country,
          region: this.region,
          birthday: this.birthday,
          gender: this.gender,
        })
          .then((response) => {
            if (response) {
              this.isActive = false;
              this.firstName = '';
              this.secondName = '';
              this.email = '';
              this.phone = '';
              this.city = '';
              this.country = '';
              this.region = '';
              this.birthday = null;
              this.gender = '';
            }
          });
      }
    },

    handleFetchCities(event) {
      this.fetchCities(event.target.value);
    },
  },

  created() {
    this.debouncedFetchCities = debounce(this.handleFetchCities, 350);
  },
};
</script>

<style lang="scss">
.gender-selector {
  margin-bottom: 1.75rem;

  .field {
    margin: 0;
  }

  & .is-danger label {
    color: #ff3860;
    border-color: #ff3860;
  }
}
</style>
