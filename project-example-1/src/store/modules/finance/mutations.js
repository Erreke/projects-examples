export default {
  SET_FINANCES(state, payload) {
    if (payload.items && payload.items.length > 0) {
      state.items = payload.items
        .map((item) => {
          if (item.cardNumber) {
            return {
              ...item,
              cardNumber: item.cardNumber.replace(/(\d{4} ){3}/, '**** **** **** '),
            };
          }

          return item;
        });
    }
  },

  SET_FINANCES_LOADING(state, payload) {
    state.isLoading = payload;
  },

  SET_WITHDRAWAL_REQUEST_ADDING_PROCESS(state, payload) {
    state.isWithdrawalRequestAddingProcess = payload;
  },

  SET_TRANSFER_REQUEST_ADDING_PROCESS(state, payload) {
    state.isTransferRequestAddingProcess = payload;
  },

  SET_BENEFICIAR_BY_EMAIL_GETTING_PROCESS(state, payload) {
    state.isBeneficiarByEmailGettingProcess = payload;
  },

  CLEAR_BENEFICIAR_GETTING_ERROR(state) {
    state.beneficiarGettingError = null;
  },

  SET_BENEFICIAR_GETTING_ERROR(state, payload) {
    state.beneficiarGettingError = payload;
  },

  CLEAR_BENEFICIAR_DATA(state) {
    state.beneficiarData = {
      id: null,
      email: null,
      phone: null,
      firstName: null,
      secondName: null,
    };
  },

  SET_BENEFICIAR_DATA(state, payload) {
    state.beneficiarData = {
      id: payload.id,
      email: payload.email,
      phone: payload.phone,
      firstName: payload.firstName,
      secondName: payload.secondName,
    };
  },
};
