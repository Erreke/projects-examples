<template>
  <div class="business-place">
    <h1 class="business-place__title">
      <span :class="[
        'business-place__title-item',
        { 'is-purchased': item.isPurchased && item.isInstimePurchased }
      ]">
        <span class="business-place__caption">{{ $t('page-business.balance') }}</span>
        <span class="business-place__balance">{{ item.balance | currency_format }}</span>
      </span>
      <span :class="[
        'business-place__title-item',
        { 'is-purchased': item.isPurchased && item.isInstimePurchased }
      ]">
        <span class="business-place__caption">{{ $t('page-business.total-earned') }}</span>
        <span class="business-place__balance">{{ item.totalEarned | currency_format }}</span>
      </span>
    </h1>

    <div v-if="item.isPurchased && item.isInstimePurchased" class="business-place__content">
      <pseudo-table
        v-if="item.referralCode"
        :label="$t('page-business.referral-code')"
        :value="item.referralCode"
      />

      <pseudo-table-editable
        v-if="item.instagram"
        :is-saving="isBusinessPlaceFieldSaving"
        :label="$t('page-business.instagram')"
        :value="item.instagram"
        field="instagram"
        :on-submit="saveField"
        :on-cancel="cancelFieldEditing"
        :error-messages="instagramErrorMessages"
        @reset-validator="resetValidator"
      />

      <pseudo-table-editable
        v-if="item.email"
        :is-saving="isBusinessPlaceFieldSaving"
        :label="$t('page-business.email')"
        :value="item.email"
        field="email"
        :on-submit="saveField"
        :on-cancel="cancelFieldEditing"
        :error-messages="emailErrorMessages"
        @reset-validator="resetValidator"
      />

      <pseudo-table-editable
        v-if="item.phone"
        :is-saving="isBusinessPlaceFieldSaving"
        :label="$t('page-business.phone')"
        :value="item.phone"
        field="phone"
        :on-submit="saveField"
        :on-cancel="cancelFieldEditing"
        :error-messages="phoneErrorMessages"
        @reset-validator="resetValidator"
      />

      <pseudo-table-editable
        v-if="item.password"
        :is-saving="isBusinessPlaceFieldSaving"
        :label="$t('page-business.password')"
        value="************"
        field="password"
        :on-submit="saveField"
        :on-cancel="cancelFieldEditing"
        :error-messages="passwordErrorMessages"
        @reset-validator="resetValidator"
      />

      <!-- <div v-if="item.instagram" :class="['pseudo-table-container', { 'is-danger': instagramErrorMessages.length }]">
        <p class="pseudo-table" @keyup.esc="unsetCurrentField('instagram')">
          <span v-html="$t('page-business.instagram')"></span>
          <span>
            <span
              v-if="!isEditable('instagram', item.id)"
              :class="['pseudo-table__editable', { 'is-saving': isBusinessPlaceFieldSaving }]"
              @click="setCurrentField('instagram', item.id, item.instagram)"
            >
              {{ item.instagram }}
            </span>
            <form @submit.prevent="saveField('instagram', item.id)" v-else>
              <b-field>
                <b-input
                  v-model="form.instagram"
                  placeholder="Введите значение..."
                  type="text"
                  size="is-small"
                  ref="instagram"
                  :disabled="isBusinessPlaceFieldSaving"
                  @input="handleInput"
                >
                </b-input>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-warning"
                    native-type="button"
                    icon-right="cancel"
                    :disabled="isBusinessPlaceFieldSaving"
                    @click.prevent="unsetCurrentField('instagram')"
                  />
                </span>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-success"
                    native-type="submit"
                    icon-right="check"
                    :disabled="isBusinessPlaceFieldSaving"
                    :loading="isBusinessPlaceFieldSaving"
                  />
                </span>
              </b-field>
            </form>
          </span>
        </p>

        <div class="help" v-if="instagramErrorMessages.length">
          <ul v-if="instagramErrorMessages.length > 1">
            <li v-for="(item, key) in instagramErrorMessages" :key="key">{{ item }}</li>
          </ul>
          <span v-else>{{ instagramErrorMessages[0] }}</span>
        </div>
      </div>

      <div v-if="item.email" :class="['pseudo-table-container', { 'is-danger': emailErrorMessages.length }]">
        <p class="pseudo-table" @keyup.esc="unsetCurrentField('email')">
          <span v-html="$t('page-business.email')"></span>
          <span>
            <span
              v-if="!isEditable('email', item.id)"
              :class="['pseudo-table__editable', { 'is-saving': isBusinessPlaceFieldSaving }]"
              @click="setCurrentField('email', item.id, item.email)"
            >
              {{ item.email }}
            </span>
            <form @submit.prevent="saveField('email', item.id)" v-else>
              <b-field>
                <b-input
                  v-model="form.email"
                  placeholder="Введите значение..."
                  type="text"
                  size="is-small"
                  ref="email"
                  :disabled="isBusinessPlaceFieldSaving"
                  @input="handleInput"
                >
                </b-input>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-warning"
                    native-type="button"
                    icon-right="cancel"
                    :disabled="isBusinessPlaceFieldSaving"
                    @click.prevent="unsetCurrentField('email')"
                  />
                </span>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-success"
                    native-type="submit"
                    icon-right="check"
                    :disabled="isBusinessPlaceFieldSaving"
                    :loading="isBusinessPlaceFieldSaving"
                  />
                </span>
              </b-field>
            </form>
          </span>
        </p>
        <div class="help" v-if="emailErrorMessages.length">
          <ul v-if="emailErrorMessages.length > 1">
            <li v-for="(item, key) in emailErrorMessages" :key="key">{{ item }}</li>
          </ul>
          <span v-else>{{ emailErrorMessages[0] }}</span>
        </div>
      </div>

      <div v-if="item.phone" :class="['pseudo-table-container', { 'is-danger': phoneErrorMessages.length }]">
        <p class="pseudo-table" @keyup.esc="unsetCurrentField('phone')">
          <span v-html="$t('page-business.phone')"></span>
          <span>
            <span
              v-if="!isEditable('phone', item.id)"
              :class="['pseudo-table__editable', { 'is-saving': isBusinessPlaceFieldSaving }]"
              @click="setCurrentField('phone', item.id, item.phone)"
            >
              {{ item.phone }}
            </span>
            <form @submit.prevent="saveField('phone', item.id)" v-else>
              <b-field>
                <b-input
                  v-model="form.phone"
                  placeholder="Введите значение..."
                  type="text"
                  size="is-small"
                  ref="phone"
                  :disabled="isBusinessPlaceFieldSaving"
                  @input="handleInput"
                >
                </b-input>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-warning"
                    native-type="button"
                    icon-right="cancel"
                    :disabled="isBusinessPlaceFieldSaving"
                    @click.prevent="unsetCurrentField('phone')"
                  />
                </span>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-success"
                    native-type="submit"
                    icon-right="check"
                    :disabled="isBusinessPlaceFieldSaving"
                    :loading="isBusinessPlaceFieldSaving"
                  />
                </span>
              </b-field>
            </form>
          </span>
        </p>
        <div class="help" v-if="phoneErrorMessages.length">
          <ul v-if="phoneErrorMessages.length > 1">
            <li v-for="(item, key) in phoneErrorMessages" :key="key">{{ item }}</li>
          </ul>
          <span v-else>{{ phoneErrorMessages[0] }}</span>
        </div>
      </div>

      <div :class="['pseudo-table-container', { 'is-danger': passwordErrorMessages.length }]">
        <p class="pseudo-table" @keyup.esc="unsetCurrentField('password')">
          <span v-html="$t('page-business.password')"></span>
          <span>
            <span
              v-if="!isEditable('password', item.id)"
              :class="['pseudo-table__editable', { 'is-saving': isBusinessPlaceFieldSaving }]"
              @click="setCurrentField('password', item.id, '')"
            >
              {{ '************' }}
            </span>
            <form @submit.prevent="saveField('password', item.id)" v-else>
              <b-field>
                <b-input
                  v-model="form.password"
                  placeholder="Введите значение..."
                  type="text"
                  size="is-small"
                  ref="password"
                  :disabled="isBusinessPlaceFieldSaving"
                  @input="handleInput"
                >
                </b-input>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-warning"
                    native-type="button"
                    icon-right="cancel"
                    :disabled="isBusinessPlaceFieldSaving"
                    @click.prevent="unsetCurrentField('password')"
                  />
                </span>
                <span class="control">
                  <b-button
                    size="is-small"
                    type="is-success"
                    native-type="submit"
                    icon-right="check"
                    :disabled="isBusinessPlaceFieldSaving"
                    :loading="isBusinessPlaceFieldSaving"
                  />
                </span>
              </b-field>
            </form>
          </span>
        </p>
        <div class="help" v-if="passwordErrorMessages.length">
          <ul v-if="passwordErrorMessages.length > 1">
            <li v-for="(item, key) in passwordErrorMessages" :key="key">{{ item }}</li>
          </ul>
          <span v-else>{{ passwordErrorMessages[0] }}</span>
        </div>
      </div> -->

      <b-collapse
        :open="false"
        position="is-bottom"
        aria-id="contentIdForA11y1"
      >
        <a
          class="business-place__collapser"
          slot="trigger"
          slot-scope="props"
          aria-controls="contentIdForA11y1"
        >
          <span>
            {{
              !props.open
                ? $t('page-business.collapse-show-details')
                : $t('page-business.collapse-hide-details')
            }}
          </span>
        </a>

        <hr>

        <pseudo-table
          v-if="item.regularPrice"
          :label="$t('page-business.price')"
          :value="`<s>${currencyFormat(item.regularPrice)}</s>`"
        />

        <pseudo-table
          v-if="item.discountedPrice"
          :label="$t('page-business.discounted-price')"
          :value="item.discountedPrice | currency_format"
        />

        <p class="pseudo-table" v-if="item.automatonAmount && item.instimeAmount">
          <span v-html="$t('page-business.amount')"></span>
          <span>{{ item.automatonAmount + item.instimeAmount | currency_format }}</span>
        </p>

        <hr v-if="item.paymentType || item.paymentCardNumber || item.paymentCardType || item.paymentCardDate">

        <p class="pseudo-table" v-if="item.paymentType">
          <span v-html="$t('page-business.payment-type')"></span>
          <span>{{ getPaymentType(item.paymentType) }}</span>
        </p>

        <p class="pseudo-table"  v-if="item.paymentCardNumber">
          <span v-html="$t('page-business.payment-card-number')"></span>
          <span>{{ item.paymentCardNumber }}</span>
        </p>

        <p class="pseudo-table"  v-if="item.paymentCardType">
          <span v-html="$t('page-business.payment-card-type')"></span>
          <span>{{ item.paymentCardType }}</span>
        </p>

        <p class="pseudo-table"  v-if="item.paymentCardDate">
          <span v-html="$t('page-business.payment-card-date')"></span>
          <span>{{ item.paymentCardDate }}</span>
        </p>

        <hr>

        <p class="pseudo-table" v-if="item.automatonPurchasedAt">
          <span v-html="$t('page-business.purchased-at')"></span>
          <span>{{ item.automatonPurchasedAt.seconds | date_time_format }}</span>
        </p>

        <p class="pseudo-table" v-if="item.instimePurchasedAt">
          <span v-html="$t('page-business.instime-purchased-at')"></span>
          <span>{{ item.instimePurchasedAt.seconds | date_time_format }}</span>
        </p>

        <p class="pseudo-table" v-if="item.automatonExpiredAt">
          <span v-html="$t('page-business.expired-at')"></span>
          <span>{{ item.automatonExpiredAt.seconds | date_time_format }}</span>
        </p>

        <p class="pseudo-table" v-if="item.instimeExpiredAt">
          <span v-html="$t('page-business.instime-expired-at')"></span>
          <span>{{ item.instimeExpiredAt.seconds | date_time_format }}</span>
        </p>
      </b-collapse>
    </div>

    <div class="business-place__buying" v-else>
      <div class="business-place__buying-inner">
        <p class="business-place__buying-text">Бизнес-пакет в процессе покупки...</p>
      </div>
      <p class="business-place__buying-details" :class="{ 'is-buying': isBuyCancelling }">
        <a href="#" @click.prevent="buy">Продолжить покупку</a>
      </p>
      <p class="business-place__buying-cancel">
        <b-button
          :loading="isBuyCancelling"
          type="is-danger"
          @click="openConfirmationToBuyCancelling"
        >
          Отменить покупку
        </b-button>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import {
  required, minLength, maxLength, email,
} from 'vuelidate/lib/validators';
import nickname from '@/utils/validators/nickname';
import phone from '@/utils/validators/phone';
import alreadyInUse from '@/utils/validators/already-in-use';
import invalidRequest from '@/utils/validators/invalid-request';
import unknownError from '@/utils/validators/unknown-error';
import requiredFromServer from '@/utils/validators/required-from-server';
import invalidFromServer from '@/utils/validators/invalid-from-server';
import minLengthFromServer from '@/utils/validators/min-length-from-server';
import maxLengthFromServer from '@/utils/validators/max-length-from-server';
import currencyFormat from '@/utils/filters/currency-format';


