<template>
  <v-dialog v-model="isOpened" width="1000">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Пользовательское соглашение
      </v-card-title>

      <v-card-text>
        <p>Текст</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="isOpened = false">
          {{ $t("page-quiz.i-accept") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PrivacyPolicyDialog",

  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    isOpened: {
      get() {
        return this.isActive;
      },
      set(value) {
        this.$emit("close", value);
      }
    }
  }
};
</script>
