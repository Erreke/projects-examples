<template>
  <div :class="['tariffs__current-item', `is-${getStatus(item).class}`]">
    <div class="tariffs__current-item-content">
      <pseudo-table
        :label="$t('page-tariffs.status')"
        :is-slotable="true"
      >
        <span :class="['tag', `is-${getStatus(item).class}`]">
          {{ getStatus(item).text }}
        </span>
      </pseudo-table>

      <pseudo-table
        :label="$t('page-tariffs.tariff')"
        :value="item.tariff"
      />

      <pseudo-table
        :label="$t('page-tariffs.price')"
        :value="item.priceUSD"
        :field-type="item.priceUSD ? 'currency-usd' : null"
      />

      <pseudo-table
        :label="$t('page-tariffs.amount')"
        :value="item.amountTNG"
        :field-type="item.amountTNG ? 'currency-tng' : null"
      />

      <b-collapse
        :open="false"
        position="is-bottom"
        aria-id="contentIdForA11y1"
        v-if="item.isPaymentConfirmed"
      >
        <a
          class="tariffs__current-item-collapser"
          slot="trigger"
          slot-scope="props"
          aria-controls="contentIdForA11y1"
        >
          <span>
            {{
              !props.open
                ? $t('page-tariffs.collapse-show-details')
                : $t('page-tariffs.collapse-hide-details')
            }}
          </span>
        </a>

        <hr>

        <pseudo-table
          :label="$t('page-tariffs.attempted-at')"
          :value="item.attemptedAt"
          field-type="datetime"
        />

        <pseudo-table
          :label="$t('page-tariffs.payment-confirmed-at')"
          :value="item.paymentConfirmedAt"
          field-type="datetime"
        />

        <pseudo-table
          v-if="item.adRunnedAt"
          :label="$t('page-tariffs.ad-runned-at')"
          :value="item.adRunnedAt"
          field-type="datetime"
        />

        <pseudo-table
          v-if="item.adStoppedAt"
          :label="$t('page-tariffs.ad-stopped-at')"
          :value="item.adStoppedAt"
          field-type="datetime"
        />

        <pseudo-table
          :label="$t('page-tariffs.expired-at')"
          :value="item.adExpiredAt"
          field-type="datetime"
        />

        <pseudo-table
          :label="$t('page-tariffs.id')"
          :value="item.id"
        />
      </b-collapse>

      <p class="tariffs__current-item-continue" v-else>
        <a href="#" @click.prevent="buy">Продолжить покупку</a>
      </p>
    </div>
  </div>
</template>

<script>
import StatusMixin from '@/utils/mixins/tariff-status';

export default {
  name: 'TariffsPageCurrentTabItem',

  mixins: [StatusMixin],

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    buy() {
      this.$emit('buy');
    },
  },
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.tariffs__current-item {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  flex: 0 0 calc(33.3333% - 1rem);
  background-color: #fff;
  box-shadow: 0 8px 12px 0 rgba(122, 122, 122, .2);
  position: relative;
  padding: 2rem 0 1.5rem;
  margin: 0 .5rem 1rem;

  @include from(2085px) {
    flex: 0 0 calc(25% - 1rem);
  }

  @include until(2084px) {
    flex: 0 0 calc(33.3333% - 1rem);
  }

  @include until(1552px) {
    flex: 0 0 calc(50% - 1rem);
  }

  @include until(1080px) {
    flex: 0 0 calc(100% - 1rem);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    height: 1rem;
    left: 0;
    width: 50%;
    background-color: #f5f5f5;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    height: 1rem;
    right: 0;
    width: 50%;
    background-color: #888888;
  }

  &.is-warning {
    &::before {
      background-color: #ffdd56;
    }

    &::after {
      background-color: #b38f00;
    }
  }

  &.is-info {
    &::before {
      background-color: #177cf0;
    }

    &::after {
      background-color: #014a9e;
    }
  }

  &.is-success {
    &::before {
      background-color: #24d15f;
    }

    &::after {
      background-color: #05772c;
    }
  }

  &.is-danger {
    &::before {
      background-color: #ff3860;
    }

    &::after {
      background-color: #a20021;
    }
  }

  &-content {
    background-color: #fff;

    @media (max-width: $tablet) {
      margin: 0 1rem;
    }
  }

  &-collapser {
    margin: 2rem 0 0;
    display: block;
    padding: 0 2rem;
    text-align: right;

    @media (max-width: $tablet) {
      margin: 1rem 0;
      padding: 0;
    }

    span {
      border-bottom: 1px dashed;
    }
  }

  .collapse {
    .collapse-content {
      background-color: #fff;
    }
  }

  &-continue {
    margin: 2rem 2rem 0;
    text-align: right;

    @media (max-width: $tablet) {
      margin: 1rem 0;
    }

    a {
      border-bottom: 1px dashed;
    }
  }
}
</style>
