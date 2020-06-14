<template>
  <div v-if="isActive" class="pricing-table">
    <transition name="fade">
      <div class="pricing-table-countdown content" v-if="hasDiscount">
        <h3>
          {{ $t('block-wizard.you-have-discount-title') }}
        </h3>
        <p v-if="deadlineInMilliseconds.type === 'individual'">
          {{ $t('block-wizard.you-have-individual-discount') }}
        </p>
        <p v-else>
          {{ $t('block-wizard.you-have-72-hours-discount') }}
        </p>

        <p>{{ $t('block-wizard.hurry-up') }}</p>

        <flip-countdown
          :deadline="deadline"
          :labels="labels"
        />
      </div>
    </transition>

    <div class="pricing-table-comparative">
      <div class="pricing-plan is-features">
        <div class="plan-header">Возможности</div>
        <div class="plan-price"><span class="plan-price-amount">&nbsp;</span></div>
        <div class="plan-items">
          <div class="plan-item">Срок окупаемости на 20%</div>
          <div class="plan-item">Срок окупаемости на 50%</div>
          <div class="plan-item">Срок окупаемости на 100%</div>
          <div class="plan-item">Увеличение к телу на 2й год</div>
          <div class="plan-item">Увеличение к телу на 3й год</div>
          <div class="plan-item">Количество рефералов на 1й год</div>
          <div class="plan-item">Количество рефералов на 2й год</div>
          <div class="plan-item">Количество рефералов на 3й год</div>
          <div class="plan-item">Приоритетность</div>
        </div>
      </div>

      <div
        v-for="(item, key) in businessPackages" :key="key"
        :class="[
          'pricing-plan',
          item.class,
          { 'is-disabled': item.isDisabled },
        ]"
      >
        <div class="plan-header">{{ item.name }}</div>
        <div class="plan-price">
          <span class="plan-price-amount">
            <span class="plan-price-currency">$</span>

            <transition name="fade">
              <span class="plan-price-regular" v-if="hasDiscount">
                <s>{{ item.regularPrice }}</s>
              </span>
            </transition>

            <transition name="fade">
              <span v-if="hasDiscount">{{ item.discountedPrice | number_format }}</span>
            </transition>

            <span v-if="!hasDiscount">{{ item.regularPrice | number_format }}</span>
          </span>/год
        </div>
        <div class="plan-items">
          <div class="plan-item">{{ item.payback20 }}</div>
          <div class="plan-item">{{ item.payback50 }}</div>
          <div class="plan-item">{{ item.payback100 }}</div>
          <div class="plan-item">{{ item.bodyIncrease2 }}</div>
          <div class="plan-item">{{ item.bodyIncrease3 }}</div>
          <div class="plan-item">{{ item.referrals1 }}</div>
          <div class="plan-item">{{ item.referrals2 }}</div>
          <div class="plan-item">{{ item.referrals3 }}</div>
          <div class="plan-item">{{ item.priority }}</div>
        </div>
        <div class="plan-footer">
          <b-button
            class="is-fullwidth"
            @click.prevent="goToBuy(key)"
            :loading="isSelectedPackageSaving && key === selected"
            :disabled="item.isDisabled || isSelectedPackageSaving"
          >
            <transition name="fade">
              <span v-if="hasDiscount">{{ $t('block-wizard.buy-with-discount') }}</span>
            </transition>
            <span v-if="!hasDiscount">{{ $t('block-wizard.buy') }}</span>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import { mapActions, mapState } from 'vuex';
import {
  PREMIUM_REGULAR_PRICE,
  BUSINESS_REGULAR_PRICE,
  STANDARD_REGULAR_PRICE,
  PREMIUM_DISCOUNTED_PRICE,
  BUSINESS_DISCOUNTED_PRICE,
  STANDARD_DISCOUNTED_PRICE,
} from '@/config';

