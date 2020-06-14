<template>
  <div class="langs">
    <b-select v-model="selectedOptions" :placeholder="langs[$i18n.locale]" icon="earth">
      <option
        v-for="(lang, key) in langs"
        :key="key"
        :value="key"
      >{{ lang }}</option>
    </b-select>
  </div>
</template>

<script>
export default {
  name: 'BlockLangs',

  data() {
    return {
      selectedOptions: this.$i18n.locale,
      langs: {
        ru: 'Русский',
        en: 'English',
      },
    };
  },

  watch: {
    selectedOptions(value) {
      localStorage.setItem('lang', value);
      this.$i18n.locale = value;
    },
  },
};
</script>
