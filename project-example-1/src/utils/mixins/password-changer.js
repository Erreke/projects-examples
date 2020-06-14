import { mapState, mapActions } from 'vuex';
import {
  required, minLength, maxLength, sameAs,
} from 'vuelidate/lib/validators';
import weakPassword from '@/utils/validators/weak-password';

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 32;

export default {
  data() {
    return {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    };
  },

  validations: {
    currentPassword: {
      required,
    },
    password: {
      required,
      weakPassword,
      minLength: minLength(PASSWORD_MIN_LENGTH),
      maxLength: maxLength(PASSWORD_MAX_LENGTH),
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },

  computed: {
    ...mapState('auth/change-password', {
      formErrors: state => state.errors,
      isFormProcessing: state => state.isProcessing,
    }),

    currentPasswordErrorMessages() {
      const errors = [];

      if (!this.$v.currentPassword.$dirty) return errors;
      if (!this.$v.currentPassword.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    passwordErrorMessages() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.password.weakPassword) errors.push(this.$t('block-errors.weak-password'));
      if (!this.$v.password.minLength) {
        errors.push(this.$t('block-errors.password-must-be-min-length', {
          length: this.$v.password.$params.minLength.min,
        }));
      }
      if (!this.$v.password.maxLength) {
        errors.push(this.$t('block-errors.password-must-be-max-length', {
          length: this.$v.password.$params.maxLength.max,
        }));
      }

      return errors;
    },

    passwordConfirmErrorMessages() {
      const errors = [];

      if (!this.$v.confirmPassword.$dirty) return errors;
      if (!this.$v.confirmPassword.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.confirmPassword.sameAsPassword) errors.push(this.$t('block-errors.passwords-not-equal'));

      return errors;
    },

    formErrorsMessages() {
      return this.formErrors.map(item => this.$t(`block-errors.change-password.${item}`));
    },
  },

  methods: {
    ...mapActions('auth/change-password', {
      changePassword: 'CHANGE_USER_PASSWORD',
    }),

    ...mapActions('user', {
      saveUserInfo: 'SAVE_USER_INFO',
    }),
  },
};
