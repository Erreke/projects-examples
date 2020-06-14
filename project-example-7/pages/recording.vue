<template>
  <div class="webinar-recording">
    <div class="webinar-recording__inner">
      <p class="webinar-recording__logo">
        <img src="@/assets/logo.png" alt="logo">
      </p>

      <div class="webinar-recording__form content">
        <h1>{{ $t('page-webinar-recording.title') }}</h1>
        <p>{{ $t('page-webinar-recording.subtitle') }}</p>

        <div v-if="webinarRecordURL">
          <hr>
          <h3>{{ $t('page-webinar-recording.your-link') }}</h3>

          <b-field>
            <p class="webinar-recording__link">
              <a :href="webinarRecordURL">{{ webinarRecordURL }}</a>
            </p>
            <p class="control">
              <button
                class="button is-primary webinar-recording__link-button"
                @click.prevent="copyProjectReferralLinkToClipboard"
              >
                <b-icon pack="mdi" icon="content-copy"></b-icon>
              </button>
            </p>
          </b-field>
        </div>

        <form @submit.prevent="submitForm" v-else>
          <b-field
            :label="$t('page-webinar-recording.label-first-name')"
            :type="firstNameErrors.length ? 'is-danger' : null"
            :message="firstNameErrors"
          >
            <b-input
              v-model="firstName"
              size="is-large"
              :disabled="isFormProcessing"
              @input="handleInput('firstName')"
            ></b-input>
          </b-field>

          <b-field
            :label="$t('page-webinar-recording.label-phone')"
            :type="phoneErrors.length ? 'is-danger' : null"
            :message="phoneErrors"
          >
            <b-input
              v-model="phone"
              size="is-large"
              :disabled="isFormProcessing"
              @input="handleInput('phone')"
            ></b-input>
          </b-field>

          <b-field
            :label="$t('page-webinar-recording.label-email')"
            :type="emailErrors.length ? 'is-danger' : null"
            :message="emailErrors"
          >
            <b-input
              v-model="email"
              size="is-large"
              :disabled="isFormProcessing"
              @input="handleInput('email')"
            ></b-input>
          </b-field>

           <b-button
            type="is-success"
            size="is-large"
            native-type="submit"
            :rounded="true"
            :loading="isFormProcessing"
            :disabled="isFormProcessing"
          >
            {{ $t('page-webinar-recording.button-get-access') }}
          </b-button>
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
import copyToClipboard from '@/utils/copy-to-clipboard';
import i18nAlpha from '@/utils/validators/i18n-alpha';
import phone from '@/utils/validators/phone';
import alreadyInUse from '@/utils/validators/already-in-use';
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

export default {
  name: 'WebinarRecordingPage',

  head() {
    return {
      title: this.$t('page-webinar-recording.meta-title'),
    };
  },

  data() {
    return {
      firstName: '',
      email: '',
      phone: '',
      webinarRecordURL: process.browser && window.localStorage.getItem('webinarRecordURL') || '',
    };
  },

  validations: {
    firstName: {
      required,
      i18nAlpha,
      minLength: minLength(FIRST_NAME_MIN_LENGTH),
      maxLength: maxLength(FIRST_NAME_MAX_LENGTH),
      requiredFromServer: requiredFromServer('first-name', ['webinar-recording', 'errors']),
      invalidFromServer: invalidFromServer('first-name', ['webinar-recording', 'errors']),
      minLengthFromServer: minLengthFromServer('first-name', ['webinar-recording', 'errors'], FIRST_NAME_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('first-name', ['webinar-recording', 'errors'], FIRST_NAME_MAX_LENGTH),
    },
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
      emailAlreadyInUse: alreadyInUse('email', ['webinar-recording', 'errors']),
      requiredFromServer: requiredFromServer('email', ['webinar-recording', 'errors']),
      invalidFromServer: invalidFromServer('email', ['webinar-recording', 'errors']),
      minLengthFromServer: minLengthFromServer('email', ['webinar-recording', 'errors'], EMAIL_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('email', ['webinar-recording', 'errors'], EMAIL_MAX_LENGTH),
    },
    phone: {
      required,
      phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
      phoneAlreadyInUse: alreadyInUse('phone', ['webinar-recording', 'errors']),
      requiredFromServer: requiredFromServer('phone', ['webinar-recording', 'errors']),
      invalidFromServer: invalidFromServer('phone', ['webinar-recording', 'errors']),
      minLengthFromServer: minLengthFromServer('phone', ['webinar-recording', 'errors'], PHONE_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('phone', ['webinar-recording', 'errors'], PHONE_MAX_LENGTH),
    },
  },

  computed: {
    ...mapState('webinar-recording', [
      'isFormProcessing',
    ]),

    firstNameErrors() {
      const errors = [];

      if (!this.$v.firstName.$dirty) return errors;

      if (!this.$v.firstName.required) errors.push(this.$t('block-errors.first-name-is-required'));
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

      if (!this.$v.firstName.requiredFromServer) errors.push(this.$t('block-errors.first-name-is-required'));
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

    phoneErrors() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      if (!this.$v.phone.required) errors.push(this.$t('block-errors.phone-is-required'));
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
      if (!this.$v.phone.requiredFromServer) errors.push(this.$t('block-errors.phone-is-required'));
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

    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.required) errors.push(this.$t('block-errors.email-is-required'));
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
      if (!this.$v.email.requiredFromServer) errors.push(this.$t('block-errors.email-is-required'));
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
  },

  methods: {
    ...mapActions('webinar-recording', {
      getWebinarRecording: 'GET_WEBINAR_RECORDING',
    }),

    ...mapMutations('webinar-recording', {
      clearError: 'CLEAR_ERROR',
    }),

    submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.getWebinarRecording({
          firstName: this.firstName,
          email: this.email,
          phone: this.phone,
        })
          .then((response) => {
            if (response.success) {
              this.clearFields();
              this.webinarRecordURL = response.url;
              if (process.browser) {
                window.localStorage.setItem('webinarRecordURL', this.webinarRecordURL);
              }
            }
          });
      }
    },

    clearFields() {
      this.firstName = '';
      this.email = '';
      this.phone = '';
    },

    handleInput(key) {
      this.clearError(key);
      this.$v[key].$reset();
    },

    copyProjectReferralLinkToClipboard() {
      copyToClipboard(this.webinarRecordURL)
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('page-webinar-recording.copying-done-successful'),
            type: 'is-success',
          });
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('page-webinar-recording.copying-failed'),
            type: 'is-danger',
          });
        });
    },
  },
};
</script>

<style lang="scss">
.webinar-recording {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050726;
  background-image: url(~@/assets/bg.jpg);
  background-size: cover;
  width: 100%;
  min-height: 100%;

  &__inner {
    padding: 5% 3%;
  }

  &__logo {
    text-align: center;
  }

  &__form {
    background: #fff;
    padding: 10% 8%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    color: #66727c;
    max-width: 600px;
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

  .label {
    color: #66727c;
  }

  .button {
    margin: 1em 0 0;
  }
}
</style>
