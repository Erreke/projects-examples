import uuidv4 from "uuid/v4";
import db from "@/firebase/init";

function fetchStream() {
  return db
    .collection("streams")
    .doc(window.AUTOMATON_WEBINAR_STREAM_ID)
    .get()
    .then(stream => {
      if (stream.exists) {
        return {
          id: stream.id,
          ...stream.data()
        };
      }

      return null;
    });
}

function fetchMembers() {
  return db
    .collection("members")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID)
    .get()
    .then(response => {
      if (response.exists) {
        return response.data();
      }

      return null;
    });
}

function fetchComments() {
  return db
    .collection("comments")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID)
    .get()
    .then(response => {
      if (response.exists) {
        return response.data();
      }

      return null;
    });
}

function sendComment(comment) {
  const commentDocRef = db
    .collection("comments")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID);

  return db.runTransaction(transaction => {
    return transaction.get(commentDocRef).then(commentsDoc => {
      let comments = {
        list: {}
      };

      if (commentsDoc.exists) {
        comments = commentsDoc.data();
      }

      comments.list[uuidv4()] = comment;

      console.log("comments:", comments);

      return transaction.set(commentDocRef, comments);
    });
  });
}

function subscribeToMembersChanges(callback) {
  return db
    .collection("members")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID)
    .onSnapshot(
      doc => {
        callback(doc.data());
      },
      error => {
        throw new Error(error);
      }
    );
}

function subscribeToCommentsChanges(callback) {
  return db
    .collection("comments")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID)
    .onSnapshot(
      doc => {
        callback(doc.data());
      },
      error => {
        throw new Error(error);
      }
    );
}

function createUserProfile(userProfile) {
  return db
    .collection("users")
    .doc(userProfile.uid)
    .set(userProfile, { merge: true })
    .then(() => userProfile);
}

function createUserProfileWhenAuthBySMS(user) {
  return createUserProfile({
    uid: user.uid,
    fullname: user.fullname,
    phone: user.phone,
    isAdmin: false,
    warning: null
  });
}

function createUserProfileWhenAuthByEmail(user) {
  return createUserProfile({
    uid: user.uid,
    fullname: user.fullname,
    email: user.email,
    isAdmin: false,
    warning: null
  });
}

function fetchUserData(uid) {
  return db
    .collection("users")
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      }
      return {};
    });
}

function registerUserAsMember(user) {
  const memberDocRef = db
    .collection("members")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID);

  return db.runTransaction(transaction => {
    return transaction.get(memberDocRef).then(membersDoc => {
      let members = {
        list: {}
      };

      if (membersDoc.exists) {
        members = membersDoc.data();
      }

      members.list[user.uid] = {
        title: user.fullname,
        avatar:
          "https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtScoopNeck&eyeType=Squint&eyebrowType=SadConcernedNatural&facialHairColor=Brown&facialHairType=Blank&graphicType=Hola&hairColor=SilverGray&hatColor=PastelGreen&mouthType=Serious&skinColor=Pale&topType=ShortHairDreads01" // TODO: user.avatar
      };

      return transaction.set(memberDocRef, members);
    });
  });
}

function unRegisterUserAsMember(uid) {
  const memberDocRef = db
    .collection("members")
    .doc(window.AUTOMATON_WEBINAR_STREAM_DAILY_ID);

  return db.runTransaction(transaction => {
    return transaction.get(memberDocRef).then(membersDoc => {
      let members = {
        list: {}
      };

      if (membersDoc.exists) {
        members = membersDoc.data();
      }

      delete members.list[uid];

      return transaction.set(memberDocRef, members);
    });
  });
}

export default {
  fetchStream,
  fetchMembers,
  fetchComments,
  sendComment,
  subscribeToMembersChanges,
  subscribeToCommentsChanges,
  createUserProfileWhenAuthBySMS,
  createUserProfileWhenAuthByEmail,
  fetchUserData,
  registerUserAsMember,
  unRegisterUserAsMember
};
