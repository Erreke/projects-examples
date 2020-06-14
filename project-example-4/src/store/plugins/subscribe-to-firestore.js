import dbAPI from "@/api/db";

let unsubFromMembers;
let unsubFromComments;

export default function subscribeToFirestore(store) {
  function updateMembers(payload) {
    store.commit("SET_MEMBERS", payload);
  }

  function updateComments(payload) {
    store.commit("SET_COMMENTS", payload);
  }

  store.subscribe(mutation => {
    if (mutation.type === "SET_MEMBERS") {
      if (!unsubFromMembers) {
        unsubFromMembers = dbAPI.subscribeToMembersChanges(updateMembers);
      }
    }

    if (mutation.type === "SET_COMMENTS") {
      if (!unsubFromComments) {
        unsubFromComments = dbAPI.subscribeToCommentsChanges(updateComments);
      }
    }

    if (mutation.type === "UNSUBSCRIBE_FROM_FIRESTORE") {
      if (unsubFromMembers && typeof unsubFromMembers === "function") {
        unsubFromMembers();
      }

      if (unsubFromComments && typeof unsubFromComments === "function") {
        unsubFromComments();
      }
    }
  });
}
