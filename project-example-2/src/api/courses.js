import db from "@/utils/firebase/init";

function handleCourses(snapshot) {
  const result = {};

  snapshot.forEach(doc => {
    result[doc.id] = {
      id: doc.id,
      ...doc.data()
    };
  });

  return result;
}

function fetchAllCourses() {
  return db
    .collection("courses")
    .get()
    .then(snapshot => handleCourses(snapshot));
}

function subscribeToCoursesChanges(callback) {
  return db.collection("courses").onSnapshot(snapshot => {
    callback(handleCourses(snapshot));
  });
}

function fetchCourse(id) {
  return db
    .collection("courses")
    .doc(id)
    .get()
    .then(doc => {
      if (doc.exists) {
        return {
          id,
          ...doc.data()
        };
      }

      return null;
    });
}

function fetchMetaInfo() {
  return db
    .collection("dictionary")
    .get()
    .then(snapshot => handleCourses(snapshot));
}

export default {
  fetchAllCourses,
  subscribeToCoursesChanges,
  fetchCourse,
  fetchMetaInfo
};
