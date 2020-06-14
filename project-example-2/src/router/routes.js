import HomeNew from "@/views/pages/common/home/index.vue";

export default [
  {
    path: "/",
    name: "home",
    component: HomeNew
  },
  {
    path: "/index.html",
    redirect: {
      name: "home"
    }
  },
  {
    path: "/courses/",
    name: "courses",
    component: () =>
      import(
        /* webpackChunkName: "page-courses" */ "@/views/pages/user/courses/courses.vue"
      ),
    meta: {
      isForbiddenArea: true,
      isUserArea: true
    }
  },
  {
    path: "/courses/:id/",
    name: "courses-item",
    component: () =>
      import(
        /* webpackChunkName: "page-courses-item" */ "@/views/pages/user/courses/item/item.vue"
      ),
    meta: {
      isForbiddenArea: true,
      isUserArea: true
    }
  },
  {
    path: "/profile/",
    name: "profile",
    component: () =>
      import(
        /* webpackChunkName: "page-profile" */ "@/views/pages/user/profile/profile.vue"
      ),
    meta: {
      isForbiddenArea: true,
      isUserArea: true
    }
  },
  {
    path: "/finances/",
    name: "finances",
    component: () =>
      import(
        /* webpackChunkName: "page-finances" */ "@/views/pages/user/finances/finances.vue"
      ),
    meta: {
      isForbiddenArea: true,
      isUserArea: true
    }
  },
  {
    path: "/admin/",
    name: "admin",
    component: () =>
      import(
        /* webpackChunkName: "page-admin" */ "@/views/pages/admin/admin.vue"
      ),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true
    }
  },
  {
    path: "/admin/profile/",
    name: "admin-profile",
    component: () =>
      import(
        /* webpackChunkName: "page-admin-profile" */ "@/views/pages/admin/profile/profile.vue"
      ),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true
    }
  },
  {
    path: "*",
    name: "not-found",
    component: () =>
      import(
        /* webpackChunkName: "page-not-found" */ "@/views/pages/common/not-found.vue"
      )
  }
];
