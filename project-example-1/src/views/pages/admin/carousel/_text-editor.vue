<template>
  <div>
    <b-button
      v-if="!isEdit"
      type="is-warning"
      native-type="button"
      icon-left="cog-outline"
      @click="openEditor"
    >
      Редактировать текстовки
    </b-button>

    <hr>

    <form @submit.prevent="submitForm" v-if="isEdit">
      <b-field
        label="Телефонный номер бота:"
        message="В формате 77071234567"
      >
        <b-input v-model="phone" :disabled="isMetaSaving"></b-input>
      </b-field>
      <hr>

      <b-field
        label="Текст для отправки в бот:"
        message='Переменную "номер заявки" надо писать как {number}'
      >
        <b-input v-model="textToBot" :disabled="isMetaSaving"></b-input>
      </b-field>
      <hr>

      <b-field
        label="Текст ответного сообщения бота:"
        message='Переменную "ссылка в Telegram" надо писать как {link}'
      >
        <b-input type="textarea" v-model="textFromBot" :disabled="isMetaSaving"></b-input>
      </b-field>

      <div class="buttons">
        <b-button
          type="is-warning"
          native-type="button"
          icon-left="cancel"
          :disabled="isMetaSaving"
          @click="closeEditor"
        >
          Отмена
        </b-button>
        <b-button
          type="is-success"
          native-type="submit"
          icon-left="check"
          :disabled="isMetaSaving"
          :loading="isMetaSaving"
        >
          Сохранить
        </b-button>
      </div>

      <hr>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      isEdit: false,
      tempTextToBot: '',
      tempTextFromBot: '',
      tempPhone: '',
    };
  },

  computed: {
    ...mapState('admin/carousel', [
      'meta',
      'isMetaSaving',
    ]),

    textToBot: {
      get() { return this.meta.textToBot; },

      set(value) { this.setMetaInfo({ key: 'textToBot', value }); },
    },

    textFromBot: {
      get() { return this.meta.textFromBot; },

      set(value) { this.setMetaInfo({ key: 'textFromBot', value }); },
    },

    phone: {
      get() { return this.meta.phone; },

      set(value) { this.setMetaInfo({ key: 'phone', value }); },
    },
  },

  methods: {
    ...mapActions('admin/carousel', {
      saveCarouselMeta: 'SAVE_CAROUSEL_META',
    }),

    ...mapMutations('admin/carousel', {
      setMetaInfo: 'SET_META_INFO',
    }),

    submitForm() {
      this.$buefy.dialog.confirm({
        title: 'Изменение мета-информации',
        message: 'Вы уверены, что хотите сохранить такие данные для карусели?',
        confirmText: 'Да, сохранить',
        cancelText: 'Нет, передумал',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.saveData(),
      });
    },

    saveData() {
      return this.saveCarouselMeta()
        .then(() => {
          this.isEdit = false;
        });
    },

    openEditor() {
      this.tempTextToBot = this.textToBot;
      this.tempTextFromBot = this.textFromBot;
      this.tempPhone = this.phone;
      this.isEdit = true;
    },

    closeEditor() {
      this.textToBot = this.tempTextToBot;
      this.textFromBot = this.tempTextFromBot;
      this.phone = this.tempPhone;
      this.isEdit = false;
    },
  },
};
</script>
