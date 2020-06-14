<template>
  <b-modal :active.sync="isActive" has-modal-card>
    <div class="modal-card" style="max-width: 80%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ confirmationDialogTexts.title }}</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <p>{{ confirmationDialogTexts.subtitle }}</p>
          <ul>
            <li v-for="(value, key) in confirmationDialogTexts.details" :key="key">
              {{ value }} {{ currentClient[key] }}
            </li>
          </ul>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          type="button"
          class="button is-danger"
          @click="$emit('close')"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>{{ $t("page-admin-clients.button-no") }}</span>
        </button>
        <button
          type="button"
          :class="['button is-success', { 'is-loading': isProcessing }]"
          :disabled="isProcessing"
          @click="$emit('confirm')"
        >
          <span class="icon">
            <i class="mdi mdi-check"></i>
          </span>
          <span>{{ $t("page-admin-clients.button-yes") }}</span>
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },

    isProcessing: {
      type: Boolean,
      required: true,
    },

    currentOperation: {
      required: true,
    },

    currentClient: {
      required: true,
    },
  },

  computed: {
    isActive: {
      get() {
        return this.isOpened;
      },

      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },

    confirmationDialogTexts() {
      const texts = {
        deleteDiscount: {
          title: 'Удаление дедлайна скидки',
          subtitle: 'Вы уверены, что хотите удалить дедлайн скидки?',
          details: {
            firstName: 'Имя:',
            secondName: 'Фамилия:',
            email: 'Е-мейл:',
            phone: 'Телефон:',
            instagram: 'Instagram:',
            projectReferralLink: 'Реферальная ссылка:',
          },
        },
        blockClient: {
          title: 'Блокирование аккаунта',
          subtitle: 'Вы уверены, что хотите заблокировать аккаунт?',
          details: {
            firstName: 'Имя:',
            secondName: 'Фамилия:',
            email: 'Е-мейл:',
            phone: 'Телефон:',
          },
        },
        unBlockClient: {
          title: 'Разблокирование аккаунта',
          subtitle: 'Вы уверены, что хотите разблокировать аккаунт?',
          details: {
            firstName: 'Имя:',
            secondName: 'Фамилия:',
            email: 'Е-мейл:',
            phone: 'Телефон:',
          },
        },
        deleteUser: {
          title: 'Удаление аккаунта',
          subtitle: 'Вы уверены, что хотите удалить аккаунт?',
          details: {
            firstName: 'Имя:',
            secondName: 'Фамилия:',
            email: 'Е-мейл:',
            phone: 'Телефон:',
          },
        },
      };

      return texts[this.currentOperation] || {};
    },
  },
};
</script>