const INSTAGRAM_MIN_LENGTH = 1;
const INSTAGRAM_MAX_LENGTH = 30;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 128;
const PHONE_MIN_LENGTH = 6;
const PHONE_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 32;

export default {
  name: 'BusinessPageBusinessPlace',

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
    PseudoTableEditable: () => import('@/views/blocks/pseudo-table-editable.vue'),
  },

  data() {
    return {
      instagram: '',
      email: '',
      phone: '',
      password: '',
      currentField: null,
      currentBusinessPlaceId: null,
    };
  },

  validations: {
    instagram: {
      required,
      nickname,
      minLength: minLength(INSTAGRAM_MIN_LENGTH),
      maxLength: maxLength(INSTAGRAM_MAX_LENGTH),
      unknownError: unknownError(['business-place', 'businessPlaceFieldSavingErrors']),
      invalidRequest: invalidRequest(['business-place', 'businessPlaceFieldSavingErrors']),
      instagramAlreadyInUse: alreadyInUse('instagram', ['business-place', 'businessPlaceFieldSavingErrors']),
      requiredFromServer: requiredFromServer('instagram', ['business-place', 'businessPlaceFieldSavingErrors']),
      invalidFromServer: invalidFromServer('instagram', ['business-place', 'businessPlaceFieldSavingErrors']),
      minLengthFromServer: minLengthFromServer('instagram', ['business-place', 'businessPlaceFieldSavingErrors'], INSTAGRAM_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('instagram', ['business-place', 'businessPlaceFieldSavingErrors'], INSTAGRAM_MAX_LENGTH),
    },
    email: {
      required,
      email,
      minLength: minLength(EMAIL_MIN_LENGTH),
      maxLength: maxLength(EMAIL_MAX_LENGTH),
      unknownError: unknownError(['business-place', 'businessPlaceFieldSavingErrors']),
      invalidRequest: invalidRequest(['business-place', 'businessPlaceFieldSavingErrors']),
      emailAlreadyInUse: alreadyInUse('email', ['business-place', 'businessPlaceFieldSavingErrors']),
      requiredFromServer: requiredFromServer('email', ['business-place', 'businessPlaceFieldSavingErrors']),
      invalidFromServer: invalidFromServer('email', ['business-place', 'businessPlaceFieldSavingErrors']),
      minLengthFromServer: minLengthFromServer('email', ['business-place', 'businessPlaceFieldSavingErrors'], EMAIL_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('email', ['business-place', 'businessPlaceFieldSavingErrors'], EMAIL_MAX_LENGTH),
    },
    phone: {
      required,
      phone,
      minLength: minLength(PHONE_MIN_LENGTH),
      maxLength: maxLength(PHONE_MAX_LENGTH),
      unknownError: unknownError(['business-place', 'businessPlaceFieldSavingErrors']),
      invalidRequest: invalidRequest(['business-place', 'businessPlaceFieldSavingErrors']),
      phoneAlreadyInUse: alreadyInUse('phone', ['business-place', 'businessPlaceFieldSavingErrors']),
      requiredFromServer: requiredFromServer('phone', ['business-place', 'businessPlaceFieldSavingErrors']),
      invalidFromServer: invalidFromServer('phone', ['business-place', 'businessPlaceFieldSavingErrors']),
      minLengthFromServer: minLengthFromServer('phone', ['business-place', 'businessPlaceFieldSavingErrors'], PHONE_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('phone', ['business-place', 'businessPlaceFieldSavingErrors'], PHONE_MAX_LENGTH),
    },
    password: {
      required,
      minLength: minLength(PASSWORD_MIN_LENGTH),
      maxLength: maxLength(PASSWORD_MAX_LENGTH),
      unknownError: unknownError(['business-place', 'businessPlaceFieldSavingErrors']),
      invalidRequest: invalidRequest(['business-place', 'businessPlaceFieldSavingErrors']),
      requiredFromServer: requiredFromServer('password', ['business-place', 'businessPlaceFieldSavingErrors']),
      minLengthFromServer: minLengthFromServer('password', ['business-place', 'businessPlaceFieldSavingErrors'], PASSWORD_MIN_LENGTH),
      maxLengthFromServer: maxLengthFromServer('password', ['business-place', 'businessPlaceFieldSavingErrors'], PASSWORD_MAX_LENGTH),
    },
  },

  // validations() {
  //   const validators = {};

  //   if (this.currentField) {
  //     validators[this.currentField] = this.$options.validationSettings[this.currentField];
  //   }

  //   return {
  //     form: validators,
  //   };
  // },

  computed: {
    ...mapState('business-place', [
      'isBusinessPlaceFieldSaving',
      'businessPlaceFieldSavingErrors',
      'isBuyCancelling',
    ]),

    instagramErrorMessages() {
      const errors = [];

      if (!this.$v.instagram.$dirty) return errors;
      if (!this.$v.instagram.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.instagram.nickname) errors.push(this.$t('block-errors.field-must-be-instagram'));
      if (!this.$v.instagram.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.instagram.$params.minLength.min,
        }));
      }
      if (!this.$v.instagram.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.instagram.$params.maxLength.max,
        }));
      }
      if (!this.$v.instagram.unknownError) errors.push(this.$t('block-errors.unknown-error'));
      if (!this.$v.instagram.invalidRequest) errors.push(this.$t('block-errors.invalid-request'));
      if (!this.$v.instagram.instagramAlreadyInUse) errors.push(this.$t('block-errors.business-place-instagram-already-in-use'));
      if (!this.$v.instagram.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.instagram.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-instagram'));
      if (!this.$v.instagram.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.instagram.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.instagram.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.instagram.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    emailErrorMessages() {
      const errors = [];

      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.email.email) errors.push(this.$t('block-errors.field-must-be-email'));
      if (!this.$v.email.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.email.$params.minLength.min,
        }));
      }
      if (!this.$v.email.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.email.$params.maxLength.max,
        }));
      }
      if (!this.$v.email.unknownError) errors.push(this.$t('block-errors.unknown-error'));
      if (!this.$v.email.invalidRequest) errors.push(this.$t('block-errors.invalid-request'));
      if (!this.$v.email.emailAlreadyInUse) errors.push(this.$t('block-errors.business-place-email-already-in-use'));
      if (!this.$v.email.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.email.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-email'));
      if (!this.$v.email.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.email.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.email.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.email.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    phoneErrorMessages() {
      const errors = [];

      if (!this.$v.phone.$dirty) return errors;
      if (!this.$v.phone.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.phone.phone) errors.push(this.$t('block-errors.field-must-be-phone'));
      if (!this.$v.phone.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.phone.$params.minLength.min,
        }));
      }
      if (!this.$v.phone.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.phone.$params.maxLength.max,
        }));
      }
      if (!this.$v.phone.unknownError) errors.push(this.$t('block-errors.unknown-error'));
      if (!this.$v.phone.invalidRequest) errors.push(this.$t('block-errors.invalid-request'));
      if (!this.$v.phone.phoneAlreadyInUse) errors.push(this.$t('block-errors.business-place-phone-already-in-use'));
      if (!this.$v.phone.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.phone.invalidFromServer) errors.push(this.$t('block-errors.field-must-be-phone'));
      if (!this.$v.phone.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.phone.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.phone.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.phone.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },

    passwordErrorMessages() {
      const errors = [];

      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.password.minLength) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.password.$params.minLength.min,
        }));
      }
      if (!this.$v.password.maxLength) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.password.$params.maxLength.max,
        }));
      }
      if (!this.$v.password.unknownError) errors.push(this.$t('block-errors.unknown-error'));
      if (!this.$v.password.invalidRequest) errors.push(this.$t('block-errors.invalid-request'));
      if (!this.$v.password.requiredFromServer) errors.push(this.$t('block-errors.field-is-required'));
      if (!this.$v.password.minLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-min-length', {
          length: this.$v.password.$params.minLengthFromServer.min,
        }));
      }
      if (!this.$v.password.maxLengthFromServer) {
        errors.push(this.$t('block-errors.field-must-be-max-length', {
          length: this.$v.password.$params.maxLengthFromServer.max,
        }));
      }

      return errors;
    },
  },

  methods: {
    ...mapActions('business-place', {
      saveBusinessPlaceField: 'SAVE_BUSINESS_PLACE_FIELD',
      cancelBuying: 'CANCEL_BUYING',
    }),

    ...mapMutations('business-place', {
      clearAllErrors: 'CLEAR_ALL_BUSINESS_PLACE_FIELD_SAVING_ERRORS',
    }),

    setCurrentField(field, id, value) {
      if (!this.isBusinessPlaceFieldSaving) {
        this.currentField = field;
        this.currentBusinessPlaceId = id;
        this[field] = value;

        this.$nextTick(() => {
          this.$refs[field][0].focus();
        });
      }
    },

    unsetCurrentField(field) {
      this.currentField = null;
      this.currentBusinessPlaceId = null;
      this[field] = '';
    },

    isEditable(field, id) {
      return this.currentField === field && this.currentBusinessPlaceId === id;
    },

    saveField(field, value) {
      this[field] = value;
      this.$v[field].$touch();

      if (this.$v[field].$invalid) return Promise.reject();

      return this.saveBusinessPlaceField({
        id: this.item.id,
        field,
        value,
      });
    },

    cancelFieldEditing(field) {
      this.clearAllErrors();
      this.$v[field].$reset();
    },

    resetValidator() {
      this.$v.$reset();
    },

    getPaymentType(type) {
      switch (type) {
        case 'BY_CARD':
          return this.$t('page-business.payment-type-by-card');

        case 'BY_CRYPTO':
          return this.$t('page-business.payment-type-by-crypto');

        case 'BY_TRANSFER':
          return this.$t('page-business.payment-type-by-transfer');

        case 'BY_CASH':
          return this.$t('page-business.payment-type-by-cash');

        case 'BY_INNER':
          return this.$t('page-business.payment-type-by-inner');

        case 'BY_GIFT':
          return this.$t('page-business.payment-type-by-gift');

        case 'BY_BARTER':
          return this.$t('page-business.payment-type-by-barter');

        default:
          return this.$t('page-business.unknown');
      }
    },

    currencyFormat(value) {
      return currencyFormat(value);
    },

    buy() {
      if (!this.isBuyCancelling) {
        this.$emit('buy');
      }
    },

    openConfirmationToBuyCancelling() {
      if (!this.isBuyCancelling) {
        this.$buefy.dialog.confirm({
          title: 'Отказ от покупки бизнес-места',
          message: 'Вы уверены, что хотите отказаться от покупки?',
          confirmText: 'Да, отказаться',
          cancelText: 'Нет, передумал',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.cancelBuying(this.item.id),
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables.sass';

.business-place {
  display: flex;
  flex-direction: column;
  margin: 1em 2%;
  border-radius: 10px;
  overflow: hidden;
  flex: 0 0 46%;
  background-color: #fff;
  border: .1rem solid #f5f5f5;
  box-shadow: 0 8px 12px 0 rgba(122, 122, 122, .2);

  @media (max-width: $tablet) {
    margin: 1rem 0;
  }

  &__title {
    display: flex;
    text-align: center;
    justify-content: space-between;
    font-size: 1.1em;
    line-height: 1.125;
    margin: 0 0 2rem;

    @media (max-width: $desktop) {
      display: block;
    }
  }

  &__title-item {
    flex: 0 0 50%;
    background-color: #525252;
    color: #fff;

    @media (max-width: $desktop) {
      display: block;
    }

    &.is-purchased {
      background-color: #2f4554;
    }

    &:first-child {
      background-color: #a0a0a0;

      &.is-purchased {
        background-color: #609fa7;
      }
    }
  }

  &__caption {
    display: block;
    padding: 3rem 1rem 0;

    @media (max-width: $desktop) {
      padding: 1.5rem 1rem 0;
    }
  }

  &__balance {
    display: block;
    padding: 1rem 1rem 3rem;
    font-size: 1.5em;
    font-weight: 600;

    @media (max-width: $desktop) {
      padding: 1rem 1rem 1.5rem;
    }
  }

  &__content {
    background-color: #fff;

    @media (max-width: $tablet) {
      margin: 0 1rem;
    }
  }

  &__collapser {
    margin: 2rem 0;
    display: block;
    padding: 0 2rem;
    text-align: right;

    @media (max-width: $tablet) {
      margin: 1rem 0 2rem;
      padding: 0;
    }

    span {
      border-bottom: 1px dashed;
    }
  }

  &__buying {
    display: flex;
    flex-direction: column;
    padding: 0 1rem 2rem;
    height: 100%;

    &-inner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    &-text {
      font-size: 1.15rem;
      text-align: center;
    }

    &-details {
      margin: 2rem 0 0;
      text-align: right;

      a {
        border-bottom: 1px dashed;
      }

      &.is-buying {
        a {
          color: #515151;
          cursor: not-allowed;
        }
      }
    }

    &-cancel {
      margin: 1rem 0 0;
      text-align: right;
    }
  }

  .collapse .collapse-content {
    background-color: #fff;
  }
}
</style>
