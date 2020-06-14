<template>
  <div class="profile">
    <change-avatar-dialog
      :is-active="isChangeAvatarPopupOpened"
      @close="isChangeAvatarPopupOpened = false"
    />

    <change-password-dialog
      :is-active="isChangePasswordPopupOpened"
      @close="isChangePasswordPopupOpened = false"
    />

    <change-email-dialog
      :is-active="isChangeEmailPopupOpened"
      @close="isChangeEmailPopupOpened = false"
    />

    <change-phone-dialog
      :is-active="isChangePhonePopupOpened"
      @close="isChangePhonePopupOpened = false"
    />

    <div class="profile__form">
      <profile-fill-alert />

      <div  class="profile__form-pseudo-tables" v-if="!isProfileChanging">
        <pseudo-table-editable
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-first-name')"
          :placeholder="$t('block-global.profile.first-name-placeholder')"
          :value="$_user && $_user.firstName"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="firstNameErrorMessages"
          field="firstName"
          @reset-validator="resetValidator"
        />

        <pseudo-table-editable
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-second-name')"
          :placeholder="$t('block-global.profile.second-name-placeholder')"
          :value="$_user && $_user.secondName"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="secondNameErrorMessages"
          field="secondName"
          @reset-validator="resetValidator"
        />

        <pseudo-table-editable
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-nickname')"
          :placeholder="$t('block-global.profile.nickname-placeholder')"
          v-model="$v.form.nickname.$model"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="nickNameErrorMessages"
          field="nickname"
          @reset-validator="resetValidator"
        />

        <pseudo-table-editable
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-city')"
          :placeholder="$t('block-global.profile.city-placeholder')"
          v-model="$v.form.city.$model"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="cityErrorMessages"
          :autocomplete-data="fetchedCities"
          :loading="isFetchingCities"
          :is-controls-disabled="isCityNotSelected"
          field="city"
          field-type="autocomplete"
          @autocomplete-keyup="debouncedFetchCities"
          @autocomplete-select="selectCityAndCountry"
          @reset-validator="resetValidator"
        />

        <pseudo-table
          :label="$t('block-global.profile.th-region')"
          :value="form.region"
        />

        <pseudo-table
          :label="$t('block-global.profile.th-country')"
          :value="form.country"
        />

        <pseudo-table-editable
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-birthday')"
          :placeholder="$t('block-global.profile.birthday-placeholder')"
          :value="$_user && $_user.birthday"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="birthdayErrorMessages"
          field="birthday"
          field-type="date"
          :max-date="maxDate"
          :min-date="minDate"
          :focused-date="maxDate"
          @reset-validator="resetValidator"
        />

        <pseudo-table-editable
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-gender')"
          :placeholder="$t('block-global.profile.gender-placeholder')"
          :value="$_user && $_user.gender"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="genderErrorMessages"
          field="gender"
          fieldType="gender"
          @reset-validator="resetValidator"
        />

        <pseudo-table-editable
          v-if="!$_user.isAdmin"
          class="profile__form-referral-link-coursebot"
          :is-editable="$_device !== 'mobile'"
          :is-saving="isProfileSaving"
          :label="$t('block-global.profile.th-reflink')"
          :placeholder="$t('block-global.profile.referral-link-placeholder')"
          :value="$_user && $_user.courseBotReferralLink"
          :on-submit="saveUserField"
          :on-cancel="cancelFieldEditing"
          :error-messages="courseBotReferralLinkErrorMessages"
          field="courseBotReferralLink"
          @reset-validator="resetValidator"
        />
      </div>

      <form class="profile__form-fields" autocomplete="off" v-else>
        <b-field
          :type="{ 'is-danger': $v.form.firstName.$error }"
          :label="$t('block-global.profile.th-first-name')"
          :message="firstNameErrorMessages"
        >
          <b-input
            icon="account"
            type="text"
            :size="$_interfaceSize"
            :disabled="isProfileSaving"
            v-model.trim="$v.form.firstName.$model"
            :placeholder="$t('block-global.profile.first-name-placeholder')"
            @input="addFieldToChangedsList('firstName')"
          />
        </b-field>

        <b-field
          :type="{ 'is-danger': $v.form.secondName.$error }"
          :label="$t('block-global.profile.th-second-name')"
          :message="secondNameErrorMessages"
        >
          <b-input
            icon="account"
            type="text"
            :size="$_interfaceSize"
            :disabled="isProfileSaving"
            v-model.trim="$v.form.secondName.$model"
            :placeholder="$t('block-global.profile.second-name-placeholder')"
            @input="addFieldToChangedsList('secondName')"
          />
        </b-field>

        <b-field
          :type="{ 'is-danger': $v.form.nickname.$error }"
          :label="$t('block-global.profile.th-nickname')"
          :message="nickNameErrorMessages"
        >
          <b-input
            icon="account"
            type="text"
            :size="$_interfaceSize"
            :disabled="isProfileSaving"
            v-model.trim="$v.form.nickname.$model"
            :placeholder="$t('block-global.profile.nickname-placeholder')"
            @input="addFieldToChangedsList('nickname')"
          />
        </b-field>

        <b-field
          :label="$t('block-global.profile.th-city')"
          :type="{ 'is-danger': $v.form.city.$error }"
          :message="cityErrorMessages"
        >
          <b-autocomplete
            icon="earth"
            field="name"
            :size="$_interfaceSize"
            v-model.trim="$v.form.city.$model"
            :data="fetchedCities"
            :loading="isFetchingCities"
            :disabled="isProfileSaving"
            :open-on-focus="true"
            :placeholder="$t('block-global.profile.city-placeholder')"
            @keyup.native="debouncedFetchCities"
            @select="selectCityAndCountry"
            @input="addFieldToChangedsList('city')"
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
          :label="$t('block-global.profile.th-region')"
        >
          <p class="profile__field">{{ form.region }}</p>
        </b-field>

        <b-field
          :label="$t('block-global.profile.th-country')"
        >
          <p class="profile__field">{{ form.country }}</p>
        </b-field>

        <b-field
          :type="{ 'is-danger': $v.form.birthday.$error }"
          :message="birthdayErrorMessages"
        >
          <template slot="label">
            <span v-html="$t('block-global.profile.th-birthday')"></span>
          </template>
          <date-picker
            v-model="$v.form.birthday.$model"
            :years-range="[-50, 50]"
            :max-date="maxDate"
            :min-date="minDate"
            :focused-date="maxDate"
            :disabled="isProfileSaving"
            :placeholder="$t('block-global.profile.birthday-placeholder')"
            @changed="addFieldToChangedsList('birthday')"
          >
          </date-picker>
        </b-field>

        <div class="profile__gender-selector">
          <label class="label">
            {{ $t('block-global.profile.th-gender')}}
          </label>
          <b-field
            :class="{ 'is-danger': $v.form.gender.$error }"
          >
            <b-radio-button
              :class="{ 'is-danger': $v.form.gender.$error }"
              type="is-info"
              native-value="male"
              v-model.trim="$v.form.gender.$model"
              @input="addFieldToChangedsList('gender')"
              :size="$_interfaceSize"
              :disabled="isProfileSaving"
            >
              <b-icon pack="fas" icon="male"></b-icon>
              <span>{{ $t('block-auth.gender-male') }}</span>
            </b-radio-button>
            <b-radio-button
              :class="{ 'is-danger': $v.form.gender.$error }"
              type="is-danger"
              native-value="female"
              v-model.trim="$v.form.gender.$model"
              @input="addFieldToChangedsList('gender')"
              :size="$_interfaceSize"
              :disabled="isProfileSaving"
            >
              <b-icon pack="fas" icon="female"></b-icon>
              <span>{{ $t('block-auth.gender-female') }}</span>
            </b-radio-button>
          </b-field>
          <span
            v-if="genderErrorMessages.length"
            :class="['help', { 'is-danger': $v.form.gender.$error }]"
          >{{ genderErrorMessages[0] }}</span>
        </div>

        <div class="profile__referral-link" v-if="!$_user.isAdmin">
          <label
            class="label"
            v-html="$t('block-global.profile.th-reflink')"
          ></label>
          <b-field
            :type="{ 'is-danger': $v.form.courseBotReferralLink.$error }"
            :message="courseBotReferralLinkErrorMessages"
          >
            <b-input
              icon="account"
              type="text"
              :size="$_interfaceSize"
              :disabled="isProfileSaving"
              v-model.trim="$v.form.courseBotReferralLink.$model"
              :placeholder="$t('block-global.profile.referral-link-placeholder')"
              @input="addFieldToChangedsList('courseBotReferralLink')"
            />
          </b-field>
        </div>
      </form>
    </div>

    <div class="profile__toolbar">
      <div class="buttons">
        <b-button
          v-if="isProfileChanging && $_device === 'mobile'"
          type="is-success"
          icon-left="check"
          :rounded="true"
          :expanded="isWideScreen"
          :disabled="isProfileSaving"
          :loading="isProfileSaving"
          @click.prevent="submitProfileChangingForm"
        >
          {{ $t("block-global.save") }}
        </b-button>

        <b-button
          v-if="isProfileChanging && $_device === 'mobile'"
          icon-left="cancel"
          :rounded="true"
          :expanded="isWideScreen"
          :disabled="isProfileSaving"
          @click.prevent="cancelProfileChanging"
        >
          {{ $t("block-global.cancel") }}
        </b-button>

        <b-button
          v-if="!isProfileChanging && $_device === 'mobile'"
          icon-left="account-edit"
          :rounded="true"
          :expanded="isWideScreen"
          :disabled="isProfileSaving"
          @click.prevent="toggleProfileChanging"
        >
          {{ $t('block-global.change-profile') }}
        </b-button>
      </div>

      <b-button
        icon-left="account-box-multiple"
        type="is-danger"
        :rounded="true"
        :expanded="isWideScreen"
        :disabled="isProfileSaving"
        @click.prevent="isChangeAvatarPopupOpened = true"
      >
        {{ $t('block-global.change-avatar') }}
      </b-button>

      <b-button
        icon-left="textbox-password"
        type="is-danger"
        :rounded="true"
        :expanded="isWideScreen"
        :disabled="isProfileSaving"
        @click.prevent="isChangePasswordPopupOpened = true"
      >
        {{ $t('block-global.change-password') }}
      </b-button>

      <b-button
        icon-left="email-edit"
        type="is-danger"
        :rounded="true"
        :expanded="isWideScreen"
        :disabled="isProfileSaving"
        @click.prevent="isChangeEmailPopupOpened = true"
      >
        {{ $t('block-global.change-email') }}
      </b-button>

      <b-button
        icon-left="cellphone-settings"
        type="is-danger"
        :rounded="true"
        :expanded="isWideScreen"
        :disabled="isProfileSaving"
        @click.prevent="isChangePhonePopupOpened = true"
      >
        {{ $t('block-global.change-phone') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import 'croppie/croppie.css';
import debounce from 'lodash/debounce';
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, url, minLength, maxLength,
} from 'vuelidate/lib/validators';
import i18nAlpha from '@/utils/validators/i18n-alpha';
import nickname from '@/utils/validators/nickname';
import uniqueNickname from '@/utils/validators/unique-nickname';
// import profileAPI from '@/api/profile';

export default {
  name: 'CommonProfilePage',

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
    PseudoTableEditable: () => import('@/views/blocks/pseudo-table-editable.vue'),
    ChangeAvatarDialog: () => import('./_change-avatar-dialog.vue'),
    ChangePasswordDialog: () => import('./_change-password-dialog.vue'),
    ChangeEmailDialog: () => import('./_change-email-dialog.vue'),
    ChangePhoneDialog: () => import('./_change-phone-dialog.vue'),
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
    ProfileFillAlert: () => import('@/views/blocks/profile-fill-alert.vue'),
  },

  data() {
    return {
      isChangeAvatarPopupOpened: false,
      isChangePasswordPopupOpened: false,
      isChangeEmailPopupOpened: false,
      isChangePhonePopupOpened: false,
      changedFields: [],
      form: {
        firstName: null,
        secondName: null,
        nickname: null,
        gender: null,
        country: null,
        city: null,
        birthday: null,
        courseBotReferralLink: null,
      },
      isCityNotSelected: true,
    };
  },

  validations: {
    form: {
      firstName: {
        required,
        i18nAlpha,
        minLength: minLength(1),
        maxLength: maxLength(32),
      },
      secondName: {
        required,
        i18nAlpha,
        minLength: minLength(1),
        maxLength: maxLength(32),
      },
      nickname: {
        required,
        nickname,
        uniqueNickname,
        minLength: minLength(1),
        maxLength: maxLength(32),
      },
      ownNickname: {
        nickname,
      },
      city: {
        required,
      },
      gender: {
        required,
      },
      birthday: {
        required,
      },
      courseBotReferralLink: {
        url,
        minLength: minLength(12),
        maxLength: maxLength(128),
      },
    },
  },

  computed: {
    ...mapState('user', [
      'fetchedCities',
      'cityFetchingError',
      'isFetchingCities',
      'isProfileSaving',
      'isProfileChanging',
    ]),

    birthday() {
      return this.$_user
        && this.$_user.birthday
        && this.$_user.birthday.seconds
        ? this.$options.filters.date_format(this.$_user.birthday.seconds)
        : '-';
    },

    firstNameErrorMessages() {
      const errors = [];

      if (!this.$v.form.firstName.$dirty) return errors;
      if (!this.$v.form.firstName.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.form.firstName.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-alpha'));
      if (!this.$v.form.firstName.minLength) errors.push(this.$t('block-errors.field-must-be-min-length', { length: this.$v.form.firstName.$params.minLength.min }));
      if (!this.$v.form.firstName.maxLength) errors.push(this.$t('block-errors.field-must-be-max-length', { length: this.$v.form.firstName.$params.maxLength.max }));

      return errors;
    },

    secondNameErrorMessages() {
      const errors = [];

      if (!this.$v.form.secondName.$dirty) return errors;
      if (!this.$v.form.secondName.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.form.secondName.i18nAlpha) errors.push(this.$t('block-errors.field-must-be-alpha'));
      if (!this.$v.form.secondName.minLength) errors.push(this.$t('block-errors.field-must-be-min-length', { length: this.$v.form.secondName.$params.minLength.min }));
      if (!this.$v.form.secondName.maxLength) errors.push(this.$t('block-errors.field-must-be-max-length', { length: this.$v.form.secondName.$params.maxLength.max }));

      return errors;
    },

    nickNameErrorMessages() {
      const errors = [];

      if (!this.$v.form.nickname.$dirty) return errors;
      if (!this.$v.form.nickname.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.form.nickname.nickname) errors.push(this.$t('block-errors.field-must-be-latin-alpha-num'));
      if (!this.$v.form.nickname.uniqueNickname) errors.push(this.$t('block-errors.field-must-be-unique-nickname'));
      if (!this.$v.form.nickname.minLength) errors.push(this.$t('block-errors.field-must-be-min-length', { length: this.$v.form.nickname.$params.minLength.min }));
      if (!this.$v.form.nickname.maxLength) errors.push(this.$t('block-errors.field-must-be-max-length', { length: this.$v.form.nickname.$params.maxLength.max }));

      return errors;
    },

    cityErrorMessages() {
      const errors = [];

      if (!this.$v.form.city.$dirty) return errors;
      if (!this.$v.form.city.required) errors.push(this.$t('block-errors.field-is-required'));

      if (this.cityFetchingError === 'ARGUMENTS_NOT_VALID') {
        errors.push(this.$t('block-errors.arguments-not-valid'));
      }

      if (this.cityFetchingError === 'CITY_NOT_FOUND') {
        errors.push(this.$t('block-errors.city-not-found'));
      }

      return errors;
    },

    genderErrorMessages() {
      const errors = [];

      if (!this.$v.form.gender.$dirty) return errors;
      if (!this.$v.form.gender.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    birthdayErrorMessages() {
      const errors = [];

      if (!this.$v.form.birthday.$dirty) return errors;
      if (!this.$v.form.birthday.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    courseBotReferralLinkErrorMessages() {
      const errors = [];

      if (!this.$v.form.courseBotReferralLink.$dirty) return errors;
      if (!this.$v.form.courseBotReferralLink.url) errors.push(this.$t('block-errors.field-must-be-referral-link'));
      if (!this.$v.form.courseBotReferralLink.minLength) errors.push(this.$t('block-errors.field-must-be-min-length', { length: this.$v.form.courseBotReferralLink.$params.minLength.min }));
      if (!this.$v.form.courseBotReferralLink.maxLength) errors.push(this.$t('block-errors.field-must-be-max-length', { length: this.$v.form.courseBotReferralLink.$params.maxLength.max }));

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

    isWideScreen() {
      return this.$_device === 'widescreen' || this.$_device === 'fullhd';
    },
  },

  methods: {
    ...mapActions('user', {
      saveUserInfo: 'SAVE_USER_INFO',
      fetchCities: 'FETCH_CITIES',
    }),

    ...mapMutations('user', {
      setProfileChangingProcess: 'SET_PROFILE_CHANGING_PROCESS',
    }),

    saveUserField(field, value) {
      this.form[field] = value;
      this.$v.form[field].$touch();

      if (this.$v.form[field].$invalid) return Promise.reject();

      const fields = field === 'city' ? ['country', 'region', 'city'] : [field];
      const values = field === 'city' ? [this.form.country, this.form.region, this.form.city] : [value];

      return this.saveUserInfo({
        uid: this.$_user && this.$_user.uid,
        fields,
        values,
        loader: 'user/SET_PROFILE_SAVING_PROCESS',
      });
    },

    cancelFieldEditing(field) {
      this.fillFormFields();
      this.$v.form[field].$reset();
    },

    submitProfileChangingForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const changedValues = this.changedFields.map(field => this.form[field]);

        if (this.changedFields.length) {
          this.saveUserInfo({
            uid: this.$_user && this.$_user.uid,
            fields: this.changedFields,
            values: changedValues,
            loader: 'user/SET_PROFILE_SAVING_PROCESS',
          })
            .then(() => {
              this.clearChangedFields();
              this.setProfileChangingProcess(false);
            });
        } else {
          this.setProfileChangingProcess(false);
        }
      }
    },

    toggleProfileChanging() {
      this.fillFormFields();
      this.setProfileChangingProcess(true);
    },

    cancelProfileChanging() {
      this.clearChangedFields();
      this.setProfileChangingProcess(false);
      this.$v.$reset();
    },

    fillFormFields() {
      this.form = {
        firstName: this.$_user && this.$_user.firstName,
        secondName: this.$_user && this.$_user.secondName,
        nickname: this.$_user && this.$_user.nickname,
        ownNickname: this.$_user && this.$_user.nickname,
        gender: this.$_user && this.$_user.gender,
        country: this.$_user && this.$_user.country,
        region: this.$_user && this.$_user.region,
        city: this.$_user && this.$_user.city,
        birthday: this.$_user
          && this.$_user.birthday
          && this.$_user.birthday.seconds
          ? new Date(this.$_user.birthday.seconds * 1000)
          : null,
        courseBotReferralLink: this.$_user && this.$_user.courseBotReferralLink,
      };
    },

    addToChangedsList(value) {
      if (this.changedFields.indexOf(value) === -1) {
        this.changedFields.push(value);
      }
    },

    selectCityAndCountry(option) {
      this.form.country = option.countryName || '';
      this.form.region = option.regionName || '';
      this.form.city = option.name;
      this.isCityNotSelected = false;
    },

    addFieldToChangedsList(value) {
      if (value === 'city') {
        this.addToChangedsList('country');
        this.addToChangedsList('region');
        this.addToChangedsList('city');
        this.$v.form.city.$reset();
      } else {
        this.addToChangedsList(value);
        this.$v.form[value].$reset();
      }
    },

    clearChangedFields() {
      this.changedFields = [];
    },

    resetValidator() {
      this.fillFormFields();
      this.$v.$reset();
    },

    handleFetchCities(event) {
      this.isCityNotSelected = true;
      this.fetchCities(event.target.value);
    },
  },

  created() {
    this.debouncedFetchCities = debounce(this.handleFetchCities, 350);
  },

  mounted() {
    this.fillFormFields();
  },

  watch: {
    $_user() {
      this.fillFormFields();
    },
  },
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.profile {
  display: flex;
  min-height: calc(100% - 3.8rem);

  @include until($tablet) {
    flex-flow: column;
  }

  &__field {
    line-height: 36px;
  }

  &__gender-selector {
    margin-bottom: 1rem;

    .field {
      margin: 0;
    }

    & .is-danger label {
      color: #ff3860;
      border-color: #ff3860;
    }
  }

  &__form-referral-link-coursebot {
    .pseudo-table-editable {
      & > span {
        &:last-child {
          @include until($tablet) {
            flex: 0 1 auto;
          }
        }
      }
    }
  }

  &__referral-link {
    margin-bottom: 1rem;
  }

  &__passwords-block {
    margin-bottom: 0.75rem;
  }

  &__resign-in-btn {
    margin-bottom: 20px;
  }

  &__form {
    display: flex;
    flex-flow: column;
    width: 65%;
    max-width: 800px;
    padding: 0 2rem 2rem 0;

    @include from($tablet) {
      flex: 0 0 65%;
    }

    @include until($tablet) {
      padding: 2rem;
      width: auto;
    }

    @include until(426px) {
      padding: 0 1rem 0 0;
    }

    &-pseudo-tables {
      background-color: #fff;
    }
  }

  &__toolbar {
    @include until($tablet) {
      padding: 2rem;
    }

    @include until(426px) {
      padding: 1rem 0;
    }

    @include from($tablet) {
      flex: 0 0 35%;
      background: #fafafa;
      padding: 7rem 3rem 0 3rem;
      margin: -7rem 0 -5rem 0;
    }

    .button {
      margin-bottom: 1.5rem;

      @include until($tablet) {
        display: block;
      }
    }
  }
}


// flex: 0 1 auto;
// .pseudo-table-editable > span:last-child {
</style>
