import clearError from "@/store/helpers/clear-error";

export default function protoMutations() {
  return {
    SET_PROCESSING(state, payload) {
      state.isProcessing = payload;
    },

    SET_ERRORS(state, payload) {
      state.errors = payload;
    },

    PUSH_ERROR(state, payload) {
      state.errors.push(payload);
    },

    MERGE_ERRORS(state, payload) {
      state.errors = [...state.errors, ...payload];
    },

    CLEAR_ERROR(state, key) {
      console.log("CLEAR_ERROR key:", key);

      if (state.errors.length) {
        state.errors = clearError(state.errors, key);
      }
    },

    CLEAR_ALL_ERRORS(state) {
      state.errors = [];
    },

    SET_RESULT(state, payload) {
      state.isSuccess = payload;
    }
  };
}
