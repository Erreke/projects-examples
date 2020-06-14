<template>
  <div class="tariffs__purchase-items content">
    <h3>Что входит во все тарифы?</h3>
    <ol>
      <li>Услуги маркетинга (изучение рынка, определение целевой аудитории, создание УТП).</li>
      <li>Услуги дизайна (изготовление маркетинговых и рекламных материалов).</li>
      <li>Услуги копирайтинга (составление рекламных, продающих текстов, контента).</li>
      <li>Услуги по настройке рекламных компаний (реклама в соцсетях, поисковых системам,
          других каналах трафика).</li>
      <li>Автоматизация выше перечисленных бизнес процессов используя дополнительные сервисы
          (боты, смс, мэйл, crm, вебинары, автодозвон и другое).</li>
    </ol>

    <h3>Тарифы:</h3>
    <ul class="tariffs__purchase-items-list">
      <li
        :key="key"
        v-for="(item, key) in tariffs"
        :style="`background-color: ${item.bg}; color: ${item.color};`"
      >
        <h4 :style="`color: ${item.color};`">{{ item.name }}</h4>

        <tab-purchase-funnel
          :bg="item.bg"
          :color="item.color"
          :screenings="item.screenings"
        />

        <p>
          <strong :style="`color: ${item.color};`">
            Цена: {{ item.price | currency_format }}
          </strong>
        </p>

        <b-button
          type="is-success"
          :expanded="true"
          :loading="isSelecting && key === selected"
          :disabled="item.isDisabled || isSelecting"
          @click.prevent="goToBuy(item.name, item.price)"
        >
          Купить
        </b-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'TariffsPagePurchaseTabTariffs',

  components: {
    TabPurchaseFunnel: () => import('./_tab-purchase-funnel.vue'),
  },

  data() {
    return {
      tariffs: [
        {
          name: 'Standard',
          price: 300,
          bg: '#f9fbfb',
          color: '#2c3e50',
          screenings: 228317,
        },
        {
          name: 'Standard Plus',
          price: 500,
          bg: '#dceef1',
          color: '#2c3e50',
          screenings: 338864,
        },
        {
          name: 'Business',
          price: 1000,
          bg: '#c8dbe8',
          color: '#2c3e50',
          screenings: 725369,
        },
        {
          name: 'Business Plus',
          price: 3000,
          bg: '#609fa7',
          color: '#fff',
          screenings: 3836395,
        },
        {
          name: 'Premium',
          price: 5000,
          bg: '#517786',
          color: '#fff',
          screenings: 6393991,
        },
        {
          name: 'Premium Plus',
          price: 10000,
          bg: '#2f4554',
          color: '#fff',
          screenings: 12780000,
        },
      ],
      selected: null,
    };
  },

  computed: {
    ...mapState('tariff', ['isSelecting']),
  },

  methods: {
    ...mapActions('tariff', {
      selectTariff: 'SELECT_TARIFF',
    }),

    goToBuy(tariff, priceUSD) {
      this.selected = tariff;

      this.selectTariff({
        uid: this.$_user.uid,
        tariff,
        priceUSD,
      })
        .then(() => {
          this.$emit('done');
        })
        .catch(() => {
          this.$emit('error');
        });
    },
  },
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.tariffs__purchase-items {
  &.content {
    .tariffs__purchase-items-list {
      display: flex;
      flex-flow: wrap;
      margin: 0 -.75rem;
      list-style: none;

      li {
        border-radius: 5px;
        padding: 1rem;
        flex: 0 0 calc(25% - 1.5rem);
        margin: .75rem;
        text-align: center;

        @include until(2560px) {
          flex: 0 0 calc(33.3333% - 1.5rem);
        }

        @include until(1440px) {
          flex: 0 0 calc(33.3333% - 1.5rem);
        }

        @include until(1024px) {
          flex: 0 0 calc(50% - 1.5rem);
        }

        @include until(768px) {
          flex: 0 0 calc(50% - 1.5rem);
        }

        @include until(680px) {
          flex: 0 0 calc(100% - 1.5rem);
        }

        strong {
          font-size: 1.25rem;
          margin: .5rem 0;
        }
      }
    }
  }
}
</style>
