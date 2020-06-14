import protoMutations from '@/store/modules/auth/proto-mutations';

export default {
  ...protoMutations(),

  SET_BONUS_HOLDER_VALIDATING(state, payload) {
    state.isBonusHolderValidating = payload;
  },

  SET_BONUS_HOLDER_VALIDATING_RESULT(state, payload) {
    state.bonusHolderValidatingResult = payload;
  },

  SET_BONUS_HOLDER_VALIDATING_ERRORS(state, payload) {
    state.bonusHolderValidatingErrors = payload;
  },
};
