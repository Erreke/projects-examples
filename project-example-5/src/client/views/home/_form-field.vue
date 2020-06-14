<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control has-icons-left has-icons-right">
      <textarea
        v-if="inputType === 'textarea'"
        class="textarea"
        :value="value"
        :disabled="disabled"
        @input="handleInput"
      />
      <input
        v-else
        :class="['input', { 'is-danger': errors.length }]"
        :placeholder="placeholder"
        :type="inputType"
        :inputmode="inputMode"
        :value="value"
        :disabled="disabled"
        @input="handleInput"
      />
      <span class="icon is-small is-left" v-if="inputIcon">
        <i :class="`fas fa-${inputIcon}`"></i>
      </span>
      <span class="icon is-small is-right" v-if="errors.length">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
      <div class="help is-danger" v-for="(error, key) in errors" :key="key">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputName: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    inputType: {
      type: String,
      required: true,
    },
    inputMode: {
      type: String,
    },
    inputIcon: {
      type: String,
    },
    errors: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      required: true
    },
  },

  methods: {
    handleInput(event) {
      this.$emit('validator-reset', this.inputName);
      this.$emit('input', event.target.value);
    },
  }
}
</script>
