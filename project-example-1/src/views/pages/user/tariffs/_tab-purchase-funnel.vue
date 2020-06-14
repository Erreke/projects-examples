<template>
  <div class="tariffs__purchase-funnel">
    <p>Прогнозируемая воронка:</p>
    <ul class="tariffs__purchase-funnel-list" ref="funnel">
      <li>Показы: ~ {{ screenings | number_format }}</li>
      <li>Клики: ~ {{ clicks | number_format }}</li>
      <li>Лиды: ~ {{ leads | number_format }}</li>
      <li>Клиенты: ~ {{ customers | number_format }}</li>
      <li>Партнеры: ~ {{ partners | number_format }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TariffsPagePurchaseTabFunnel',

  props: {
    screenings: {
      type: Number,
      required: true,
    },

    bg: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },
  },

  computed: {
    clicks() { return this.screenings * 0.03; },
    leads() { return this.clicks * 0.02; },
    customers() { return this.leads * 0.05; },
    partners() { return this.customers * 0.01; },
  },

  mounted() {
    this.$refs.funnel.style.setProperty('--bg', this.bg);
    this.$refs.funnel.style.setProperty('--color', this.color);
  },
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.tariffs__purchase-items.content li {
  .tariffs__purchase-funnel {
    &-list {
      list-style: none;
      position: relative;
      overflow: hidden;
      margin: 0 0 1rem;

      &::before {
        content: '';
        position: absolute;
        background-color: var(--bg);
        top: 0;
        bottom: -35px;
        left: -123px;
        width: 160px;
        transform: rotate(-13deg);
        border-right: 1px solid var(--color);
        transition: all .5s;

        @include until(2560px) {
          transform: rotate(-13deg);
          left: -123px;
        }

        @media screen and (min-width: 1024px) and (max-width: 1312px) {
          transform: rotate(-5deg);
          left: -144px;
        }

        @include until(1024px) {
          transform: rotate(-13deg);
          left: -123px;
        }

        @include until(768px) {
          transform: rotate(-9deg);
          left: -133px;
        }

        @include until(680px) {
          transform: rotate(-17deg);
          left: -75px;
        }

        @include until(498px) {
          transform: rotate(-17deg);
          left: -115px;
        }

        @include until(420px) {
          transform: rotate(-7deg);
          left: -140px;
        }
      }

      &::after {
        content: '';
        position: absolute;
        background-color: var(--bg);
        top: 0;
        bottom: -35px;
        right: -123px;
        width: 160px;
        transform: rotate(13deg);
        border-left: 1px solid var(--color);
        transition: all .5s;

        @include until(2560px) {
          transform: rotate(13deg);
          right: -123px;
        }

        @media screen and (min-width: 1024px) and (max-width: 1312px) {
          transform: rotate(5deg);
          right: -144px;
        }

        @include until(1024px) {
          transform: rotate(13deg);
          right: -123px;
        }

        @include until(768px) {
          transform: rotate(9deg);
          right: -133px;
        }

        @include until(680px) {
          transform: rotate(17deg);
          right: -75px;
        }

        @include until(498px) {
          transform: rotate(17deg);
          right: -115px;
        }

        @include until(420px) {
          transform: rotate(7deg);
          right: -140px;
        }
      }

      li {
        margin: 0;
        background-color: #c237324f;
        border-radius: 0;
      }

      li:not(:last-child) {
        border-bottom: 1px solid var(--color);
      }

      li + li {
        background-color: #3045544f;
      }

      li + li + li {
        background-color: #609fa74f;
      }

      li + li + li + li {
        background-color: #d582644f;
      }

      li + li + li + li + li {
        background-color: #90c7ad4f;
      }

      li + li + li + li + li + li {
        background-color: #739f824f;
      }

      li + li + li + li + li + li + li {
        background-color: #ca85254f;
      }
    }
  }
}
</style>
