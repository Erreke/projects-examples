<template>
  <div class="enroll-to-webinar">
    <div class="enroll-to-webinar__inner">
      <b-notification
        v-if="isTimeToShowLoader"
        has-icon
        role="alert"
        type="is-info"
        icon="cloud-download"
        :closable="false"
      >
        Идет загрузка страницы...
      </b-notification>

      <b-notification
        v-if="isTimeToShowError"
        has-icon
        role="alert"
        type="is-danger"
        :closable="false"
      >
        Ошибка загрузки, попробуйте повторить позднее...
      </b-notification>

      <b-notification
        v-if="isTimeToShowResult"
        type="is-success"
        has-icon
        :closable="false"
      >
        {{ pageDetails.resultText }}
      </b-notification>

      <b-notification
        v-if="isTimeToShowAlreadyClient"
        has-icon
        role="alert"
        type="is-warning"
        class="content"
        :closable="false"
      >
        <p v-if="errorExtra">Уважаемый(ая), {{ errorExtra.name }}!</p>
        <p>Вы уже являетесь нашим клиентом.</p>
        <p>Если хотите купить еще одно бизнес-место, вы можете это сделать в разделе "<a :href="pageDetails.alreadyClientRedirectUrl">{{ pageDetails.alreadyClientRedirectText }}</a>".</p>
        <p>По любым другим вопросам можете обратиться к аккаунт-менеджеру по телефону <a :href="`tel:${pageDetails.alreadyClientPhone}`">{{ pageDetails.alreadyClientPhoneText }}</a>, либо написать в чат внизу справа этой страницы.</p>
      </b-notification>

      <b-notification
        v-if="isTimeToShowLeadNotFound"
        has-icon
        role="alert"
        type="is-warning"
        class="content"
        :closable="false"
      >
        <p>Уважаемый(ая), {{ name }}!</p>
        <p>Для того чтобы участвовать в вебинаре, вам сначала обязательно нужно подписаться на наш бот.</p>
        <p>
          <a
            class="button is-success"
            :href="pageDetails.newUserRedirectUrl"
          >Подписаться на бот</a>
        </p>
      </b-notification>

      <div class="enroll-to-webinar__video" v-if="isTimeToShowForm">
        <img width="640" height="360" src="@/assets/enroll.jpg" />

        <p v-if="pageDetails.videoTitle && isShowTimer" class="enroll-to-webinar__video-title">
          {{ pageDetails.videoTitle }}
        </p>

        <countdown :elements="countdownElements" :is-active="isShowTimer" />
      </div>

      <div
        v-if="isTimeToShowForm"
        :class="[
          'enroll-to-webinar__form content',
          { 'is-loading': isPageDetailsLoading },
          { 'is-error': isPageDetailsLoadingError },
          { 'is-enrolled': isEnrolledToWebinar },
          { 'is-already-client': isLeadAlreadyClient },
          { 'is-lead-not-found': isLeadNotFound },
        ]"
      >
        <form @submit.prevent="submitForm">
          <h1 class="enroll-to-webinar__form-title" v-if="pageDetails.title">
            {{ pageDetails.title }}
          </h1>
          <p class="enroll-to-webinar__form-subtitle" v-if="pageDetails.subtitle">
            {{ pageDetails.subtitle }}
          </p>

          <b-field
            :type="nameErrors.length ? 'is-danger' : null"
            :message="nameErrors"
          >
            <b-input
              v-model="name"
              size="is-medium"
              :placeholder="pageDetails.nameLabel"
              :disabled="isFormProcessing"
              @input="handleInput('name')"
            ></b-input>
          </b-field>

          <b-field
            :type="phoneErrors.length ? 'is-danger' : null"
            :message="phoneErrors"
          >
            <b-input
              v-model="phone"
              size="is-medium"
              :placeholder="pageDetails.phoneLabel"
              :disabled="isFormProcessing"
              @input="handleInput('phone')"
            ></b-input>
          </b-field>

          <b-field
            :type="emailErrors.length ? 'is-danger' : null"
            :message="emailErrors"
          >
            <b-input
              v-model="email"
              size="is-medium"
              :placeholder="pageDetails.emailLabel"
              :disabled="isFormProcessing"
              @input="handleInput('email')"
            ></b-input>
          </b-field>

          <b-field
            :type="cityErrors.length ? 'is-danger' : null"
            :message="cityErrors"
          >
            <b-select
              v-model="city"
              size="is-medium"
              :placeholder="pageDetails.cityLabel"
              :disabled="isFormProcessing"
              @input="handleInput('city')"
            >
              <option
                v-for="option in cities"
                :value="option.id"
                :key="option.id"
              >
                {{ option.caption }}
              </option>
            </b-select>
          </b-field>

          <b-button
            type="is-success"
            native-type="submit"
            size="is-medium"
            class="enroll-to-webinar__button"
            :loading="isFormProcessing"
            :disabled="isFormProcessing"
          >
            {{ pageDetails.buttonCaption }}
          </b-button>

          <b-notification
            v-if="generalErrors.length"
            has-icon
            role="alert"
            type="is-danger"
            :closable="false"
          >
            <ul v-if="generalErrors.length > 1">
              <li v-for="(error, key) in generalErrors" :key="key">{{ error }}</li>
            </ul>
            <p v-else>{{ generalErrors[0] }}</p>
          </b-notification>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import {
  required, minLength, maxLength, email,
} from 'vuelidate/lib/validators';
import i18nAlpha from '@/utils/validators/i18n-alpha';
import phone from '@/utils/validators/phone';
import requiredFromServer from '@/utils/validators/required-from-server';
import invalidFromServer from '@/utils/validators/invalid-from-server';
import minLengthFromServer from '@/utils/validators/min-length-from-server';
import maxLengthFromServer from '@/utils/validators/max-length-from-server';

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 32;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;
const CITY_MIN_LENGTH = 2;
const CITY_MAX_LENGTH = 128;

