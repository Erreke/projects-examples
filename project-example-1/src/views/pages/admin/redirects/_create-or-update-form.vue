<template>
  <div class="create-update-form">
    <b-field :label="$t('page-admin-redirects.label-type')">
      <div class="control is-clearfix is-expanded create-update-form__dropdown">
        <b-dropdown
          aria-role="list"
          v-model="type"
          :disabled="isCreateOrUpdateProcessing"
          @active-change="changeTypeDropdownState"
          @change="changeTypeDropdownValue"
        >
          <button class="button" type="button" slot="trigger">
            <span v-if="type">{{ redirectsTypes[type] }}</span>
            <span v-else>{{ $t('page-admin-redirects.select-from-list') }}</span>
            <b-icon :icon="isTypeDropdownOpened ? 'menu-up' : 'menu-down'"></b-icon>
          </button>

          <b-dropdown-item
            aria-role="listitem"
            v-for="(item, key) in redirectsTypes"
            :value="key"
            :key="key"
          >
            <span>{{ item }}</span>
          </b-dropdown-item>

        </b-dropdown>
      </div>
    </b-field>

    <b-field
      :label="$t('page-admin-redirects.label-redirect-from')"
      :type="redirectFromError.length ? 'is-danger' : null"
      :message="redirectFromError"
      class="create-update-form__redirect-from"
    >
      <p class="control">
        <span class="button is-static">https://bot.host.com/</span>
      </p>
      <b-input v-model="redirectFrom" :disabled="isCreateOrUpdateProcessing" expanded></b-input>
      <p class="control">
        <span class="button is-static">/</span>
      </p>
    </b-field>

    <b-field v-if="type === 'whatsapp'" :label="$t('page-admin-redirects.label-phone')"
     :type="phoneError.length ? 'is-danger' : null" :message="phoneError">
      <div class="control is-clearfix is-expanded create-update-form__dropdown">
        <b-dropdown
          aria-role="list"
          v-model="phone"
          :disabled="isCreateOrUpdateProcessing"
          :loading="isAvailablePhonesFetching"
          @active-change="changePhoneDropdownState"
          @change="changePhoneDropdownValue"
        >
          <button class="button" type="button" slot="trigger">
            <span v-if="phone">{{ phone }}</span>
            <span v-else>{{ $t('page-admin-redirects.select-from-list') }}</span>
            <b-icon :icon="isPhoneDropdownOpened ? 'menu-up' : 'menu-down'"></b-icon>
          </button>

          <b-dropdown-item
            aria-role="listitem"
            v-for="item in availablePhones"
            :value="item.phone"
            :key="item.id"
          >
            <span>{{ item.phone }}</span>
          </b-dropdown-item>

          <b-dropdown-item
            aria-role="listitem"
            :value="$t('page-admin-redirects.creating-new-phone')"
            :disabled="true"
          >
            <div class="media">
              <b-icon class="media-left" icon="plus"></b-icon>
              <div class="media-content">
                <span>{{ $t('page-admin-redirects.add-new-number') }}</span>
              </div>
            </div>
          </b-dropdown-item>

        </b-dropdown>
      </div>
    </b-field>

    <b-field v-if="type === 'whatsapp'" :label="$t('page-admin-redirects.label-text')"
     :type="textError.length ? 'is-danger' : null" :message="textError">
      <b-input v-model="text" type="textarea" :disabled="isCreateOrUpdateProcessing"></b-input>
    </b-field>

    <b-field v-if="type !== 'file'" :label="$t('page-admin-redirects.label-redirect-to')"
     :type="redirectToError.length ? 'is-danger' : null" :message="redirectToError">
      <b-input v-model="redirectTo"
       :disabled="isCreateOrUpdateProcessing || type === 'whatsapp'"></b-input>
    </b-field>

    <b-field v-if="type === 'file'" :label="$t('page-admin-redirects.label-file')"
      :type="fileError.length ? 'is-danger' : null" :message="fileError">
      <b-upload v-model="file" drag-drop
       :disabled="isCreateOrUpdateProcessing" @input="isFileChanged = true">
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>{{ $t('page-admin-redirects.drop-your-file-here') }}</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div v-if="type === 'file' && file" class="tags">
      <span class="tag is-primary">
        {{ file.name }}
        <button
          type="button"
          class="delete is-small"
          :disabled="isCreateOrUpdateProcessing"
          @click="deleteFile()">
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import {
  required, minLength, maxLength, url,
} from 'vuelidate/lib/validators';

import link from '@/utils/validators/link';

const FROM_LINK_MIN_LENGTH = 1;
const FROM_LINK_MAX_LENGTH = 128;

const TO_LINK_MIN_LENGTH = 11;
const TO_LINK_MAX_LENGTH = 2048;

const TEXT_MIN_LENGTH = 1;
const TEXT_MAX_LENGTH = 1024;

