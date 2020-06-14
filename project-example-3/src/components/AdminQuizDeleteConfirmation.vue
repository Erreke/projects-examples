<template>
  <v-dialog v-model="isDialogOpened" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          $t("page-admin.quiz-delete-confirmation-title")
        }}</span>
      </v-card-title>

      <v-card-text>
        <p>
          {{ $t("page-admin.are-you-sure-deleting", { quiz: quizCaption }) }}
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="isDeleting" @click="cancel">
          {{ $t("page-admin.cancel") }}
        </v-btn>
        <v-btn
          color="error"
          :loading="isDeleting"
          :disabled="isDeleting"
          @click="confirmDelete"
        >
          {{ $t("page-admin.delete") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AdminQuizDeleteConfirmation",

  props: {
    isOpened: {
      type: Boolean,
      required: true
    },

    isDeleting: {
      type: Boolean,
      required: true
    },

    quizId: {
      type: String,
      required: true
    },

    quizCaption: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      id: "",
      caption: ""
    };
  },

  computed: {
    isDialogOpened: {
      get() {
        return this.isOpened;
      },
      set(value) {
        this.$emit("close", value);
      }
    }
  },

  methods: {
    cancel() {
      this.$emit("close");
    },

    confirmDelete() {
      this.$emit("delete", {
        sourceId: this.quizId
      });
    }
  },

  watch: {
    isDialogOpened(value) {
      if (value) {
        this.id = this.quizId;
        this.caption = this.quizCaption;
      } else {
        this.id = "";
        this.caption = "";
      }
    }
  }
};
</script>
