<template>
  <v-data-table :headers="headers" :items="quizes" class="elevation-1">
    <template v-slot:actions-append>
      <v-btn color="primary" @click="addItem">
        <v-icon small class="mr-2">mdi-file-plus</v-icon
        >{{ $t("page-admin.create-new") }}
      </v-btn>
    </template>

    <template v-slot:items="props">
      <td>{{ props.item.id }}</td>
      <td>{{ props.item.caption }}</td>
      <td>{{ props.item.title }}</td>
      <td>{{ props.item.amoPipelineId }}</td>
      <td>{{ props.item.amoTags }}</td>
      <td class="justify-center layout pl-0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              flat
              icon
              class="mx-0"
              @click="editItem(props.item.id)"
              v-on="on"
            >
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("page-admin.tooltip-edit") }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              flat
              icon
              class="mx-0"
              @click="duplicateItem(props.item)"
              v-on="on"
            >
              <v-icon small>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("page-admin.tooltip-duplicate") }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              flat
              icon
              class="mx-0"
              @click="deleteItem(props.item)"
              v-on="on"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("page-admin.tooltip-delete") }}</span>
        </v-tooltip>
      </td>
    </template>
    <template v-slot:no-data>
      <div class="admin-quiz-table__no-data">
        <p v-if="isLoading">{{ $t("page-admin.quiz-loading") }}</p>
        <p v-else>{{ $t("page-admin.you-do-not-have-quizes") }}</p>
      </div>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "AdminQuizTable",

  props: {
    quizes: {
      type: Array,
      required: true
    },

    isLoading: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Название", value: "caption" },
        { text: "Заголовок", value: "title" },
        { text: "ID воронки", value: "amoPipelineId" },
        { text: "Теги", value: "amoTags" },
        { text: "Действия", value: "id", sortable: false }
      ]
    };
  },

  methods: {
    addItem() {
      this.$router.push({
        name: "admin-create"
      });
    },

    editItem(quizId) {
      this.$router.push({
        name: "admin-edit",
        params: {
          quizId: quizId
        }
      });
    },

    duplicateItem(quiz) {
      this.$emit("duplicate", quiz);
    },

    deleteItem(quiz) {
      this.$emit("delete", quiz);
    }
  }
};
</script>

<style lang="scss">
.admin-quiz-table {
  &__no-data {
    text-align: center;
    padding: 4em 0;
  }
}
</style>