export default {
  props: {
    redirectsTypes: {
      type: Object,
      required: true,
    },

    isTimeSubmit: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      isTypeDropdownOpened: false,
      isPhoneDropdownOpened: false,
      isAvailablePhonesFetching: false,
    };
  },

  validations() {
    let validations = {
      redirectFrom: {
        required,
        link,
        minLength: minLength(FROM_LINK_MIN_LENGTH),
        maxLength: maxLength(FROM_LINK_MAX_LENGTH),
      },
    };

    if (this.type === 'whatsapp' || this.type === 'external') {
      validations = {
        ...validations,
        redirectTo: {
          required,
          url,
          minLength: minLength(TO_LINK_MIN_LENGTH),
          maxLength: maxLength(TO_LINK_MAX_LENGTH),
        },
      };
    }

    if (this.type === 'whatsapp') {
      validations = {
        ...validations,
        phone: {
          required,
        },
        text: {
          required,
          minLength: minLength(TEXT_MIN_LENGTH),
          maxLength: maxLength(TEXT_MAX_LENGTH),
        },
      };
    }

    if (this.type === 'file') {
      validations = {
        ...validations,
        file: {
          required,
        },
      };
    }

    return validations;
  },

  computed: {
    ...mapState('admin/redirects', ['isCreateOrUpdateProcessing', 'availablePhones', 'createOrUpdateFormItems']),

    type: {
      get() {
        return this.createOrUpdateFormItems.type;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'type',
          value,
        });
      },
    },

    redirectFrom: {
      get() {
        return this.createOrUpdateFormItems.redirectFrom;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'redirectFrom',
          value,
        });
      },
    },

    redirectTo: {
      get() {
        if (this.type === 'whatsapp') {
          return encodeURI(`https://api.whatsapp.com/send?phone=${this.phone}&text=${this.text}`);
        }

        return this.createOrUpdateFormItems.redirectTo;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'redirectTo',
          value,
        });
      },
    },

    phone: {
      get() {
        return this.createOrUpdateFormItems.phone;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'phone',
          value,
        });
      },
    },

    text: {
      get() {
        return this.createOrUpdateFormItems.text;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'text',
          value,
        });
      },
    },

    file: {
      get() {
        return this.createOrUpdateFormItems.file;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'file',
          value,
        });
      },
    },

    isFileChanged: {
      get() {
        return this.createOrUpdateFormItems.isFileChanged;
      },

      set(value) {
        this.setCreateOrUpdateFormItem({
          type: 'isFileChanged',
          value,
        });
      },
    },

    redirectFromError() {
      const errors = [];

      if (!this.$v.redirectFrom) return errors;

      if (!this.$v.redirectFrom.$dirty) return errors;

      if (!this.$v.redirectFrom.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.redirectFrom.link) errors.push(this.$t('block-errors.field-must-be-valid-link'));
      if (!this.$v.redirectFrom.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.redirectFrom.$params.minLength.min,
        }));
      }

      if (!this.$v.redirectFrom.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.redirectFrom.$params.maxLength.max,
        }));
      }

      return errors;
    },

    redirectToError() {
      const errors = [];

      if (!this.$v.redirectTo) return errors;

      if (!this.$v.redirectTo.$dirty) return errors;

      if (!this.$v.redirectTo.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.redirectTo.url) errors.push(this.$t('block-errors.field-must-be-valid-link'));
      if (!this.$v.redirectTo.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.redirectTo.$params.minLength.min,
        }));
      }

      if (!this.$v.redirectTo.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.redirectTo.$params.maxLength.max,
        }));
      }

      return errors;
    },

    phoneError() {
      const errors = [];

      if (!this.$v.phone) return errors;

      if (!this.$v.phone.$dirty) return errors;

      if (!this.$v.phone.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },

    textError() {
      const errors = [];

      if (!this.$v.text) return errors;

      if (!this.$v.text.$dirty) return errors;

      if (!this.$v.text.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.text.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.text.$params.minLength.min,
        }));
      }

      if (!this.$v.text.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.text.$params.maxLength.max,
        }));
      }

      return errors;
    },

    fileError() {
      const errors = [];

      if (!this.$v.file) return errors;

      if (!this.$v.file.$dirty) return errors;

      if (!this.$v.file.required) errors.push(this.$t('block-errors.field-is-required'));

      return errors;
    },
  },

  methods: {
    ...mapActions('admin/redirects', {
      fetchAvailablePhones: 'FETCH_AVAILABLE_PHONES',
    }),

    ...mapMutations('admin/redirects', {
      setCreateOrUpdateFormItem: 'SET_CREATE_OR_UPDATE_FORM_ITEM',
    }),

    changeTypeDropdownState(value) {
      this.isTypeDropdownOpened = value;
    },

    changeTypeDropdownValue(value) {
      this.type = value;
    },

    changePhoneDropdownState(value) {
      this.isPhoneDropdownOpened = value;
    },

    changePhoneDropdownValue(value) {
      this.phone = value;
    },

    deleteFile() {
      this.file = null;
    },
  },

  created() {
    if (this.availablePhones.length === 0) {
      this.fetchAvailablePhones();
    }
  },

  watch: {
    isTimeSubmit(value) {
      if (value) {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          this.$emit('success');
        } else {
          this.$emit('failed');
        }
      }
    },
  },
};
</script>

<style lang="scss">
.create-update-form {
  padding-bottom: 20px;

  &__dropdown {
    .dropdown {
      width: 100%;

      .dropdown-trigger {
        width: 100%;

        .button {
          width: 100%;
          justify-content: space-between;
        }
      }

      .dropdown-menu {
        width: 100%;
      }
    }
  }

  &__redirect-from {
    flex-wrap: wrap;

    .label,
    .help {
      flex: 0 0 100%;
    }

    .input[disabled] {
      border-color: #dbdbdb;
    }
  }

  .upload {
    display: block;
  }
}
</style>