export default {
  name: 'BlockWizardPricingTable',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    FlipCountdown: () => import('vue2-flip-countdown'),
  },

  data() {
    return {
      selected: null,
      hasDiscount: false,
      interval: null,
    };
  },

  computed: {
    ...mapState('user', ['discountDeadline']),

    ...mapState('business-place', ['isSelectedPackageSaving']),

    businessPackages() {
      return {
        Standard: {
          class: this.selected === 'Standard' ? 'is-active' : 'is-warning',
          name: 'Standard',
          discountedPrice: STANDARD_DISCOUNTED_PRICE,
          regularPrice: STANDARD_REGULAR_PRICE,
          payback20: 'через 1-2 месяца',
          payback50: 'через 3-4 месяцев',
          payback100: 'через 6-7 месяцев',
          bodyIncrease2: '30% - 100%',
          bodyIncrease3: '101% - 300%',
          referrals1: '50',
          referrals2: '70 - 100',
          referrals3: '... - ...',
          priority: 'Средняя',
          isDisabled: false,
        },
        Business: {
          class: this.selected === 'Business' ? 'is-active' : 'is-info',
          name: 'Business',
          discountedPrice: BUSINESS_DISCOUNTED_PRICE,
          regularPrice: BUSINESS_REGULAR_PRICE,
          payback20: 'через 1-2 месяца',
          payback50: 'через 3-4 месяцев',
          payback100: 'через 5-6 месяцев',
          bodyIncrease2: '30% - 200%',
          bodyIncrease3: 'от 300%',
          referrals1: '100',
          referrals2: '131 - 250',
          referrals3: '... - ...',
          priority: 'Выше среднего',
          isDisabled: false,
        },
        Premium: {
          class: this.selected === 'Premium' ? 'is-active' : 'is-danger',
          name: 'Premium',
          discountedPrice: PREMIUM_DISCOUNTED_PRICE,
          regularPrice: PREMIUM_REGULAR_PRICE,
          payback20: 'через 1-2 месяца',
          payback50: 'через 3-4 месяцев',
          payback100: 'через 5-6 месяцев',
          bodyIncrease2: '30% - 200%',
          bodyIncrease3: 'от 300%',
          referrals1: '140',
          referrals2: '200 - 300',
          referrals3: '... - ...',
          priority: 'Высокая',
          isDisabled: false,
        },
      };
    },

    labels() {
      return {
        days: this.$t('block-global.countdown.days'),
        hours: this.$t('block-global.countdown.hours'),
        minutes: this.$t('block-global.countdown.minutes'),
        seconds: this.$t('block-global.countdown.seconds'),
      };
    },

    deadlineInMilliseconds() {
      if (this.discountDeadline && this.discountDeadline.seconds * 1000 > Date.now()) {
        return {
          type: 'individual',
          value: this.discountDeadline.seconds * 1000,
        };
      }

      if (this.$_user) {
        return {
          type: '72hour',
          value: this.$_user.createdAt.seconds * 1000 + (72 * 60 * 60 * 1000),
        };
      }

      return {
        type: 'common',
        value: 0,
      };
    },

    deadline() {
      return DateTime.fromMillis(this.deadlineInMilliseconds.value).toFormat('yyyy-LL-dd HH:mm:ss');
    },
  },

  methods: {
    ...mapActions('user', {
      fetchUserDiscount: 'FETCH_USER_DISCOUNT',
    }),

    ...mapActions('business-place', {
      saveSelectedPackageAndGetPayUrl: 'SAVE_SELECTED_PACKAGE_AND_GET_PAY_URL',
    }),

    goToBuy(selected) {
      this.selected = selected;

      this.saveSelectedPackageAndGetPayUrl({
        uid: this.$_user.uid,
        packageName: selected,
      })
        .then(() => {
          this.$emit('done');
        })
        .catch(() => {
          this.$emit('error');
        });
    },

    isDeadlineExpired() {
      return this.deadlineInMilliseconds.value <= Date.now();
    },

    checkDeadline() {
      if (this.isDeadlineExpired()) {
        clearInterval(this.interval);
        this.hasDiscount = false;
      } else {
        this.hasDiscount = true;
      }
    },
  },

  mounted() {
    if (this.$_user) {
      this.fetchUserDiscount(this.$_user.uid)
        .then(() => {
          if (!this.isDeadlineExpired()) {
            this.interval = setInterval(this.checkDeadline, 3000);
          }
        });
    }
  },
};
</script>

