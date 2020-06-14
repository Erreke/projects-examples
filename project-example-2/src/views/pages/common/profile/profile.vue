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
      <form
        class="profile__fields-block"
        @submit.prevent="submitProfileChangingForm"
      >
        <b-field
          :type="{ 'is-danger': $v.form.firstName.$error }"
          :label="$t('block-global.profile.th-first-name')"
          :message="firstNameErrorMessages"
        >
          <b-input
            icon="account"
            type="text"
            v-if="isProfileChanging"
            v-model.trim="$v.form.firstName.$model"
            :placeholder="$t('block-global.profile.first-name-placeholder')"
            @input="addFieldToChangedsList('firstName')"
            required
          />
          <p v-else class="profile__field">{{ firstName ? firstName : "-" }}</p>
        </b-field>

        <b-field
          :type="{ 'is-danger': $v.form.secondName.$error }"
          :label="$t('block-global.profile.th-second-name')"
          :message="secondNameErrorMessages"
        >
          <b-input
            icon="account"
            type="text"
            v-if="isProfileChanging"
            v-model.trim="$v.form.secondName.$model"
            :placeholder="$t('block-global.profile.second-name-placeholder')"
            @input="addFieldToChangedsList('secondName')"
            required
          />
          <p v-else class="profile__field">
            {{ secondName ? secondName : "-" }}
          </p>
        </b-field>

        <b-field
          :type="{ 'is-danger': $v.form.nickname.$error }"
          :label="$t('block-global.profile.th-nickname')"
          :message="nickNameErrorMessages"
        >
          <b-input
            icon="account"
            type="text"
            v-if="isProfileChanging"
            v-model.trim="$v.form.nickname.$model"
            :placeholder="$t('block-global.profile.nickname-placeholder')"
            @input="addFieldToChangedsList('nickname')"
            required
          />
          <p v-else class="profile__field">{{ nickname ? nickname : "-" }}</p>
        </b-field>

        <b-field
          :label="$t('block-global.profile.th-city')"
          :type="{ 'is-danger': $v.form.city.$error || $v.form.country.$error }"
          :message="cityErrorMessages"
        >
          <b-autocomplete
            icon="earth"
            field="name"
            v-if="isProfileChanging"
            v-model.trim="$v.form.city.$model"
            :data="fetchedCities"
            :loading="isFetchingCities"
            :placeholder="$t('block-global.profile.city-placeholder')"
            @keyup.native="debouncedFetchCities"
            @select="selectCityAndCountry"
            @input="addFieldToChangedsList(['city', 'country'])"
            required
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-content auth__autocomplete-option">
                  <span>{{ props.option.name }}</span>
                  <br />
                  <small
                    >{{ props.option.countryName }},
                    {{ props.option.regionName }}</small
                  >
                </div>
              </div>
            </template>
          </b-autocomplete>
          <p v-else class="profile__field">{{ city ? city : "-" }}</p>
        </b-field>

        <b-field :label="$t('block-global.profile.th-region')">
          <p class="profile__field">{{ region ? region : "-" }}</p>
        </b-field>

        <b-field :label="$t('block-global.profile.th-country')">
          <p class="profile__field">{{ country ? country : "-" }}</p>
        </b-field>

        <b-field
          :label="$t('block-global.profile.th-birthday')"
          :type="{ 'is-danger': $v.form.birthday.$error }"
          :message="birthdayErrorMessages"
        >
          <date-picker
            v-if="isProfileChanging"
            v-model="$v.form.birthday.$model"
            :years-range="[-50, 50]"
            :max-date="maxDate"
            :min-date="minDate"
            :focused-date="maxDate"
            :placeholder="$t('block-global.profile.birthday-placeholder')"
            @changed="addFieldToChangedsList('birthday')"
          >
          </date-picker>
          <p v-else class="profile__field">
            {{ birthday }}
          </p>
        </b-field>

        <div class="profile__gender-selector">
          <label class="label" v-if="isProfileChanging">
            {{ $t("block-global.profile.th-gender") }}
          </label>
          <b-field :class="{ 'is-danger': $v.form.gender.$error }">
            <b-radio-button
              :class="{ 'is-danger': $v.form.gender.$error }"
              v-if="isProfileChanging"
              type="is-info"
              native-value="male"
              v-model.trim="$v.form.gender.$model"
              @input="addFieldToChangedsList('gender')"
            >
              <b-icon pack="fas" icon="male"></b-icon>
              <span>{{ $t("block-auth.gender-male") }}</span>
            </b-radio-button>
            <b-radio-button
              :class="{ 'is-danger': $v.form.gender.$error }"
              v-if="isProfileChanging"
              type="is-danger"
              native-value="female"
              v-model.trim="$v.form.gender.$model"
              @input="addFieldToChangedsList('gender')"
            >
              <b-icon pack="fas" icon="female"></b-icon>
              <span>{{ $t("block-auth.gender-female") }}</span>
            </b-radio-button>

            <div v-else>
              <label class="label">{{
                $t("block-global.profile.th-gender")
              }}</label>
              <p class="profile__field">
                {{ gender ? $t(`block-auth.gender-${gender}`) : "-" }}
              </p>
            </div>
          </b-field>
          <span
            v-if="genderErrorMessages"
            :class="['help', { 'is-danger': $v.form.gender.$error }]"
            >{{ genderErrorMessages }}</span
          >
        </div>

        <b-field grouped v-if="isProfileChanging">
          <button
            type="submit"
            :class="[
              'button control is-rounded is-success',
              { 'is-loading': isProfileSaving }
            ]"
          >
            <span class="icon">
              <i class="mdi mdi-check"></i>
            </span>
            <span>{{ $t("block-global.save") }}</span>
          </button>

          <button
            type="button"
            class="button is-rounded"
            @click.prevent="cancelProfileChanging"
          >
            <span class="icon">
              <i class="mdi mdi-cancel"></i>
            </span>
            <span>{{ $t("block-global.cancel") }}</span>
          </button>
        </b-field>
      </form>

      <button
        type="button"
        v-if="!isProfileChanging"
        class="button control is-rounded is-danger"
        @click.prevent="toggleProfileChanging"
      >
        <span class="icon">
          <i class="mdi mdi-account-edit"></i>
        </span>
        <span>{{ $t("block-global.change-profile") }}</span>
      </button>
    </div>

    <div class="profile__toolbar">
      <button
        type="button"
        :class="[
          'button control is-rounded is-danger',
          { 'is-fullwidth': isWideScreen }
        ]"
        @click.prevent="isChangeAvatarPopupOpened = true"
      >
        <span class="icon">
          <i class="mdi mdi-account-box-multiple"></i>
        </span>
        <span>{{ $t("block-global.change-avatar") }}</span>
      </button>

      <button
        type="button"
        :class="[
          'button control is-rounded is-danger',
          { 'is-fullwidth': isWideScreen }
        ]"
        @click.prevent="isChangePasswordPopupOpened = true"
      >
        <span class="icon">
          <i class="mdi mdi-textbox-password"></i>
        </span>
        <span>{{ $t("block-global.change-password") }}</span>
      </button>

      <button
        type="button"
        :class="[
          'button control is-rounded is-danger',
          { 'is-fullwidth': isWideScreen }
        ]"
        @click.prevent="isChangeEmailPopupOpened = true"
      >
        <span class="icon">
          <i class="mdi mdi-email-edit"></i>
        </span>
        <span>{{ $t("block-global.change-email") }}</span>
      </button>

      <button
        type="button"
        :class="[
          'button control is-rounded is-danger',
          { 'is-fullwidth': isWideScreen }
        ]"
        @click.prevent="isChangePhonePopupOpened = true"
      >
        <span class="icon">
          <i class="mdi mdi-cellphone-settings"></i>
        </span>
        <span>{{ $t("block-global.change-phone") }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import "croppie/croppie.css";
import debounce from "lodash/debounce";
import { mapState, mapActions, mapMutations } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import i18nAlpha from "@/utils/validators/i18n-alpha";
import nickname from "@/utils/validators/nickname";
import uniqueNickname from "@/utils/validators/unique-nickname";

export default {
  name: "CommonProfilePage",

  components: {
    DatePicker: () => import("@/views/blocks/date-picker.vue"),
    ChangeAvatarDialog: () => import("./_change-avatar-dialog.vue"),
    ChangePasswordDialog: () => import("./_change-password-dialog.vue"),
    ChangeEmailDialog: () => import("./_change-email-dialog.vue"),
    ChangePhoneDialog: () => import("./_change-phone-dialog.vue")
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
        birthday: null
      }
    };
  },

  validations: {
    form: {
      firstName: {
        required,
        i18nAlpha,
        minLength: minLength(1),
        maxLength: maxLength(32)
      },
      secondName: {
        required,
        i18nAlpha,
        minLength: minLength(1),
        maxLength: maxLength(32)
      },
      nickname: {
        required,
        nickname,
        uniqueNickname,
        minLength: minLength(1),
        maxLength: maxLength(32)
      },
      ownNickname: {
        nickname
      },
      city: {
        required
      },
      country: {
        required
      },
      gender: {
        required
      },
      birthday: {
        required
      }
    }
  },

  computed: {
    ...mapState("user", [
      "fetchedCities",
      "cityFetchingError",
      "isFetchingCities",
      "isProfileSaving",
      "isProfileChanging"
    ]),

    firstName() {
      return this.$_user && this.$_user.firstName;
    },

    secondName() {
      return this.$_user && this.$_user.secondName;
    },

    nickname() {
      return this.$_user && this.$_user.nickname;
    },

    gender() {
      return this.$_user && this.$_user.gender;
    },

    country() {
      return this.$_user && this.$_user.country;
    },

    region() {
      return this.$_user && this.$_user.region;
    },

    city() {
      return this.$_user && this.$_user.city;
    },

    birthday() {
      return this.$_user && this.$_user.birthday && this.$_user.birthday.seconds
        ? this.$options.filters.date_format(this.$_user.birthday.seconds)
        : "-";
    },

    birthdayForDatePicker() {
      return this.$_user && this.$_user.birthday && this.$_user.birthday.seconds
        ? new Date(this.$_user.birthday.seconds * 1000)
        : null;
    },

    firstNameErrorMessages() {
      let result = null;

      if (this.$v.form.firstName.$error) {
        if (!this.$v.form.firstName.required) {
          result = this.$t("block-errors.field-is-required");
        }

        if (!this.$v.form.firstName.i18nAlpha) {
          result = this.$t("block-errors.field-must-be-alpha");
        }

        if (!this.$v.form.firstName.minLength) {
          result = this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.form.firstName.$params.minLength.min
          });
        }

        if (!this.$v.form.firstName.maxLength) {
          result = this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.form.firstName.$params.maxLength.max
          });
        }
      }

      return result;
    },

    secondNameErrorMessages() {
      let result = null;

      if (this.$v.form.secondName.$error) {
        if (!this.$v.form.secondName.required) {
          result = this.$t("block-errors.field-is-required");
        }

        if (!this.$v.form.secondName.i18nAlpha) {
          result = this.$t("block-errors.field-must-be-alpha");
        }

        if (!this.$v.form.secondName.minLength) {
          result = this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.form.secondName.$params.minLength.min
          });
        }

        if (!this.$v.form.secondName.maxLength) {
          result = this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.form.secondName.$params.maxLength.max
          });
        }
      }

      return result;
    },

    nickNameErrorMessages() {
      let result = null;

      if (this.$v.form.nickname.$error) {
        if (!this.$v.form.nickname.required) {
          result = this.$t("block-errors.field-is-required");
        }

        if (!this.$v.form.nickname.nickname) {
          result = this.$t("block-errors.field-must-be-latin-alpha-num");
        }

        if (!this.$v.form.nickname.uniqueNickname) {
          result = this.$t("block-errors.field-must-be-unique-nickname");
        }

        if (!this.$v.form.nickname.minLength) {
          result = this.$t("block-errors.field-must-be-min-length", {
            length: this.$v.form.nickname.$params.minLength.min
          });
        }

        if (!this.$v.form.nickname.maxLength) {
          result = this.$t("block-errors.field-must-be-max-length", {
            length: this.$v.form.nickname.$params.maxLength.max
          });
        }
      }

      return result;
    },

    cityErrorMessages() {
      let result = null;

      if (this.$v.form.city.$error) {
        if (!this.$v.form.city.required) {
          result = this.$t("block-errors.field-is-required");
        }

        if (this.cityFetchingError === "ARGUMENTS_NOT_VALID") {
          result = this.$t("block-errors.arguments-not-valid");
        }

        if (this.cityFetchingError === "CITY_NOT_FOUND") {
          result = this.$t("block-errors.city-not-found");
        }
      }

      if (this.$v.form.country.$error) {
        if (!this.$v.form.country.required) {
          result = this.$t("block-errors.city-not-found");
        }
      }

      return result;
    },

    genderErrorMessages() {
      let result = null;

      if (this.$v.form.gender.$error) {
        if (!this.$v.form.gender.required) {
          result = this.$t("block-errors.field-is-required");
        }
      }

      return result;
    },

    birthdayErrorMessages() {
      let result = null;

      if (this.$v.form.gender.$error) {
        if (!this.$v.form.gender.required) {
          result = this.$t("block-errors.field-is-required");
        }
      }

      return result;
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
      return this.$_device === "widescreen" || this.$_device === "fullhd";
    }
  },

  methods: {
    ...mapActions("user", {
      saveUserInfo: "SAVE_USER_INFO",
      fetchCities: "FETCH_CITIES"
    }),

    ...mapMutations("user", {
      setProfileChangingProcess: "SET_PROFILE_CHANGING_PROCESS"
    }),

    submitProfileChangingForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const changedValues = this.changedFields.map(field => this.form[field]);

        if (this.changedFields.length) {
          this.saveUserInfo({
            uid: this.$_user && this.$_user.uid,
            fields: this.changedFields,
            values: changedValues,
            loader: "user/SET_PROFILE_SAVING_PROCESS"
          }).then(() => {
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
        firstName: this.firstName,
        secondName: this.secondName,
        nickname: this.nickname,
        ownNickname: this.nickname,
        gender: this.gender,
        country: this.country,
        city: this.city,
        birthday: this.birthdayForDatePicker
      };
    },

    addToChangedsList(value) {
      if (this.changedFields.indexOf(value) === -1) {
        this.changedFields.push(value);
      }
    },

    selectCityAndCountry(option) {
      this.form.country = option.countryName;
      this.form.city = option.name;
    },

    addFieldToChangedsList(value) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          this.addToChangedsList(item);
          this.$v.form[item].$reset();
          this.$v.form[item].$touch();
        });
      } else {
        this.addToChangedsList(value);
        this.$v.form[value].$reset();
      }
    },

    clearChangedFields() {
      this.changedFields = [];
    }
  },

  created() {
    this.debouncedFetchCities = debounce(this.fetchCities, 500);
  },

  mounted() {
    this.fillFormFields();
  },

  watch: {
    $_user() {
      this.fillFormFields();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.profile {
  display: flex;

  @include until($tablet) {
    flex-flow: column;
  }

  &__field {
    line-height: 36px;
  }

  &__gender-selector {
    margin-bottom: 1.75rem;

    .field {
      margin: 0;
    }

    & .is-danger label {
      color: #ff3860;
      border-color: #ff3860;
    }
  }

  &__fields-block,
  &__passwords-block {
    margin-bottom: 0.75rem;
  }

  &__resign-in-btn {
    margin-bottom: 20px;
  }

  &__form {
    width: 100%;
    padding: 2rem;
  }

  &__toolbar {
    padding: 1rem 0 0;

    @include until($tablet) {
      padding: 2rem;
    }

    @include from($tablet) {
      flex: 0 0 30%;
      background: #fafafa;
      padding: 3rem 3rem 0 3rem;
    }

    .button {
      margin-bottom: 1.5rem;

      @include until($tablet) {
        display: block;
      }
    }
  }
}
</style>
