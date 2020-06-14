import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

let router;

export default function createRouter() {
  if (!router) {
    router = new Router({
      routes,
      mode: "history",
      fallback: false,
      scrollBehavior: () => ({ y: 0 }),
      base: process.env.BASE_URL
    });
  }

  return router;
}