<style lang="scss">
.pricing-table {
  &-comparative {
    display: flex;
    align-items: stretch;
    flex-direction: row;
    flex-flow: row wrap;
    justify-content: space-between;
    margin: 2em 0;
    border: 1px solid #f5f5f5;

    .pricing-plan {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      background-color: #fff;
      list-style-type: none;
      transition: .25s;

      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &.is-features {
        .plan-price {
          height: 78px;
        }
      }

      &.is-active,
      &:not(.is-features):hover {
        border: .1rem solid #f5f5f5;
        border-radius: 4px;
        box-shadow: 0 8px 12px 0 rgba(122, 122, 122, .2);
        transform: scale(1.05);

        .plan-price {
          .plan-price-amount {
            color: #00d1b2;
          }
        }
        .plan-footer {
          .button {
            background-color: #00d1b2;
            border-color: transparent;
            color: #fff;
            &:hover {
              background-color: #00c4a7;
              border-color: transparent;
              color: #fff;
            }
            &:focus {
              border-color: transparent;
              box-shadow: 0 0 .5em rgba(0, 209, 178, .25);
              color: #fff;
            }
            &:active {
              background-color: #00b89c;
              border-color: transparent;
              color: #fff;
            }
          }
          .button.is-hovered {
            background-color: #00c4a7;
            border-color: transparent;
            color: #fff;
          }
          .button.is-focused {
            border-color: transparent;
            box-shadow: 0 0 .5em rgba(0, 209, 178, .25);
            color: #fff;
          }
          .button.is-active {
            background-color: #00b89c;
            border-color: transparent;
            color: #fff;
          }
          .button[disabled] {
            background-color: #00d1b2;
            border-color: transparent;
          }
        }
      }

      &.is-info {
        .plan-price {
          .plan-price-amount {
            color: #209cee;
          }
        }
        .plan-footer {
          .button {
            background-color: #209cee;
            border-color: transparent;
            color: #fff;
            &:hover {
              background-color: #1496ed;
              border-color: transparent;
              color: #fff;
            }
            &:focus {
              border-color: transparent;
              box-shadow: 0 0 .5em rgba(32, 156, 238, .25);
              color: #fff;
            }
            &:active {
              background-color: #118fe4;
              border-color: transparent;
              color: #fff;
            }
          }
          .button.is-hovered {
            background-color: #1496ed;
            border-color: transparent;
            color: #fff;
          }
          .button.is-focused {
            border-color: transparent;
            box-shadow: 0 0 .5em rgba(32, 156, 238, .25);
            color: #fff;
          }
          .button.is-active {
            background-color: #118fe4;
            border-color: transparent;
            color: #fff;
          }
          .button[disabled] {
            background-color: #209cee;
            border-color: transparent;
            box-shadow: none;
          }
        }
      }

      &.is-warning {
        .plan-price {
          .plan-price-amount {
            color: #ffdd57;
          }
        }
        .plan-footer {
          .button {
            background-color: #ffdd57;
            border-color: transparent;
            color: rgba(0, 0, 0, .7);
            &:hover {
              background-color: #ffdb4a;
              border-color: transparent;
              color: rgba(0, 0, 0, .7);
            }
            &:focus {
              border-color: transparent;
              box-shadow: 0 0 .5em rgba(255, 221, 87, .25);
              color: rgba(0, 0, 0, .7);
            }
            &:active {
              background-color: #ffd83d;
              border-color: transparent;
              color: rgba(0, 0, 0, .7);
            }
          }
          .button.is-hovered {
            background-color: #ffdb4a;
            border-color: transparent;
            color: rgba(0, 0, 0, .7);
          }
          .button.is-focused {
            border-color: transparent;
            box-shadow: 0 0 .5em rgba(255, 221, 87, .25);
            color: rgba(0, 0, 0, .7);
          }
          .button.is-active {
            background-color: #ffd83d;
            border-color: transparent;
            color: rgba(0, 0, 0, .7);
          }
          .button[disabled] {
            background-color: #ffdd57;
            border-color: transparent;
            box-shadow: none;
          }
        }
      }

      &.is-danger {
        .plan-price {
          .plan-price-amount {
            color: #ff3860;
          }
        }
        .plan-footer {
          .button {
            background-color: #ff3860;
            border-color: transparent;
            color: #fff;
            &:hover {
              background-color: #ff2b56;
              border-color: transparent;
              color: #fff;
            }
            &:focus {
              border-color: transparent;
              box-shadow: 0 0 .5em rgba(255, 56, 96, .25);
              color: #fff;
            }
            &:active {
              background-color: #ff1f4b;
              border-color: transparent;
              color: #fff;
            }
          }
          .button.is-hovered {
            background-color: #ff2b56;
            border-color: transparent;
            color: #fff;
          }
          .button.is-focused {
            border-color: transparent;
            box-shadow: 0 0 .5em rgba(255, 56, 96, .25);
            color: #fff;
          }
          .button.is-active {
            background-color: #ff1f4b;
            border-color: transparent;
            color: #fff;
          }
          .button[disabled] {
            background-color: #ff3860;
            border-color: transparent;
            box-shadow: none;
          }
        }
      }

      &.is-disabled {
        * {
          color: #bbb !important;
        }
      }

      .plan-header {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #fff;
        color: #4a4a4a;
        font-size: 1.25rem;
        font-weight: 600;
        padding: .75em;
        align-content: center;
        text-align: center;
      }

      .plan-item {
        background: #f5f5f5;
        border-bottom: .1rem solid #fff;
        padding: .75em;
        align-content: center;
        text-align: center;
        font-size: .9em;
        color: #7a7a7a;
      }

      .plan-price {
        background-color: #fff;
        color: #4a4a4a;
        font-size: .75rem;
        font-weight: 400;
        padding: .75em;
        align-content: center;
        text-align: center;
        .plan-price-regular {
          font-size: 1.5rem;
          font-weight: normal;
          color: #7a7a7a;
        }
        .plan-price-amount {
          font-size: 2.5rem;
          font-weight: 700;
          .plan-price-currency {
            vertical-align: super;
            font-size: 1rem !important;
            font-weight: 400 !important;
            color: #4a4a4a;
            margin-right: .25rem;
          }
        }
      }

      .plan-footer {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        padding: .75em;
        align-content: center;
        text-align: center;
        margin-top: auto;
      }
    }

    @media screen and (min-width:769px) {
      .plan-item::before {
        content: attr("data-feature");
      }
    }

    @media print {
      .plan-item::before {
        content: attr("data-feature");
      }
    }

    @media screen and (max-width:768px) {
      .pricing-plan {
        .is-plan-first-mobile {
          order: -1;
        }

        .is-features {
          display: none;
        }

        .plan-item::before {
          content: attr(data-feature);
          display: block;
          font-weight: 600;
          font-size: .75rem;
          color: #ffffff;
        }
      }
    }
  }

  &-countdown {
    text-align: center;
    margin: 2rem 0;
  }
}
</style>
