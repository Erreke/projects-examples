<template>
  <div id="app">
    <section class="container">
      <h1 class="title">Регистрация на КУРСО-БОТ</h1>

      <div class="notification is-primary" v-if="isRegistered">
        Вы успешно зарегистрированы
      </div>

      <form @submit.prevent="handleSubmit" v-else>
        <form-field
          label="Имя:"
          placeholder="Введите свое имя"
          inputType="text"
          inputMode="search"
          inputIcon="user"
          inputName="firstName"
          v-model="$v.firstName.$model"
          :errors="firstNameErrors"
          :disabled="isLoading"
        />

        <form-field
          label="Фамилия:"
          placeholder="Введите свою фамилию"
          inputType="text"
          inputMode="search"
          inputIcon="user"
          inputName="secondName"
          v-model="$v.secondName.$model"
          :errors="secondNameErrors"
          :disabled="isLoading"
        />

        <form-field
          label="Телефон:"
          placeholder="Номер в формате +77012345678"
          inputType="tel"
          inputMode="tel"
          inputIcon="phone"
          inputName="phone"
          v-model="$v.phone.$model"
          :errors="phoneErrors"
          :disabled="isLoading"
        />

        <form-field
          label="WhatsApp:"
          placeholder="Номер в формате +77012345678"
          inputType="tel"
          inputMode="tel"
          inputIcon="phone"
          inputName="whatsapp"
          v-model="$v.whatsapp.$model"
          :errors="whatsappErrors"
          :disabled="isLoading"
        />

        <form-field
          label="E-mail:"
          placeholder="Введите свой e-mail"
          inputType="email"
          inputMode="email"
          inputIcon="envelope"
          inputName="email"
          v-model="$v.email.$model"
          :errors="emailErrors"
          :disabled="isLoading"
        />

        <form-field
          label="Город:"
          placeholder="Введите свой город"
          inputType="text"
          inputMode="search"
          inputIcon="building"
          inputName="city"
          v-model="$v.city.$model"
          :errors="cityErrors"
          :disabled="isLoading"
        />

        <form-field
          label="Комментарий:"
          inputType="textarea"
          inputName="comment"
          v-model="comment"
          :errors="[]"
          :disabled="isLoading"
        />

        <div class="field is-grouped">
          <div class="control">
            <button
              type="submit"
              :class="['button is-link', { 'is-loading': isLoading }]"
              :disabled="isLoading"
            >
              Регистрация
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators';
import FormField from './_form-field.vue';
import i18nAlpha from '@client/validators/i18n-alpha';
import phone from '@client/validators/phone';
import API from '@client/api';

export default {
  name: 'HomePage',

  components: {
    FormField,
  },

  data() {
    return {
      firstName: '',
      secondName: '',
      phone: '',
      whatsapp: '',
      email: '',
      city: '',
      comment: '',
      isLoading: false,
      isRegistered: !!JSON.parse(window.localStorage.getItem('isRegistered')),
    }
  },

  validations: {
    firstName: { required, i18nAlpha, minLength: minLength(2), maxLength: maxLength(64) },
    secondName: { required, i18nAlpha, minLength: minLength(2), maxLength: maxLength(64) },
    phone: { required, phone, maxLength: maxLength(32) },
    whatsapp: { required, phone, maxLength: maxLength(32) },
    email: { required, email, minLength: minLength(5), maxLength: maxLength(64) },
    city: { required, minLength: minLength(2), maxLength: maxLength(64) },
  },

  computed: {
    normalizedPhone() {
      const rgx = /[\u002d\u0028\u0029\u0020\u002B]*/gi;
      return this.phone.replace(rgx, '');
    },

    isButtonDisabled() {
      return false;
    },

    firstNameErrors() {
      const errors = [];

      if (!this.$v.firstName.$dirty) return errors;

      if (!this.$v.firstName.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.firstName.i18nAlpha) errors.push('Поле должно содержать правильное имя человека');
      if (!this.$v.firstName.minLength) errors.push('Поле должно содержать минимум 2 символа');
      if (!this.$v.firstName.maxLength) errors.push('Поле должно содержать максимум 64 символа');

      return errors;
    },

    secondNameErrors() {
      const errors = [];

      if (!this.$v.secondName.$dirty) return errors;

      if (!this.$v.secondName.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.secondName.i18nAlpha) errors.push('Поле должно содержать правильную фамилию человека');
      if (!this.$v.secondName.minLength) errors.push('Поле должно содержать минимум 2 символа');
      if (!this.$v.secondName.maxLength) errors.push('Поле должно содержать максимум 64 символа');

      return errors;
    },

    phoneErrors() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;

      if (!this.$v.phone.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.phone.phone) errors.push('Поле должно содержать номер в формате +77012345678');
      if (!this.$v.phone.maxLength) errors.push('Поле должно содержать максимум 32 символа');

      return errors;
    },

    whatsappErrors() {
      const errors = [];

      if (!this.$v.whatsapp.$dirty) return errors;

      if (!this.$v.whatsapp.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.whatsapp.phone) errors.push('Поле должно содержать номер в формате +77012345678');
      if (!this.$v.whatsapp.maxLength) errors.push('Поле должно содержать максимум 32 символа');

      return errors;
    },

    emailErrors() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;

      if (!this.$v.email.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.email.email) errors.push('Поле должно содержать правильный емейл');
      if (!this.$v.email.minLength) errors.push('Поле должно содержать минимум 5 символа');
      if (!this.$v.email.maxLength) errors.push('Поле должно содержать максимум 64 символа');

      return errors;
    },

    cityErrors() {
      const errors = [];

      if (!this.$v.city.$dirty) return errors;

      if (!this.$v.city.required) errors.push('Поле обязательно для заполнения');
      if (!this.$v.city.minLength) errors.push('Поле должно содержать минимум 2 символа');
      if (!this.$v.city.maxLength) errors.push('Поле должно содержать максимум 64 символа');

      return errors;
    },
  },

  methods: {
    handleSubmit() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.isLoading = true;

        API.sendToAmo({
          firstName: this.firstName,
          secondName: this.secondName,
          phone: this.phone,
          whatsapp: this.whatsapp,
          email: this.email,
          city: this.city,
          comment: this.comment,
        })
          .then(() => {
            this.$v.$touch();

            return this.$v.$invalid;
          })
          .then((isInvalid) => {
            if (!isInvalid) {
              this.isRegistered = true;
              window.localStorage.setItem('isRegistered', true);
            } 

            this.isLoading = false;
          })
          .catch((e) => {
            console.log('e:', e);
            this.isLoading = false;
          });
      }
    },
  },
}
</script>
