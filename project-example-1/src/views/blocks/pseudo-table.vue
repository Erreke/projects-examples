<template>
  <p class="pseudo-table">
    <span v-html="label"></span>
    <span>
      <span v-if="isSlotable">
        <slot />
      </span>
      <span v-else v-html="val"></span>
    </span>
  </p>
</template>

<script>
export default {
  name: 'BlockPseudoTable',

  props: {
    label: {
      type: String,
      required: true,
    },

    isSlotable: {
      type: Boolean,
      default: false,
    },

    value: {
      required: false,
    },

    fieldType: {
      type: String,
      default: 'input',
    },
  },

  computed: {
    val() {
      if (!this.value) return '-';

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

      if (this.fieldType === 'currency-usd') {
        return this.$options.filters.currency_format(this.value);
      }

      if (this.fieldType === 'currency-tng') {
        return this.$options.filters.currency_format(this.value, 'KZT');
      }

      return this.value;
    },
  },
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.pseudo-table {
  display: flex;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  line-height: 2.25rem;
  font-size: 1rem;
  background-color: inherit;

  &::after {
    content: '..............................................................................................................................................................................';
    position: absolute;
    left: 50px;
  }

  & > span {
    z-index: 1;
    position: relative;
    background-color: inherit;

    &:first-child {
      padding: 0 .5rem 0 2rem;

      @include until($tablet) {
        padding: 0 .5rem 0 0;
      }
    }

    &:last-child {
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
}
</style>
