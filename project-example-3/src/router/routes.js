import Home from "@/views/Home.vue";

export default [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Index.vue"),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true
    }
  },
  {
    path: "/admin/create/",
    name: "admin-create",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Create.vue"),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true
    }
  },
  {
    path: "/admin/edit/:quizId",
    name: "admin-edit",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Edit.vue"),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true
    }
  },
  {
    path: "/:quizId",
    name: "quiz",
    component: () => import(/* webpackChunkName: "quiz" */ "@/views/Quiz.vue")
  }
];
