<template>
  <div
    :class="[
      'business-places-node',
      { 'is-root': isRoot },
      { 'has-childs': hasChilds },
    ]"
  >
    <div class="business-places-node__item">
      <b-tooltip
        label="Показать детали"
        position="is-bottom"
        animated
      >
        <img
          v-if="avatar"
          :class="[
            'business-places-node__avatar',
            { 'is-purchased': isPurchased && isInstimePurchased }
          ]"
          :src="avatar"
          @click="openDetails"
        >
        <div
          v-else
          :class="[
            'business-places-node__avatar',
            { 'is-purchased': isPurchased && isInstimePurchased },
            { 'is-not-purchased': !isPurchased && !isInstimePurchased },
          ]"
          @click="openDetails"
        >
          <i class="fas fa-user-tie"></i>
        </div>
      </b-tooltip>
      <h2 class="business-places-node__title">{{ referralCode }}</h2>
      <b-button
        v-if="hasChilds"
        class="business-places-node__open-child"
        type="is-primary"
        size="is-small"
        @click.prevent="toggleChildren"
      >
        <b-icon
          :icon="isChildrenShowed ? 'minus' : 'plus'"
          size="is-small"
        >
        </b-icon>
      </b-button>

      <div class="business-places-node__generation">
        <p>Уровень: {{ generation }}</p>
        <p>Номер: {{ number }}</p>
      </div>
    </div>
    <div v-if="hasChilds && isChildrenShowed" class="business-places-node__child">
      <business-places-node
        v-for="(child, key) in childs"
        :key="key"
        :generation="generation + 1"
        :avatar="child.avatar"
        :childs="child.childs"
        :expired-at="child.automatonExpiredAt"
        :instime-expired-at="child.instimeExpiredAt"
        :instagram="child.instagram"
        :is-purchased="child.isPurchased"
        :is-instime-purchased="child.isInstimePurchased"
        :package-name="child.packageName"
        :referral-code="child.referralCode"
        :number="child.number"
      ></business-places-node>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
/* eslint-disable valid-typeof */
function validator(prop, type) {
  if (Array.isArray(type)) {
    const typeofs = type.reduce((a, b) => typeof prop === a || typeof prop === b);

    return typeofs || prop === undefined || prop === null;
  }
  return typeof prop === type || prop === undefined || prop === null;
}

export default {
  name: 'BusinessPlacesNode',

  props: {
    isRoot: {
      type: Boolean,
    },
    generation: {
      type: Number,
    },
    avatar: {
      validator: prop => validator(prop, 'string'),
      required: true,
    },
    childs: {
      validator: prop => validator(prop, 'object'),
      required: true,
    },
    automatonExpiredAt: {
      validator: prop => validator(prop, 'object'),
      required: true,
    },
    instimeExpiredAt: {
      validator: prop => validator(prop, 'object'),
      required: true,
    },
    instagram: {
      validator: prop => validator(prop, 'string'),
      required: true,
    },
    isPurchased: {
      validator: prop => validator(prop, 'boolean'),
      required: true,
    },
    isInstimePurchased: {
      validator: prop => validator(prop, 'boolean'),
      required: true,
    },
    packageName: {
      validator: prop => validator(prop, 'string'),
      required: true,
    },
    referralCode: {
      validator: prop => validator(prop, 'string'),
      required: true,
    },
    number: {
      type: Number,
    },
  },

  data() {
    return {
      isChildrenShowed: false,
    };
  },

  computed: {
    hasChilds() {
      return this.childs
        && this.childs.constructor === Object
        && Object.keys(this.childs).length > 0;
    },
  },

  methods: {
    ...mapMutations('admin/business-places', {
      setCurrentItemId: 'SET_CURRENT_ITEM_ID',
      openDetailsDialog: 'OPEN_DETAILS_DIALOG',
    }),

    toggleChildren() {
      this.isChildrenShowed = !this.isChildrenShowed;
    },

    openDetails() {
      this.setCurrentItemId(this.referralCode);

      this.openDetailsDialog();
    },
  },
};
</script>

<style lang="scss">
$line-color: #999;
$bg-color-1: #f4f6f6;
$bg-color-2: #eaeded;
$bg-color-3: #d5dbdb;
$bg-color-4: #bfc9ca;
$bg-color-5: #aab7b8;
$bg-color-6: #95a5a6;
$bg-color-7: #839192;
$bg-color-8: #717d7e;
$bg-color-9: #4d5656;
$bg-color-10: #424949;

