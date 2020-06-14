<template>
  <div
    :class="{
      'block-multiple-select': true,
      'block-multiple-select-disabled': isDisabled
    }"
    :tabindex="isDisabled ? null : 0"
  >
    <div
      :class="{
        'block-multiple-select__inner': true,
        'block-multiple-select__inner-disabled': isDisabled
      }">
      <b-loading :is-full-page="false" :active="isLoading"></b-loading>
      <p
        v-for="(item, key) in items"
        :class="['block-multiple-select__item', {
          'block-multiple-select__item-active': value && value.countryCity === item.countryCity,
          'block-multiple-select__item-disabled': isDisabled,
          'block-multiple-select__item-selected': currentData.includes(item.countryCity),
        }]"
        :tabindex="isDisabled || currentData.includes(item.countryCity)
          ? null
          : key + 1"
        :key="key"
        @click="select(item)"
      >
        {{ item.countryCity }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    isDisabled: {
      type: Boolean,
      required: true,
    },

    value: {
      validator: prop => typeof prop === 'object' || prop === null || prop === undefined,
      required: true,
    },

    currentData: {
      validator: prop => Array.isArray(prop) || prop === null || prop === undefined,
      required: true,
    },
  },

  methods: {
    select(value) {
      if (!this.isDisabled && !this.currentData.includes(value.countryCity)) {
        this.$emit('input', value);
      }
    },
  },
};
</script>

<style lang="scss">
.block-multiple-select {
  height: auto;
  background-color: white;
  color: #363636;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  line-height: 1.5;
  position: relative;

  &:hover {
    border-color: #b5b5b5;
  }

  &:focus,
  &:active {
    outline: none;
    border-color: #3273dc;
    box-shadow: 0 0 0 0.125em rgba(50,115,220,.25);
  }

  &-disabled,
  &-disabled:hover,
  &-disabled:focus,
  &-disabled:active {
    background-color: #f5f5f5;
    border-color: #dbdbdb;
    outline: none;
    box-shadow: none;
  }

  &__inner {
    height: 200px;
    overflow-y: scroll;

    &-disabled {
      overflow-y: hidden;
    }
  }

  &__item {
    padding: .5em 1em;
    user-select: none;
    margin: 0!important;
    cursor: pointer;

    &-selected {
      background-color: #dcdcdc;
      color: #898989;
      cursor: not-allowed;
    }

    &-disabled {
      color: #555;
      cursor: not-allowed;
    }

    &:focus,
    &-active {
      background-color: #3b63e2;
      color: #fff;
      outline: none;

      &.block-multiple-select__item-selected,
      &.block-multiple-select__item-disabled {
        background-color: #dcdcdc;
        color: #898989;
      }
    }
  }
}
</style>
