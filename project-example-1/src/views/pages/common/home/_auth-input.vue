<template>
  <div class="trx_addons_popup_form_field">
    <label :class="[
      'sc_form_field',
      { 'required': isRequired },
      { 'is-loading': isLoading }
    ]">
      <span class="sc_form_field_wrap">
        <input
          :type="inputType"
          :name="name"
          :autofocus="isAutofocused"
          :value="value"
          :disabled="isDisabled"
          :class="{ filled: value }"
          :inputmode="inputmode"
          @input="handleInput"
        >
        <span class="sc_form_field_hover">
          <i :class="`sc_form_field_icon trx_addons_icon-${icon}`"></i>
          <span class="sc_form_field_content">{{ placeholder }}</span>
        </span>
        <span v-if="hasErrors" class="icon is-right has-text-danger">
          <i class="mdi mdi-alert-circle mdi-24px"></i></span>
        <span v-if="type === 'password'" class="icon is-right is-clickable"
         @click.prevent="isShowPassword = !isShowPassword">
          <i :class="['mdi mdi-24px', { 'mdi-eye-off': isShowPassword },
           { 'mdi-eye': !isShowPassword },]"></i>
        </span>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'HomePageAuthInput',

  props: {
    value: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    inputmode: {
      type: String,
      default: 'search',
    },

    icon: {
      type: String,
      required: true,
    },

    placeholder: {
      type: String,
      required: true,
    },

    isAutofocused: {
      type: Boolean,
    },

    isDisabled: {
      type: Boolean,
    },

    isRequired: {
      type: Boolean,
    },

    isLoading: {
      type: Boolean,
    },

    hasErrors: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isShowPassword: false,
    };
  },

  computed: {
    inputType() {
      if (this.type !== 'password') {
        return this.type;
      }

      if (this.isShowPassword) {
        return 'text';
      }

      return 'password';
    },
  },

  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
      this.$emit('change', this.name);
    },
  },
};
</script>

<style lang="scss">
.sc_form_field {
  position: relative;

  &.is-loading::after {
    position: absolute !important;
    right: 22px;
    top: 25px;
    z-index: 4;
    animation: spinAround 500ms infinite linear;
    border: 2px solid #dbdbdb;
    border-radius: 290486px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: '';
    display: block;
    height: 1em;
    position: relative;
    width: 1em;
  }

  .icon.is-right {
    position: absolute;
    right: 18px;
    top: 23px;
  }
}

[autocomplete="new-password"] {
  .sc_form_field {
    .icon.is-right.has-text-danger {
      right: 48px;
    }
  }
}
</style>
