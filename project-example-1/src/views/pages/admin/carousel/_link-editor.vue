<template>
  <form class="carousel__link-editor" @submit.prevent="submitForm" v-if="isActive">
    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Номер</th>
          <th>Реферальная ссылка</th>
          <th>Удаление</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in refLinks" :key="key">
          <td>
            <b-input
              :value="item.number"
              :disabled="isReflinkSaving || isReflinkDeleting && currentId === item.id"
              @input="(value) => addToChangedsList(item.id, 'number', value)"
            ></b-input>
          </td>
          <td>
            <b-input
              :value="item.reflink"
              :disabled="isReflinkSaving || isReflinkDeleting && currentId === item.id"
              @input="(value) => addToChangedsList(item.id, 'reflink', value)"
            ></b-input>
          </td>
          <td>
            <b-button
              type="is-danger"
              icon-left="delete"
              :disabled="isReflinkDeleting && currentId === item.id"
              :loading="isReflinkDeleting && currentId === item.id"
              @click="openConfimationToDelete(item.id)"
            >
              Удалить
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="buttons">
      <b-button
        type="is-warning"
        native-type="button"
        icon-left="cancel"
        :disabled="isReflinkSaving"
        @click="closeEditor"
      >
        Отмена
      </b-button>

      <b-button
        type="is-success"
        native-type="submit"
        icon-left="check"
        :disabled="isReflinkSaving || !isFormSaveable"
        :loading="isReflinkSaving"
      >
        Сохранить изменения
      </b-button>

      <b-button
        class="carousel__link-editor-new"
        type="is-success"
        icon-left="plus"
        @click="openNewReflinkDialog"
      >
        Добавить новую
      </b-button>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },

    refLinks: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      changedFields: {},
      currentId: null,
    };
  },

  computed: {
    ...mapState('admin/carousel', [
      'isReflinkSaved',
      'isReflinkSaving',
      'reflinkSavingError',
      'isReflinkDeleted',
      'isReflinkDeleting',
      'reflinkDeletingError',
    ]),

    isFormSaveable() {
      return !!Object.keys(this.changedFields).length;
    },
  },

  methods: {
    ...mapActions('admin/carousel', {
      addCarouselReflink: 'ADD_CAROUSEL_REFLINK',
      saveCarouselReflink: 'SAVE_CAROUSEL_REFLINK',
      deleteCarouselReflink: 'DELETE_CAROUSEL_REFLINK',
    }),

    submitForm() {
      if (this.isFormSaveable) {
        this.saveCarouselReflink(this.changedFields)
          .then(() => {
            this.closeEditor();
          });
      }
    },

    addToChangedsList(id, field, value) {
      if (this.changedFields[id]) {
        if (this.changedFields[id][field]) {
          this.changedFields[id][field] = value;
        } else {
          this.changedFields[id] = {
            ...this.changedFields[id],
            [field]: value,
          };
        }
      } else {
        this.changedFields = {
          ...this.changedFields,
          [id]: {
            [field]: value,
          },
        };
      }
    },

    clearChangedFields() {
      this.changedFields = {};
    },

    closeEditor() {
      this.clearChangedFields();
      this.$emit('close-editor');
    },

    openConfimationToDelete(id) {
      this.currentId = id;

      this.$buefy.dialog.confirm({
        title: 'Удаление реферальной ссылки',
        message: 'Вы уверены, что хотите удалить реферальную ссылку?',
        confirmText: 'Да, удалить',
        cancelText: 'Нет, передумал',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteCarouselReflink(id)
          .then(() => {
            this.currentId = null;
          }),
      });
    },

    openNewReflinkDialog() {
      this.$emit('open-link-creator');

      // addCarouselReflink
    },
  },
};
</script>

<style lang="scss">
.carousel__link-editor {
  .buttons {
    margin-bottom: .5rem;
  }
  &-new {
    position: relative;
    margin-left: 1rem;

    &::before {
      position: absolute;
      content: '';
      border-right: 1px solid #ccc;
      top: 0;
      bottom: 0;
      left: -.75rem;
    }
  }
}
</style>
