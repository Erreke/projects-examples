import Vue from 'vue';
import vuelidate from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import 'bulma';
import '../../common.scss';

Vue.use(vuelidate);

function phone(value) {
  if (value === '') return true;

  if (value.length < 12) return false;

  const rx = /^[+]*[0-9]{1,4}[-\s]*[(]{0,1}[0-9]{1,5}[)]{0,1}[-\s/0-9]*$/g;

  return rx.test(value);
}

const app = new Vue({
  data() {
    return {
      phone: '',
      text: '',
      link: '',
      localStoragePhone: localStorage.getItem('phone'),
      localStorageText: localStorage.getItem('text'),
      linkCreated: false,
      isShowSuccessNotification: false,
      isShowFailNotification: false,
    };
  },

  validations: {
    phone: {
      required,
      phone,
    },
    text: {
      required,
    },
  },

  computed: {
    normalizedPhone() {
      const rgx = /[\u002d\u0028\u0029\u0020\u002B]*/gi;
      return this.phone.replace(rgx, '');
    },

    isButtonDisabled() {
      return !(this.phone && this.text) || this.linkCreated;
    },

    buttonText() {
      return this.localStoragePhone && this.localStorageText ? 'Пересоздать' : 'Создать';
    },
  },

  methods: {
    handleSubmit() {
      this.link = '';
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.link = this.createLink();

        localStorage.setItem('phone', this.phone);
        localStorage.setItem('text', this.text);
      }
    },

    handleInput() {
      this.linkCreated = false;
    },

    handleChange(key) {
      this.$v[key].$touch();
    },

    handleCopy() {
      navigator
        .clipboard
        .writeText(this.link)
        .then(() => {
          this.isShowSuccessNotification = true;
        }, () => {
          this.isShowFailNotification = true;
        });
    },

    closeNotifications() {
      this.isShowSuccessNotification = false;
      this.isShowFailNotification = false;
    },

    createLink() {
      this.linkCreated = true;

      if (this.phone && this.text) {
        return encodeURI(`https://wa.me/${this.normalizedPhone}?text=${this.text}`);
      }

      return '';
    },
  },

  created() {
    this.phone = this.localStoragePhone || '';
    this.text = this.localStorageText || '';
    this.link = this.createLink();
  },

  watch: {
    isShowSuccessNotification(value) {
      if (value) {
        setTimeout(() => {
          this.isShowSuccessNotification = false;
        }, 2000);
      }
    },

    isShowFailNotification(value) {
      if (value) {
        setTimeout(() => {
          this.isShowFailNotification = false;
        }, 2000);
      }
    },
  },
});

app.$mount('#app');
