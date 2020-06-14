import state from "./state";
import actions from "./actions";
import mutations from "./mutations";
import signInModule from "./modules/sign-in";
import signUpModule from "./modules/sign-up";
import signUpToWebinarModule from "./modules/sign-up-to-webinar";
import recoverPasswordModule from "./modules/recover-password";
import recoverEmailModule from "./modules/recover-email";
import resetPasswordModule from "./modules/reset-password";
import changePasswordModule from "./modules/change-password";
import changeEmailModule from "./modules/change-email";
import changePhoneModule from "./modules/change-phone";
import emailVerificationModule from "./modules/email-verification";

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    "sign-in": signInModule,
    "sign-up": signUpModule,
    "sign-up-to-webinar": signUpToWebinarModule,
    "recover-password": recoverPasswordModule,
    "recover-email": recoverEmailModule,
    "reset-password": resetPasswordModule,
    "change-password": changePasswordModule,
    "change-email": changeEmailModule,
    "change-phone": changePhoneModule,
    "email-verification": emailVerificationModule
  }
};
