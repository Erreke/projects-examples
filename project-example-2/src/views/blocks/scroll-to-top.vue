<template>
  <b-button
    :title="$t('block-global.scroll-to-top')"
    :class="['scroll-to-top', { show: isTimeToShowScroller }]"
    @click.prevent="scrollToTop"
  >
    <b-icon icon="arrow-up-thick" size="is-small"></b-icon>
  </b-button>
</template>

<script>
export default {
  name: "BlockScrollToTop",

  data() {
    return {
      isTimeToShowScroller: false
    };
  },

  methods: {
    scrollTo(value) {
      window.scrollTo({
        top: value,
        behavior: "smooth"
      });
    },

    scrollToTop() {
      this.scrollTo(0);
    }
  },

  mounted() {
    window.addEventListener("scroll", () => {
      this.isTimeToShowScroller = window.innerHeight < window.pageYOffset;
    });
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.scroll-to-top {
  cursor: pointer;
  opacity: 0;
  position: fixed;
  z-index: 100001;
  bottom: -4em;
  width: 3rem;
  height: 3rem;
  line-height: 3em;
  padding: 0;
  right: 2rem;
  transition: all 0.5s ease;
  color: #fff;
  background-color: $sidebar;
  border-radius: 50%;
  border: 0;

  @media (hover: none) and (pointer: coarse) {
    right: 1.3rem;
    width: 4rem;
    height: 4rem;
  }

  &:active,
  &:focus,
  &:hover {
    color: #fff;
    border-color: $sidebar-hover;
    background-color: $sidebar-hover;
    box-shadow: none;
  }

  &.show {
    opacity: 1;
    bottom: 4rem;

    @media (hover: none) and (pointer: coarse) {
      bottom: 6.5em;
    }
  }

  span {
    display: block;
    margin: 0;
  }

  .icon {
    font-size: 2rem;
  }

  i {
    display: block;
    line-height: 3rem;
    font-size: 1.5rem;

    @media (hover: none) and (pointer: coarse) {
      font-size: 2rem;
    }
  }
}

.jivo-site-opened {
  .scroll-to-top.show {
    bottom: 32.5rem;
  }
}
</style>
