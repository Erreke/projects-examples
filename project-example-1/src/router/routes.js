import Home from '@/views/pages/common/home/index.vue';

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/index.html',
    redirect: {
      name: 'home',
    },
  },
  {
    path: '/dashboard/',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "page-dashboard" */ '@/views/pages/user/dashboard/dashboard.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
    },
  },
  {
    path: '/finances/',
    name: 'finances',
    component: () => import(/* webpackChunkName: "page-finances" */ '@/views/pages/user/finances/finances.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
    },
  },
  {
    path: '/profile/',
    name: 'profile',
    component: () => import(/* webpackChunkName: "page-profile" */ '@/views/pages/user/profile/profile.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
    },
  },
  {
    path: '/tariffs/',
    name: 'tariffs',
    component: () => import(/* webpackChunkName: "page-tariffs" */ '@/views/pages/user/tariffs/tariffs.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
    },
  },
  {
    path: '/partners/',
    name: 'partners',
    component: () => import(/* webpackChunkName: "page-partners" */ '@/views/pages/user/partners/partners.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
      isNewRegisteredArea: true,
    },
  },
  {
    path: '/faq/',
    name: 'faq',
    component: () => import(/* webpackChunkName: "page-faq" */ '@/views/pages/user/faq/faq.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
      isNewRegisteredArea: true,
    },
  },
  {
    path: '/whats-new/',
    name: 'whats-new',
    component: () => import(/* webpackChunkName: "page-whats-new" */ '@/views/pages/user/whats-new/whats-new.vue'),
    meta: {
      isForbiddenArea: true,
      isClientArea: true,
      isNewRegisteredArea: true,
    },
  },
  {
    path: '/admin/analytics/',
    name: 'admin-analytics',
    component: () => import(/* webpackChunkName: "page-admin-analytics" */ '@/views/pages/admin/analytics/analytics.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '/admin/clients/',
    name: 'admin-clients',
    component: () => import(/* webpackChunkName: "page-admin-clients" */ '@/views/pages/admin/clients/clients.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '/admin/coursebot-ads/',
    name: 'admin-coursebot-ads',
    component: () => import(/* webpackChunkName: "page-admin-coursebot-ads" */ '@/views/pages/admin/coursebot-ads/coursebot-ads.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  // {
  //   path: '/admin/business-places/',
  //   name: 'admin-business-places',
  //   component: () => import(/* webpackChunkName: "page-admin-business-places" */ '@/views/pages/admin/business-places/business-places.vue'),
  //   meta: {
  //     isForbiddenArea: true,
  //     isAdminArea: true,
  //   },
  // },
  {
    path: '/admin/profile/',
    name: 'admin-profile',
    component: () => import(/* webpackChunkName: "page-admin-profile" */ '@/views/pages/admin/profile/profile.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  // {
  //   path: '/admin/queue/',
  //   name: 'admin-queue',
  //   component: () => import(/* webpackChunkName: "page-admin-queue" */ '@/views/pages/admin/queue/queue.vue'),
  //   meta: {
  //     isForbiddenArea: true,
  //     isAdminArea: true,
  //   },
  // },
  {
    path: '/admin/marketing-indicators/',
    name: 'admin-marketing-indicators',
    component: () => import(/* webpackChunkName: "page-admin-marketing-indicators" */ '@/views/pages/admin/marketing-indicators/marketing-indicators.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '/admin/redirects/',
    name: 'admin-redirects',
    component: () => import(/* webpackChunkName: "page-admin-redirects" */ '@/views/pages/admin/redirects/redirects.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '/admin/leads/',
    name: 'admin-leads',
    component: () => import(/* webpackChunkName: "page-admin-leads" */ '@/views/pages/admin/leads/leads.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '/admin/finances/',
    name: 'admin-finances',
    component: () => import(/* webpackChunkName: "page-admin-finances" */ '@/views/pages/admin/finances/finances.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '/admin/carousel/',
    name: 'admin-carousel',
    component: () => import(/* webpackChunkName: "page-admin-carousel" */ '@/views/pages/admin/carousel/carousel.vue'),
    meta: {
      isForbiddenArea: true,
      isAdminArea: true,
    },
  },
  {
    path: '*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "page-not-found" */ '@/views/pages/common/not-found.vue'),
  },
];
