<template>
  <v-dialog v-model="isDialogOpened" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          $t("page-admin.quiz-duplicate-title")
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="id" label="ID"></v-text-field>
        <v-text-field
          v-model="caption"
          :label="$t('page-admin.caption-label-placeholder')"
        ></v-text-field>
        <v-text-field
          v-model="amoPipelineId"
          :label="$t('page-admin.amo-pipeline-label-placeholder')"
        ></v-text-field>
        <v-text-field
          v-model="amoTags"
          :label="$t('page-admin.amo-tags-label-placeholder')"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" :disabled="isDuplicating" @click="cancel">
          {{ $t("page-admin.cancel") }}
        </v-btn>
        <v-btn
          color="success"
          :loading="isDuplicating"
          :disabled="isDuplicating"
          @click="duplicate"
        >
          {{ $t("page-admin.duplicate") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AdminQuizDuplicateDialog",

  props: {
    isOpened: {
      type: Boolean,
      required: true
    },

    isDuplicating: {
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
    },

    quizAmoPipelineId: {
      type: Number,
      required: true
    },

    quizAmoTags: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      id: "",
      caption: "",
      amoPipelineId: 0,
      amoTags: ""
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

    duplicate() {
      this.$emit("duplicate", {
        sourceId: this.quizId,
        destinationId: this.id,
        caption: this.caption,
        amoPipelineId: parseInt(this.amoPipelineId),
        amoTags: this.amoTags,
        createdAt: new Date(),
        createdBy: this.$user.uid,
        test: true
      });
    }
  },

  watch: {
    isDialogOpened(value) {
      if (value) {
        this.id = this.quizId;
        this.caption = this.quizCaption;
        this.amoPipelineId = this.quizAmoPipelineId;
        this.amoTags = this.quizAmoTags;
      } else {
        this.id = "";
        this.caption = "";
        this.amoPipelineId = 0;
        this.amoTags = "";
      }
    }
  }
};
</script>
