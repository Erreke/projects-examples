<template>
  <div :class="
    ['pseudo-table-editable-container', { 'is-danger': errorMessages && errorMessages.length }]
  ">
    <p class="pseudo-table-editable" @keyup.esc="setViewMode">
      <span v-html="label"></span>
      <span>
        <span
          v-if="activePseudoTableId !== _uid"
          :class="[
            { 'pseudo-table-editable__editor': isEditable },
            { 'is-saving': isEditable && isSaving }
          ]"
          @click="setEditMode"
        >
          <span v-if="isSlotable">
            <slot />
          </span>
          <span v-else v-html="val"></span>
        </span>
        <form @submit.prevent="submit" v-else>
          <b-field>
            <b-input
              v-if="fieldType === 'input'"
              v-model="formInputValue"
              type="text"
              ref="input"
              :placeholder="placeholder"
              :disabled="isSaving"
              @input="(e) => $emit('input', e)"
            >
            </b-input>

            <date-picker
              v-if="fieldType === 'date'"
              v-model="formInputValue"
              :years-range="[-50, 50]"
              :max-date="maxDate"
              :min-date="minDate"
              :focused-date="focusedDate"
              :placeholder="placeholder"
              :disabled="isSaving"
              ref="datepicker"
            >
            </date-picker>

            <b-radio-button
              v-if="fieldType === 'gender'"
              type="is-info"
              native-value="male"
              v-model.trim="formInputValue"
            >
              <b-icon pack="mdi" icon="human-male"></b-icon>
              <span>{{ $t('block-auth.gender-male') }}</span>
            </b-radio-button>

            <b-radio-button
              v-if="fieldType === 'gender'"
              type="is-danger"
              native-value="female"
              v-model.trim="formInputValue"
            >
              <b-icon pack="mdi" icon="human-female"></b-icon>
              <span>{{ $t('block-auth.gender-female') }}</span>
            </b-radio-button>

            <b-autocomplete
              v-if="fieldType === 'autocomplete'"
              icon="earth"
              field="name"
              v-model.trim="formInputValue"
              :data="autocompleteData"
              :loading="loading"
              :placeholder="placeholder"
              :open-on-focus="true"
              @keyup.native="(event) => $emit('autocomplete-keyup', event)"
              @select="(option) => $emit('autocomplete-select', option)"
              @input="(e) => $emit('input', e)"
            >
              <template slot-scope="props">
                <div class="media">
                  <div class="media-content">
                    <span>{{ props.option.name }}</span>
                    <br>
                    <small>{{ props.option.countryName }}, {{ props.option.regionName }}</small>
                  </div>
                </div>
              </template>
            </b-autocomplete>

            <span class="control">
              <b-button
                type="is-warning"
                native-type="button"
                icon-right="cancel"
                :disabled="isSaving || isControlsDisabled"
                @click.prevent="setViewMode"
              />
            </span>
            <span class="control">
              <b-button
                type="is-success"
                native-type="submit"
                icon-right="check"
                :disabled="isSaving || isControlsDisabled"
                :loading="isSaving"
              />
            </span>
          </b-field>
        </form>
      </span>
    </p>

    <div class="help" v-if="errorMessages && errorMessages.length">
      <ul v-if="errorMessages.length > 1">
        <li v-for="(item, key) in errorMessages" :key="key">{{ item }}</li>
      </ul>
      <span v-else>{{ errorMessages[0] }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'BlockPseudoTableEditable',

  props: {
    isEditable: {
      type: Boolean,
      default: true,
    },

    isSaving: {
      type: Boolean,
      default: false,
    },

    isSlotable: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      required: true,
    },

    value: {
      required: false,
    },

    errorMessages: {
      type: Array,
    },

    field: {
      type: String,
    },

    onSubmit: {
      type: Function,
    },

    onCancel: {
      type: Function,
    },

    fieldType: {
      type: String,
      default: 'input',
    },

    maxDate: {
      type: Date,
    },

    minDate: {
      type: Date,
    },

    focusedDate: {
      type: Date,
    },

    placeholder: {
      type: String,
      default: 'Введите значение...',
    },

    loading: {
      type: Boolean,
    },

    autocompleteData: {
      type: Array,
    },

    isControlsDisabled: {
      type: Boolean,
    },
  },

  components: {
    DatePicker: () => import('@/views/blocks/date-picker.vue'),
  },

  data() {
    return {
      formInputValue: null,
      initialInputValue: null,
    };
  },

  computed: {
    ...mapState('interface', ['activePseudoTableId']),

    val() {
      if (!this.value && !this.isEditable) return '-';

      if (!this.value && this.isEditable) return 'Не задан';

      if (Object.prototype.hasOwnProperty.call(this.value, 'seconds')) {
        if (this.fieldType === 'date') {
          return this.$options.filters.date_format(this.value.seconds);
        }

        if (this.fieldType === 'datetime') {
          return this.$options.filters.date_time_format(this.value.seconds);
        }
      }

      if (this.value instanceof Date) {
        if (this.fieldType === 'date') {
          return this.$options.filters.date_format(this.value);
        }

        if (this.fieldType === 'datetime') {
          return this.$options.filters.date_time_format(this.value);
        }
      }

      if (Array.isArray(this.value)) return this.value.length;

      if (this.fieldType === 'gender') {
        return this.$t(`block-auth.gender-${this.value}`);
      }

      return this.value;
    },
  },

  methods: {
    ...mapMutations('interface', {
      setPseudoTableAciveId: 'SET_PSEUDO_TABLE_ACIVE_ID',
    }),

    setEditMode() {
      if (!this.isSaving && this.isEditable) {
        this.$emit('reset-validator');

        if (this.fieldType === 'date') {
          if (this.value && this.value.seconds) {
            this.formInputValue = new Date(this.value.seconds * 1000);
          } else {
            this.formInputValue = this.maxDate;
          }
        } else {
          this.formInputValue = this.value;
        }

        // eslint-disable-next-line no-underscore-dangle
        this.setPseudoTableAciveId(this._uid);

        this.$nextTick(() => {
          if (this.fieldType === 'input') {
            this.$refs.input.focus();
          }
        });
      }
    },

    setViewMode() {
      if (!this.isSaving) {
        this.onCancel(this.field);
        this.setPseudoTableAciveId(null);
        this.formInputValue = null;
      }
    },

    submit() {
      this.onSubmit(this.field, this.formInputValue)
        .then((result) => {
          if (result) {
            this.setViewMode();
          }
        })
        .catch(e => e);
    },
  },
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.pseudo-table-editable {
  display: flex;
  justify-content: space-between;
  line-height: 2.25rem;

  & > span {
    position: relative;

    &:first-child {
      flex: 1 1 auto;
      overflow: hidden;
      padding: 0 0 0 2rem;

      &::after {
        content: '..............................................................................................................................................................................';
        margin: 0.5rem;
        z-index: -1;
      }

      @include until($tablet) {
        padding: 0 .5rem 0 0;
      }
    }

    &:last-child {
      flex: 0 0 auto;
      padding: 0 2rem 0 .5rem;

      @include until($tablet) {
        padding: 0 0 0 .5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        text-align: right;
        max-width: 60%;
      }
    }
  }

  &__editor {
    cursor: pointer;
    border-bottom: 1px dashed;
    color: #7957d5;

    &.is-saving {
      cursor: default;
      color: #7c7c7c;
    }
  }

  .button {
    width: 36px;
    padding: 0;

    .icon {
      margin: 0 auto !important;
    }

    &.b-radio.radio {
      width: 110px;

      .icon {
        margin: 0 !important;
      }
    }
  }

  &-container.is-danger {
    color: #ff3860;

    input,
    button,
    button:hover {
      border-color: #ff3860;
    }

    .help {
      padding: 0 2rem;
      text-align: right;

      @include until($tablet) {
        padding: 0;
      }
    }
  }
}
</style>
