import { createRouter, createWebHashHistory } from 'vue-router';
import Style from '@/views/StyleView.vue';
import HomeView from '@/views/HomeView.vue';
import BookingsView from '@/views/Bookings.vue';
import ActivityView from '@/views/Activity.vue';

const routes = [
  {
    meta: {
      title: 'Select style',
    },
    path: '/style',
    name: 'style',
    component: Style,
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard',
    },
    path: '/dashboard',
    name: 'dashboard',
    component: HomeView,
  },
  {
    meta: {
      title: 'Booking',
    },
    path: '/booking',
    name: 'booking',
    component: BookingsView,
  },
  {
    meta: {
      title: 'Activity',
    },
    path: '/activity',
    name: 'activity',
    component: ActivityView,
  },
  {
    meta: {
      title: 'Tables',
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue'),
  },
  {
    meta: {
      title: 'Forms',
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue'),
  },
  {
    meta: {
      title: 'Profile',
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
  {
    meta: {
      title: 'Ui',
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue'),
  },
  {
    meta: {
      title: 'Responsive layout',
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue'),
  },
  {
    meta: {
      title: 'Login',
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    meta: {
      title: 'Register',
    },
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    meta: {
      title: 'card',
    },
    path: '/card',
    name: 'card',
    component: () => import('@/views/cardView.vue'),
  },
  {
    meta: {
      title: 'logout',
    },
    path: '/logout',
    name: 'logout',
    component: () => import('@/views/Logout.vue'),
  },
  // {
  //   meta: {
  //     title: 'profile',
  //   },
  //   path: '/info',
  //   name: 'info',
  //   component: () => import('@/views/profilePageView.vue'),
  // },
  {
    meta: {
      title: 'Error',
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
