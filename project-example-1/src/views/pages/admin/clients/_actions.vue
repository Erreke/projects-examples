<template>
  <div class="admin-clients__table-actions">
    <div class="admin-clients__table-actions-content">
      <div
        v-if="client.avatar"
        class="admin-clients__table-avatar"
        :style="`background-image: url(${client.avatar})`"
      ></div>
      <div
        v-else
        class="admin-clients__table-no-avatar"
      >
        <i class="fas fa-user-tie"></i>
      </div>

      <p>{{ $t('page-admin-clients.btn-th-individual-discounts') }}</p>
      <div class="buttons">
        <button
          class="button is-success"
          :disabled="isAddDiscountBtnDisabled(client.uid)"
          @click.prevent="$emit('open-discount-deadline-dialog', {
            operation: 'addDiscount',
            client: client,
          })"
        >
          <span class="icon">
            <i class="mdi mdi-plus-box"></i>
          </span>
          <span>{{ $t('page-admin-clients.btn-create-discount') }}</span>
        </button>
        <button
          class="button is-info"
          :disabled="isEditDiscountBtnDisabled(client.uid)"
          @click.prevent="$emit('open-discount-deadline-dialog', {
            operation: 'editDiscount',
            client: client,
          })"
        >
          <span class="icon">
            <i class="mdi mdi-square-edit-outline"></i>
          </span>
          <span>{{ $t('page-admin-clients.btn-update-discount') }}</span>
        </button>
        <button
          class="button is-danger"
          :disabled="isDeleteDiscountBtnDisabled(client.uid)"
          @click.prevent="$emit('open-confirmation-dialog', {
            operation: 'deleteDiscount',
            client: client,
          })"
        >
          <span class="icon">
            <i class="mdi mdi-delete"></i>
          </span>
          <span>{{ $t('page-admin-clients.btn-delete-discount') }}</span>
        </button>
      </div>

      <hr>

      <p>{{ $t('page-admin-clients.btn-th-block-client-profile') }}</p>
      <div class="buttons">
        <button
          class="button is-danger"
          :disabled="isBlockClientBtnDisabled(client)"
          @click.prevent="$emit('open-confirmation-dialog', {
            operation: 'blockClient',
            client: client,
          })"
        >
          <span class="icon">
            <i class="mdi mdi-account-lock"></i>
          </span>
          <span>{{ $t('page-admin-clients.btn-block-client-profile') }}</span>
        </button>
        <button
          class="button is-danger"
          :disabled="isUnBlockClientBtnDisabled(client)"
          @click.prevent="$emit('open-confirmation-dialog', {
            operation: 'unBlockClient',
            client: client,
          })"
        >
          <span class="icon">
            <i class="mdi mdi-account-key"></i>
          </span>
          <span>{{ $t('page-admin-clients.btn-unblock-client-profile') }}</span>
        </button>
      </div>

      <hr>

      <p>{{ $t('page-admin-clients.btn-th-delete-client-profile') }}</p>
      <div class="buttons">
        <button
          class="button is-danger"
          @click.prevent="$emit('open-confirmation-dialog', {
            operation: 'deleteUser',
            client: client,
          })"
        >
          <span class="icon">
            <i class="mdi mdi-account-off"></i>
          </span>
          <span>{{ $t('page-admin-clients.btn-delete-client-profile') }}</span>
        </button>
      </div>
    </div>

    <client-business
      :uid="client.uid"
    />
  </div>
</template>

<script>
import modeDetector from '@/utils/mode-detector';

export default {
  props: {
    client: {
      type: Object,
      required: true,
    },

    discounts: {
      type: Object,
      required: true,
    },
  },

  components: {
    ClientBusiness: () => import('./_business.vue'),
  },

  methods: {
    isAddDiscountBtnDisabled(uid) {
      return !!this.discounts[uid];
    },

    isEditDiscountBtnDisabled(uid) {
      return !this.discounts[uid];
    },

    isDeleteDiscountBtnDisabled(uid) {
      return !this.discounts[uid];
    },

    isBlockClientBtnDisabled(user) {
      return modeDetector(user) === 'ARCHIVED_MODE';
    },

    isUnBlockClientBtnDisabled(user) {
      return modeDetector(user) !== 'ARCHIVED_MODE';
    },
  },
};
</script>

<style lang="scss">
.admin-clients__table {
  &-actions {
    flex: 0 0 40%;
    background: #fff;
    box-shadow: inset 0 1px 3px #dbdbdb;

    p {
      margin-bottom: .5rem;
    }

    hr {
      margin: .5rem 0;
    }

    &-content {
      padding: 2rem;
    }
  }

  &-avatar,
  &-no-avatar {
    height: 128px;
    width: 128px;
    border-radius: 50%;
    background-size: cover;
    background-position: 50% 50%;
    margin: 0 auto 2rem;
  }

  &-no-avatar {
    font-size: 7rem;
    line-height: 11rem;
    overflow: hidden;
    text-align: center;
    background-color: #eaeaea;
    color: #989898;
  }
}
</style>
