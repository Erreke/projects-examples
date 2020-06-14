/* eslint-disable max-len */
import coursesAPI from "@/api/courses";

let unsubFromCoursesChanges;

export default function subscribeToFirestore(store) {
  function updateCourses(payload) {
    store.commit("courses/SET_ALL_COURSES", payload);
  }

  store.subscribe(mutation => {
    if (mutation.type === "courses/SET_ALL_COURSES") {
      if (!unsubFromCoursesChanges) {
        unsubFromCoursesChanges = coursesAPI.subscribeToCoursesChanges(
          updateCourses
        );
      }
    }

    if (mutation.type === "user/RESET_STATE") {
      if (
        unsubFromCoursesChanges &&
        typeof unsubFromCoursesChanges === "function"
      ) {
        unsubFromCoursesChanges();
      }
    }
  });
}
