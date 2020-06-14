<template>
  <div class="admin">
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>{{ $t("page-admin.title-first") }}</span>
        <span class="font-weight-light">{{
          $t("page-admin.title-second")
        }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click.prevent="exit">
        <span class="mr-2">{{ $t("block-auth.sign-out") }}</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid fill-height>
      <v-layout justify-center>
        <v-flex xs12 sm12 md12>
          <h1 class="display-1 font-weight-thin mb-4">
            {{ $t("page-admin.quizes") }}
          </h1>

          <AdminQuizTable
            :quizes="quizes"
            :isLoading="isQuizesLoading"
            @duplicate="startOpeningDuplicateDialog"
            @delete="startOpeningDeleteDialog"
          />

          <AdminQuizDuplicateDialog
            :isOpened="isDuplicatingDialogOpened"
            :isDuplicating="isQuizDuplicating"
            :quizId="duplicating.id"
            :quizCaption="duplicating.caption"
            :quizAmoPipelineId="duplicating.amoPipelineId"
            :quizAmoTags="duplicating.amoTags"
            @close="startClosingDuplicateDialog"
            @duplicate="duplicateQuiz"
          />

          <AdminQuizDeleteConfirmation
            :isOpened="isDeletingDialogOpened"
            :isDeleting="isQuizDeleting"
            :quizId="deleting.id"
            :quizCaption="deleting.caption"
            @close="startClosingDeleteConfirmation"
            @delete="deleteQuiz"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import AdminQuizTable from "@/components/AdminQuizTable";
import AdminQuizDuplicateDialog from "@/components/AdminQuizDuplicateDialog";
import AdminQuizDeleteConfirmation from "@/components/AdminQuizDeleteConfirmation";

export default {
  name: "AdminPage",

  components: {
    AdminQuizTable,
    AdminQuizDuplicateDialog,
    AdminQuizDeleteConfirmation
  },

  metaInfo() {
    return {
      title: this.$t("page-admin.meta-title")
    };
  },

  data() {
    return {
      duplicating: {
        id: "",
        caption: "",
        amoPipelineId: 0,
        amoTags: ""
      },

      deleting: {
        id: "",
        caption: ""
      }
    };
  },

  computed: {
    ...mapState([
      "quizes",
      "isQuizesLoading",
      "isQuizDuplicating",
      "isQuizDeleting",
      "isDuplicatingDialogOpened",
      "isDeletingDialogOpened"
    ])
  },

  methods: {
    ...mapActions({
      signOut: "SIGN_OUT_REQUEST",
      fetchQuizes: "FETCH_QUIZES",
      duplicateQuiz: "DUPLICATE_QUIZ",
      deleteQuiz: "DELETE_QUIZ"
    }),

    ...mapMutations({
      openDuplicatingDialog: "OPEN_DUPLICATING_DIALOG",
      closeDuplicatingDialog: "CLOSE_DUPLICATING_DIALOG",
      openDeletingDialog: "OPEN_DELETING_DIALOG",
      closeDeletingDialog: "CLOSE_DELETING_DIALOG"
    }),

    initializeQuizes(uid) {
      this.fetchQuizes(uid);
    },

    startOpeningDuplicateDialog(quiz) {
      this.duplicating.id = quiz.id;
      this.duplicating.caption = quiz.caption;
      this.duplicating.amoPipelineId = quiz.amoPipelineId;
      this.duplicating.amoTags = quiz.amoTags;
      this.openDuplicatingDialog();
    },

    startClosingDuplicateDialog() {
      if (!this.isQuizDuplicating) {
        this.closeDuplicatingDialog();
      }
    },

    startOpeningDeleteDialog(quiz) {
      this.deleting.id = quiz.id;
      this.deleting.caption = quiz.caption;
      this.openDeletingDialog();
    },

    startClosingDeleteConfirmation() {
      if (!this.isQuizDeleting) {
        this.closeDeletingDialog();
      }
    },

    exit() {
      this.signOut().then(() => {
        this.$router.push({
          name: "home"
        });
      });
    }
  },

  created() {
    if (this.$user) {
      this.initializeQuizes(this.$user.uid);
    }
  },

  watch: {
    $user(value) {
      this.initializeQuizes(value.uid);
    }
  }
};
</script>

<style lang="scss">
.admin {
  height: 100%;
}
</style>