export default {
  name: 'EnrollToWebinarPage',

  head() {
    return {
      title: this.$t('page-enroll-to-webinar.meta-title'),
    };
  },

  components: {
    Countdown: () => import('@/components/CountDown.vue'),
  },

  data() {
    return {
      name: '',
      email: '',
      phone: '',
      city: 'almaty',
      cities: [
        {
          id: 'almaty',
          caption: 'Алматы',
        },
        {
          id: 'other',
          caption: 'Другое',
        },
      ],
      timer: null,
      countdownElements: {},
      isShowTimer: false,
    };
  },

  validations: {
    name: {
      required,
      i18nAlpha,
      minLength: minLength(FIRST_NAME_MIN_LENGTH),
      maxLength: maxLength(FIRST_NAME_MAX_LENGTH),
      requiredFromServer: requiredFromServer('name', ['enroll-to-webinar', 'formErrors']),
      invalidFromServer: invalidFromServer('name', ['enroll-to-webinar', 'formErrors']),
      minLengthFromServer: minLengthFromServer('name', ['enroll-to-webinar', 'formErrors'], FIRST_NAME_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('name', ['enroll-to-webinar', 'formErrors'], FIRST_NAME_MAX_LENGTH),
    },
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
      requiredFromServer: requiredFromServer('email', ['enroll-to-webinar', 'formErrors']),
      invalidFromServer: invalidFromServer('email', ['enroll-to-webinar', 'formErrors']),
      minLengthFromServer: minLengthFromServer('email', ['enroll-to-webinar', 'formErrors'], EMAIL_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('email', ['enroll-to-webinar', 'formErrors'], EMAIL_MAX_LENGTH),
    },
    phone: {
      required,
      phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
      requiredFromServer: requiredFromServer('phone', ['enroll-to-webinar', 'formErrors']),
      invalidFromServer: invalidFromServer('phone', ['enroll-to-webinar', 'formErrors']),
      minLengthFromServer: minLengthFromServer('phone', ['enroll-to-webinar', 'formErrors'], PHONE_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('phone', ['enroll-to-webinar', 'formErrors'], PHONE_MAX_LENGTH),
    },
    city: {
      required,
      i18nAlpha,
      minLength: minLength(CITY_MIN_LENGTH),
      maxLength: maxLength(CITY_MAX_LENGTH),
      requiredFromServer: requiredFromServer('city', ['enroll-to-webinar', 'formErrors']),
      invalidFromServer: invalidFromServer('city', ['enroll-to-webinar', 'formErrors']),
      minLengthFromServer: minLengthFromServer('city', ['enroll-to-webinar', 'formErrors'], CITY_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('city', ['enroll-to-webinar', 'formErrors'], CITY_MAX_LENGTH),
    },
  },

  computed: {
    ...mapState('enroll-to-webinar', [
      'pageDetails',
      'isPageDetailsLoading',
      'isPageDetailsLoadingError',
      'isFormProcessing',
      'isEnrolledToWebinar',
      'formErrors',
      'errorExtra',
    ]),

    nameErrors() {
      const errors = [];

      if (!this.$v.name.$dirty) return errors;
      if (!this.$v.name.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.name.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-first-name'));
      if (!this.$v.name.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.name.$params.minLength.min,
        }));
      }
      if (!this.$v.name.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.name.$params.maxLength.max,
        }));
      }
      if (!this.$v.name.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.name.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-first-name'));
      if (!this.$v.name.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.name.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.name.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.name.$params.maxLengthFromServer.max,
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
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.phone.$params.minLength.min,
        }));
      }
      if (!this.$v.phone.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.phone.$params.maxLength.max,
        }));
      }
      if (!this.$v.phone.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.phone.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-phone'));
      if (!this.$v.phone.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.phone.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.phone.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.phone.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.email.email) errors.push(this.$t('block-errors.field-must-be-email'));
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
      if (!this.$v.email.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.email.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-email'));
      if (!this.$v.email.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.email.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.email.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.email.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    cityErrors() {
      const errors = [];

      if (!this.$v.city.$dirty) return errors;
      if (!this.$v.city.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.city.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-city'));
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
      if (!this.$v.city.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.city.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-city'));
      if (!this.$v.city.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.city.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.city.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.city.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    generalErrors() {
      const errors = [];

      if (this.formErrors.includes('already-enrolled')) errors.push(this.$t('block-errors.already-enrolled'));
      if (this.formErrors.includes('unknown-error')) errors.push(this.$t('block-errors.unknown-error'));

      return errors;
    },

    isLeadAlreadyClient() {
      return this.formErrors.includes('lead-is-already-client');
    },

    isLeadNotFound() {
      return this.formErrors.includes('lead-not-found');
    },

    isTimeToShowForm() {
      return !this.isPageDetailsLoading
        && !this.isPageDetailsLoadingError
        && !this.isEnrolledToWebinar
        && !this.isLeadAlreadyClient
        && !this.isLeadNotFound;
    },

    isTimeToShowResult() {
      return !this.isPageDetailsLoading
        && !this.isPageDetailsLoadingError
        && this.isEnrolledToWebinar
        && !this.isLeadAlreadyClient
        && !this.isLeadNotFound;
    },

    isTimeToShowLoader() {
      return this.isPageDetailsLoading
        && !this.isPageDetailsLoadingError
        && !this.isEnrolledToWebinar
        && !this.isLeadAlreadyClient
        && !this.isLeadNotFound;
    },

    isTimeToShowError() {
      return !this.isPageDetailsLoading
        && this.isPageDetailsLoadingError
        && !this.isEnrolledToWebinar
        && !this.isLeadAlreadyClient
        && !this.isLeadNotFound;
    },

    isTimeToShowAlreadyClient() {
      return !this.isPageDetailsLoading
        && !this.isPageDetailsLoadingError
        && !this.isEnrolledToWebinar
        && this.isLeadAlreadyClient
        && !this.isLeadNotFound;
    },

    isTimeToShowLeadNotFound() {
      return !this.isPageDetailsLoading
        && !this.isPageDetailsLoadingError
        && !this.isEnrolledToWebinar
        && !this.isLeadAlreadyClient
        && this.isLeadNotFound;
    },

    leftSeconds() {
      return this.pageDetails.countdownSeconds || 0;
    },
  },

  methods: {
    ...mapActions('enroll-to-webinar', {
      getPageDetails: 'GET_PAGE_DETAILS',
      enrollToWebinar: 'ENROLL_TO_WEBINAR',
    }),

    ...mapMutations('enroll-to-webinar', {
      clearError: 'CLEAR_ERROR',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.enrollToWebinar({
          name: this.name,
          email: this.email,
          city: this.city,
          phone: this.phone,
        })
          .then((response) => {
            if (response) {
              this.clearFields();
            }
          });
      }
    },

    clearFields() {
      this.name = '';
      this.email = '';
      this.city = '';
      this.phone = '';
    },

    handleInput(key) {
      this.clearError(key);
      this.$v[key].$reset();
    },

    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },

    padByZero(val) {
      const valString = `${val}`;

      if (valString.length < 2) {
        return `0${valString}`;
      }

      return valString;
    },

    getCountDown(leftSeconds) {
      return {
        seconds: this.padByZero(leftSeconds % 60),
        minutes: this.padByZero(parseInt(leftSeconds / 60, 10)),
        hours: this.padByZero(parseInt(leftSeconds / 3600, 10)),
      };
    },
  },

  created() {
    this.getPageDetails()
      .then(() => {
        let { leftSeconds } = this;

        const countdown = () => {
          leftSeconds -= 1;
          this.isShowTimer = true;
          this.countdownElements = this.getCountDown(leftSeconds);

          if (leftSeconds < 1 && this.timer) {
            this.clearTimer();
          }
        };

        this.timer = setInterval(countdown, 1000);
      });
  },

  watch: {
    $_user(value) {
      if (value && value.firstName && value.email && value.phone) {
        this.name = value.firstName;
        this.email = value.email;
        this.phone = value.phone;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.enroll-to-webinar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;
  background-image: url(~@/assets/enroll-lines.png);
  background-position: center;
  min-height: 100%;
  width: 100%;

  &__inner {
    display: flex;
    align-items: center;

    @media (max-width: $desktop) {
      display: block;
    }
  }

  &__video {
    padding: 0 8%;
    flex: 1 1 60%;
    border-right: 1px solid rgba(112, 112, 112, 0.32);

    img {
      margin: 0 0 1.5rem;
    }

    &-title {
      width: 250px;
      margin: 0 auto;
      font-size: 1.1rem;
      text-align: center;
    }

    @media (max-width: $desktop) {
      padding: 0 0 2rem;
      border-right: none;
      border-bottom: 3px solid rgba(112, 112, 112, 0.32);
    }
  }

  &__form {
    flex: 1 1 40%;
    padding: 8% 8% 24%;
    max-width: 600px;

    &.is-loading,
    &.is-enrolled,
    &.is-already-client,
    &.is-lead-not-found,
    &.is-error {
      background: none;
      margin: 2rem 0;
      padding: 0;
    }

    &-title {
      font-size: 1.7rem !important;
      text-align: center;
    }

    &-subtitle {
      text-align: center;
    }

    .select {
      width: 100%;

      select {
        width: 100%;
      }
    }
  }

  &__link {
    background-color: #eee;
    padding: 1em;
    margin: 0;
    border-radius: 5px 0 0 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
  }

  &__link-button {
    padding: 1em;
    margin: 0!important;
    height: 56px;
  }

  &__button {
    background: linear-gradient(to left, #0758d9, #042dd7);
    box-shadow: 0 3px 0 #0018a8;
    width: 100%;
    margin: 1em 0;
    color: #fff;
    border: 0;

    &:focus,
    &.is-focused {
      box-shadow: none;
      color: #fff;
      border: 0;
    }
  }

  .notification .media {
    align-items: center;
  }
}
</style>
