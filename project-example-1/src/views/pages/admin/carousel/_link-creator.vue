<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <form @submit.prevent="submitForm">
      <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
        <header class="modal-card-head">
          <p class="modal-card-title">Добавление новой реферальной ссылки</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Номер:">
            <b-input
              type="text"
              v-model="number"
              :disabled="isReflinkAdding"
            >
            </b-input>
          </b-field>

          <b-field label="Реферальная ссылка:">
            <b-input
              type="text"
              v-model="reflink"
              :disabled="isReflinkAdding"
            >
            </b-input>
          </b-field>

          <b-field label="Менеджер:">
            <b-input
              type="text"
              :value="manager.name"
              :disabled="true"
            >
            </b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button
            icon-left="cancel"
            @click="isOpened = false"
          >
            Отмена
          </b-button>

          <b-button
            type="is-success"
            native-type="submit"
            icon-left="check"
            :disabled="isReflinkAdding || !isFormSubmittable"
            :loading="isReflinkAdding"
          >
            Добавить
          </b-button>
        </footer>
      </div>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },

    manager: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      number: '',
      reflink: '',
    };
  },

  computed: {
    ...mapState('admin/carousel', [
      'isReflinkAdding',
    ]),

    isOpened: {
      get() {
        return this.isActive;
      },
      set(value) {
        if (!this.isReflinkAdding && !value) {
          this.number = '';
          this.reflink = '';
          this.$emit('close');
        }
      },
    },

    isFormSubmittable() {
      return !!(this.number && this.reflink && this.manager.alias);
    },
  },

  methods: {
    ...mapActions('admin/carousel', {
      addCarouselReflink: 'ADD_CAROUSEL_REFLINK',
    }),

    submitForm() {
      if (this.isFormSubmittable) {
        this.addCarouselReflink({
          number: parseInt(this.number, 10),
          reflink: this.reflink,
          manager: this.manager.alias,
        })
          .then(() => {
            this.isOpened = false;
          });
      }
    },
  },
};
</script>
