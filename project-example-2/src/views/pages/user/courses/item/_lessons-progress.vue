<template>
  <ul class="courses-item__progressbar">
    <li
      v-for="(item, key) in items"
      :key="key"
      :class="{
        'courses-item__progressbar-item': true,
        'is-done': doneLesson >= item.number,
        'is-opened': doneLesson + 1 === item.number
      }"
      :style="`width: calc(100% / ${itemsLength};`"
    >
      <icon-daw
        v-if="item.number === 1 || item.number === itemsLength"
      ></icon-daw>
      <icon-star v-else-if="key % 3 === 0"></icon-star>
      <icon-dot v-else></icon-dot>
      <p v-if="item.number === 1" class="courses-item__progressbar-item-text">
        Старт
      </p>
      <p
        v-if="item.number === itemsLength"
        class="courses-item__progressbar-item-text"
      >
        Финиш
      </p>
    </li>
  </ul>
</template>

<script>
export default {
  name: "CourseItemPageProgressBar",

  props: {
    items: {
      validator: prop =>
        typeof prop === "object" || prop === null || prop === undefined,
      required: true
    },
    doneLesson: {
      type: Number,
      required: true,
      default: 0
    }
  },

  components: {
    IconDaw: () => import("@/views/blocks/icons/icon-daw.vue"),
    IconDot: () => import("@/views/blocks/icons/icon-dot.vue"),
    IconStar: () => import("@/views/blocks/icons/icon-star.vue")
  },

  computed: {
    itemsLength() {
      return Object.keys(this.items).length;
    }
  }
};
</script>

<style lang="scss">
.courses-item__progressbar {
  background-color: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1);

  margin: 0;
  padding: 2rem 1rem;
  color: #34425a;
  list-style-type: none;

  &::before,
  &::after {
    display: table;
    content: "";
  }

  &::after {
    clear: both;
  }

  &-item {
    position: relative;
    float: left;
    box-sizing: border-box;
    text-align: center;

    &::after {
      position: absolute;
      top: 11px;
      left: -50%;
      width: 100%;
      height: 2px;
      background-color: #34425a;
      content: "";
    }

    &:first-child::after {
      display: none;
    }

    & > svg {
      position: relative;
      z-index: 1;
      fill: #34425a;
    }

    &.is-done {
      &::after {
        background-color: #22baa0;
      }

      svg {
        fill: #22baa0;
      }

      .courses-item__progressbar-item-text {
        color: #22baa0;
      }
    }

    &.is-opened {
      &::after {
        background-color: #fa6801;
      }

      svg {
        fill: #fa6801;
      }

      .courses-item__progressbar-item-text {
        color: #fa6801;
      }
    }

    &-text {
      position: relative;
      z-index: 1;
    }
  }
}

@media (max-width: 991px) {
  .courses-item__progressbar-item-text {
    transform: rotate(90deg);
  }
  .courses-item__progressbar-item-icon {
    width: 15px;
  }
}
</style>
