<template>
  <v-app>
    <v-content>
      <router-view />
      <debug-board />
    </v-content>
  </v-app>
</template>

<script>
import DebugBoard from "@/components/DebugBoard.vue";

export default {
  name: "App",

  metaInfo() {
    return {
      title: "Automaton Quiz",
      titleTemplate: "%s :: Automaton Quiz",
      htmlAttrs: {
        lang: this.$i18n.locale
      }
    };
  },

  components: {
    DebugBoard
  }
};
</script>
