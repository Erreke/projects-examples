import authAPI from "@/api/auth";

export default {
  SIGN_OUT: ({ dispatch }) =>
    authAPI.signOut().then(() => dispatch("RESET_STATE", null, { root: true }))
};
