import protoMutations from '@/store/modules/auth/proto-mutations';

export default {
  ...protoMutations(),

  SET_POPUP_OPENED_STATUS(state, payload) {
    state.isPopupOpened = payload;
  },

  SET_CODE_SENDING_RESULT(state, payload) {
    state.isCodeSended = payload;
  },
};
