import db from "@/utils/firebase/init";

function fetchLessons(cid) {
  return db
    .collection("lessons")
    .where("cid", "==", cid)
    .orderBy("number", "asc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) return null;

      const result = {
        cid,
        lessons: {}
      };

      snapshot.forEach(doc => {
        result.lessons[doc.id] = {
          id: doc.id,
          ...doc.data()
        };
      });

      return result;
    });
}

export default {
  fetchLessons
};
