import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";
import store from "@/store";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  routes,
  mode: "history",
  base: process.env.BASE_URL
});

const IS_STRICT_ACCESS = true;

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!firebase.auth().currentUser;
  const isForbiddenArea = to.matched.some(
    record => record.meta.isForbiddenArea
  );
  const isAdmin = store.state.user && store.state.user.isAdmin;

  const isHomeRoute = to.name.includes("home");

  const isAnonAttemptsAccessToForbiddenArea =
    !isAuthenticated && isForbiddenArea;
  const isAdminAttemptsAccessToHome = isAuthenticated && isAdmin && isHomeRoute;

  if (IS_STRICT_ACCESS) {
    if (isAnonAttemptsAccessToForbiddenArea) {
      next({ name: "home" });
    } else if (isAdminAttemptsAccessToHome) {
      next({ name: "admin" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
