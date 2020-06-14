<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
    <debug-board />
  </v-app>
</template>

<script>
import DebugBoard from "@/components/DebugBoard.vue";

export default {
  name: "App",

  metaInfo() {
    return {
      title: "Automaton Webinar",
      titleTemplate: "%s :: Automaton Webinar",
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
