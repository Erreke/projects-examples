<template>
  <div class="sorter">
    {{ label }}
    <div class="sorter__field field has-addons">
      <p class="control">
        <b-button
          icon-right="arrow-up-thick"
          size="is-small"
          :type="direction === 'asc' ? 'is-primary' : ''"
          @click="$emit('sort', 'asc')"
        />
      </p>
      <p class="control">
        <b-button
          icon-right="arrow-down-thick"
          size="is-small"
          :type="direction === 'desc' ? 'is-primary' : ''"
          @click="$emit('sort', 'desc')"
        />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlockSorter",

  props: {
    label: {
      type: String,
      required: true
    },

    direction: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss">
.sorter {
  text-align: right;
  &__field.field.has-addons {
    display: inline-flex;
  }
}
</style>
