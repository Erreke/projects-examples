<template>
  <b-collapse :open.sync="isTableActive" class="carousel__collapse">
    <div slot="trigger" slot-scope="props" >
      <h3>
        <span>{{ managerName }}</span>
        <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
        <b-button
          icon-left="cog-outline"
          size="is-small"
          @click.stop="toggleEditor"
        >
          {{ isLinkEditorActive ? 'Закрыть редактор' : 'Редактировать' }}
        </b-button>
      </h3>
    </div>

    <link-editor
      :ref-links="refLinks"
      :is-active="isLinkEditorActive"
      @close-editor="isLinkEditorActive = false"
      v-on="$listeners"
    />

    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Номер</th>
          <th>Ссылка на бот</th>
          <th>Текст от бота</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in refLinks" :key="key">
          <td>{{ item.number }}</td>
          <td>
            <a class="carousel__collapse-link" :href="item.linkToBot" target="_blank">
              {{ item.linkToBot }}
            </a>
          </td>
          <td>
            <div class="carousel__collapse-text">
              <span v-html="item.textFromBot"></span>
              <button
                class="button is-small bd-copy"
                @click.prevent="handleCopy(item.textForCopy)"
              >
                Скопировать
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </b-collapse>
</template>

<script>
import { mapState } from 'vuex';
import LinkEditor from './_link-editor.vue';

export default {
  props: {
    managerName: {
      type: String,
      required: true,
    },

    managerAlias: {
      type: String,
      required: true,
    },
  },

  components: {
    LinkEditor,
  },

  data() {
    return {
      isTableActive: false,
      isLinkEditorActive: false,
    };
  },

  computed: {
    ...mapState('admin/carousel', {
      refLinks(state, getters) {
        return getters[`${this.managerAlias}RefLinks`];
      },
    }),

    ...mapState('admin/carousel', [
      'isReflinksFetching',
    ]),
  },

  methods: {
    handleCopy(text) {
      navigator
        .clipboard
        .writeText(text)
        .then(() => {
          this.$buefy.toast.open({
            message: 'Ссылка успешно скопирована',
            type: 'is-success',
            duration: 3000,
          });
        }, () => {
          this.$buefy.toast.open({
            message: 'Не удалось скопировать ссылку. Попробуйте сделать это вручную',
            type: 'is-danger',
            duration: 3000,
          });
        });
    },

    toggleEditor() {
      this.isTableActive = true;
      this.isLinkEditorActive = !this.isLinkEditorActive;
    },
  },
};
</script>

<style lang="scss">
.carousel__collapse {
  margin-top: 2rem;

  &-text {
    position: relative;

    &:hover {
      .bd-copy {
        display: block;
      }
    }

    .bd-copy {
      display: none;
      color: #4a4a4a;
      cursor: pointer;
      font-size: .625rem;
      outline: 0;
      padding-bottom: 0;
      padding-top: 0;
      position: absolute;
      right: .25rem;
      top: .25rem;
      z-index: 1;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    .bd-copy:hover {
      background-color: #ffdd57;
      border: 1px solid #ffdd57;
      color: rgba(0,0,0,.7);
    }
  }

  h3 {
    font-size: 1.5em;
    margin-bottom: 0.6666em;
    color: #363636;
    font-weight: 600;
    line-height: 1.125;
  }

  &-link {
    word-break: break-all;
  }

  .table tr > *:nth-child(1) { width: 20%; }
  .table tr > *:nth-child(2) { width: 40%; }
  .table tr > *:nth-child(3) { width: 40%; }
}
</style>
