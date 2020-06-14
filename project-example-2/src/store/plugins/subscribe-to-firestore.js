/* eslint-disable max-len */
import profileAPI from "@/api/profile";

let unsubFromUserChanges;

export default function subscribeToFirestore(store) {
  function updateUserProfile(payload) {
    store.commit("user/UPDATE_USER", payload);
  }

  store.subscribe(mutation => {
    if (mutation.type === "user/SET_USER") {
      if (!unsubFromUserChanges) {
        unsubFromUserChanges = profileAPI.subscribeToUserProfileChanges(
          mutation.payload.uid,
          updateUserProfile
        );
      }
    }

    if (mutation.type === "user/RESET_STATE") {
      if (unsubFromUserChanges && typeof unsubFromUserChanges === "function") {
        unsubFromUserChanges();
      }
    }
  });
}
