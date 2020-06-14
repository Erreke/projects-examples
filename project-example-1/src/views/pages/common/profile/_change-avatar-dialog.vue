<template>
  <b-modal :active.sync="isOpened" has-modal-card>
    <div class="modal-card" style="max-width: 90%; margin: 0 auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('block-global.avatar-changing') }}</p>
      </header>

      <section class="modal-card-body">
        <input
          type="file"
          accept="image/*"
          ref="fileLoader"
          class="avatar__input"
          style="display: none;"
          @change="loadFile"
        />

        <div class="avatar-changing">
          <div class="avatar-changing__img-area">
            <vue-croppie
              ref="croppieRef"
              :enableOrientation="true"
              :enableResize="false"
              :showZoomer="false"
              :viewport="{ width: viewportSize, height: viewportSize }"
              @result="result"
              @update="update"
            >
            </vue-croppie>
          </div>
          <div class="avatar-changing__toolbar">
            <div class="buttons">
              <b-button
                class="is-fullwidth"
                icon-left="file-image"
                :disabled="isAvatarSaving"
                @click="selectFile()"
              >
                {{ $t('block-global.select-file') }}
              </b-button>

              <b-button
                class="is-fullwidth"
                icon-left="undo-variant"
                :disabled="isAvatarSaving || !rawImage"
                @click="rotate(90)"
              >
                {{ $t('block-global.rotate-left') }}
              </b-button>

              <b-button
                class="is-fullwidth"
                icon-left="redo-variant"
                :disabled="isAvatarSaving || !rawImage"
                @click="rotate(-90)"
              >
                {{ $t('block-global.rotate-right') }}
              </b-button>
            </div>

             <b-slider
              size="is-medium"
              v-model="zoomValue"
              :tooltip="false"
              :disabled="isAvatarSaving || !rawImage"
              :min="zoomerMin"
              :max="zoomerMax"
              :step="zoomerStep"
            >
            </b-slider>
          </div>
        </div>

      </section>

      <footer class="modal-card-foot">
        <b-button
          icon-left="cancel"
          :disabled="isAvatarSaving"
          @click="isOpened = false"
        >
          {{ $t('block-global.cancel') }}
        </b-button>

        <b-button
          type="is-success"
          icon-left="check"
          :disabled="isAvatarSaving || !rawImage"
          :loading="isAvatarSaving"
          @click="cropAndSave()"
        >
          {{ $t('block-global.load-avatar') }}
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ProfilePageChangeAvatarDialog',

  data() {
    return {
      rawImage: null,
      croppedImage: null,
      zoomValue: 0.1,
      zoomerMin: 0,
      zoomerMax: 1.5,
      zoomerStep: 0.01,
      viewportSize: 200,
    };
  },

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState('user', ['isAvatarSaving']),
    isOpened: {
      get() {
        return this.isActive;
      },

      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
  },

  methods: {
    ...mapActions('user', {
      saveUserInfo: 'SAVE_USER_INFO',
    }),

    loadFile() {
      const reader = new FileReader();
      reader.readAsDataURL(this.$refs.fileLoader.files[0]);
      reader.onload = () => {
        this.rawImage = reader.result;
      };
    },

    selectFile() {
      this.$refs.fileLoader.click();
    },

    cropAndSave() {
      const options = {
        format: 'jpeg',
      };

      this.$refs.croppieRef.result(options, (output) => {
        this.saveUserInfo({
          uid: this.$_user.uid,
          fields: ['avatar'],
          values: [output],
          loader: 'user/SET_AVATAR_SAVING_PROCESS',
        })
          .then(() => {
            this.isOpened = false;
          });
      });
    },

    result(output) {
      this.croppedImage = output;
    },

    update(value) {
      this.zoomValue = value.zoom;
    },

    rotate(rotationAngle) {
      this.$refs.croppieRef.rotate(rotationAngle);
    },

    reset() {
      this.rawImage = null;
      this.croppedImage = null;
      this.zoomValue = 0.1;
    },
  },

  watch: {
    rawImage(value) {
      if (value) {
        this.$refs.croppieRef.bind({
          url: value,
        });
      }
    },

    zoomValue(value) {
      this.$refs.croppieRef.setZoom(value);
    },

    isOpened(value) {
      if (!value) {
        this.reset();
      }
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.avatar-changing {
  display: flex;

  @media (max-width: $tablet) {
    flex-direction: column;
  }

  .croppie-container .cr-viewport,
  .croppie-container .cr-resizer {
    border-radius: 50%;
  }

  &__img-area {
    flex-shrink: 0;
    width: 300px;
    height: 300px;

    @media (max-width: $tablet) {
      width: 100%;
    }
  }

  &__toolbar {
    padding: 0 0 0 1em;

    @media (max-width: $tablet) {
      padding: 1em 0 0;
    }
  }
}
</style>
