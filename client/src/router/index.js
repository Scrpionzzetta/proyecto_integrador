import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';
import DashboardView from '../views/dashboard/DashboardView.vue';
import HuertosView from '../views/huertos/HuertosView.vue';
import TrabajadoresView from '../views/trabajadores/TrabajadoresView.vue';
import PagosView from '../views/pagos/PagosView.vue';
import TemporadasView from '../views/temporadas/TemporadasView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/huertos',
    name: 'huertos',
    component: HuertosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/trabajadores',
    name: 'trabajadores',
    component: TrabajadoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagos',
    name: 'pagos',
    component: PagosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/temporadas',
    name: 'temporadas',
    component: TemporadasView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard → redirige al login si no esta autenticado
router.beforeEach((to, from, next) => {
  const uid = localStorage.getItem('uid');
  if (to.meta.requiresAuth && !uid) {
    next('/login');
  } else if (to.path === '/login' && uid) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;