.business-places-node {
  text-align: center;
  position: relative;
  width: 100%;

  &__item {
    padding: 0 1rem;
  }

  &__generation {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    padding-top: 1rem;
  }

  &:not(.is-root)::before {
    top: -4em;
    height: 4em;
    content: '';
    left: 50%;
    position: absolute;
    width: 1px;
    background-color: $line-color;
  }

  &:not(.is-root):first-child::before,
  &:not(.is-root):last-child::before {
    top: -2em;
    height: 2em;
  }

  &:not(.is-root):last-child::before {
    left: unset;
    right: 50%;
  }

  &:not(.is-root):first-child::after {
    content: '';
    height: 3em;
    right: 50%;
    left: 0;
    position: absolute;
    bottom: 100%;
  }

  &:not(.is-root):last-child::after {
    content: '';
    height: 3em;
    right: 0;
    left: 50%;
    position: absolute;
    bottom: 100%;
  }

  &__avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    border: 3px solid #2b3e50;
    margin-top: 5rem;
    font-size: 40px;
    overflow: hidden;
    cursor: pointer;
    line-height: 50px;

    &.is-purchased {
      border: 3px solid #09b51e;
      color: #09b51e;
    }

    &.is-not-purchased {
      font-size: 40px;
      line-height: 44px;
      padding: 4px 0 0;
      height: 50px;
      margin-bottom: 7px;
      }
  }

  &__title {
    margin-bottom: .5em;
    position: relative;
  }

  &__child {
    display: flex;
    justify-content: space-around;
    padding-top: 2em;
    border-top: 1px solid $line-color;
  }

  &__open-child {
    margin-bottom: 2rem;
  }

  &.has-childs > .business-places-node__title {
    &::before {
      top: 1.5em;
      width: 1px;
      background-color: $line-color;
      content: '';
      height: 2em;
      left: 50%;
      position: absolute;
    }
  }
}

.business-places-node {
  &:not(.is-root):first-child::after,
  &:not(.is-root):last-child::after {
    background-color: $bg-color-1;
  }

  &__generation {
    background: $bg-color-1;
  }

  .business-places-node {
    &:not(.is-root):first-child::after,
    &:not(.is-root):last-child::after {
      background-color: $bg-color-2;
    }

    &__generation {
      background: $bg-color-2;
    }

    .business-places-node {
      &:not(.is-root):first-child::after,
      &:not(.is-root):last-child::after {
        background-color: $bg-color-3;
      }

      &__generation {
        background: $bg-color-3;
      }

      .business-places-node {
        &:not(.is-root):first-child::after,
        &:not(.is-root):last-child::after {
          background-color: $bg-color-4;
        }

        &__generation {
          background: $bg-color-4;
        }

        .business-places-node {
          &:not(.is-root):first-child::after,
          &:not(.is-root):last-child::after {
            background-color: $bg-color-5;
          }

          &__generation {
            background: $bg-color-5;
          }

          .business-places-node {
            &:not(.is-root):first-child::after,
            &:not(.is-root):last-child::after {
              background-color: $bg-color-6;
            }

            &__generation {
              background: $bg-color-6;
            }

            .business-places-node {
              color: #fff;

              .business-places-node__avatar {
                border: 3px solid #fff;
              }

              &:not(.is-root):first-child::after,
              &:not(.is-root):last-child::after {
                background-color: $bg-color-7;
              }

              &__generation {
                background: $bg-color-7;
              }

              .business-places-node {
                &:not(.is-root):first-child::after,
                &:not(.is-root):last-child::after {
                  background-color: $bg-color-8;
                }

                &__generation {
                  background: $bg-color-8;
                }

                .business-places-node {
                  &:not(.is-root):first-child::after,
                  &:not(.is-root):last-child::after {
                    background-color: $bg-color-9;
                  }

                  &__generation {
                    background: $bg-color-9;
                  }

                  .business-places-node {
                    &:not(.is-root):first-child::after,
                    &:not(.is-root):last-child::after {
                      background-color: $bg-color-10;
                    }

                    &__generation {
                      background: $bg-color-10;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
