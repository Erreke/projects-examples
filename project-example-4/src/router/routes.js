import HomePage from "@/views/HomePage.vue";

export default [
  {
    path: "/",
    name: "home",
    component: HomePage
  },
  {
    path: "/streams/:streamId",
    name: "streams",
    component: () =>
      import(/* webpackChunkName: "stream" */ "@/views/StreamPage.vue")
  },
  {
    path: "*",
    name: "not-found",
    component: () => import("@/views/NotFoundPage.vue")
  }
];
