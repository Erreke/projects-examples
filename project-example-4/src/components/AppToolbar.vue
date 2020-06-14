<template>
  <v-toolbar color="blue-grey" dark app fixed clipped-left clipped-right>
    <v-toolbar-title class="headline text-uppercase">
      <span class="font-weight-light">{{ title }}</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="toggleMembersPanel">
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("block-global.tooltip-settings") }}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="toggleMembersPanel">
          <v-icon>contacts</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("block-global.tooltip-toggle-members") }}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="toggleCommentsPanel">
          <v-icon>comment</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("block-global.tooltip-toggle-comments") }}</span>
    </v-tooltip>

    <v-btn
      flat
      :loading="isSignOutProcessing"
      :disabled="isSignOutProcessing"
      @click.prevent="signOutRequest"
    >
      <v-icon>exit_to_app</v-icon>
      <span class="mr-2">{{ $t("block-global.sign-out") }}</span>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState(["isSignOutProcessing"])
  },

  methods: {
    ...mapActions({
      signOutRequest: "SIGN_OUT_REQUEST"
    }),

    startPlayer() {
      this.$emit("startPlayer");
    },

    toggleMembersPanel() {
      this.$emit("toggleMembersPanel");
    },

    toggleCommentsPanel() {
      this.$emit("toggleCommentsPanel");
    }
  }
};
</script>
