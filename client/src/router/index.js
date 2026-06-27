import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';
import DashboardView from '../views/dashboard/DashboardView.vue';
import HuertosView from '../views/huertos/HuertosView.vue';
import TrabajadoresView from '../views/trabajadores/TrabajadoresView.vue';
import PagosView from '../views/pagos/PagosView.vue';
import TemporadasView from '../views/temporadas/TemporadasView.vue';
import UsuariosView from '../views/usuarios/UsuariosView.vue';
import VentasView from '../views/ventas/VentasView.vue';
import CompradoresView from '../views/compradores/CompradoresView.vue';
import ReportesView from '../views/reportes/ReportesView.vue';
import ReporteTemporadaView from '../views/reportes/ReporteTemporadaView.vue';
import RecoleccionesView from '../views/recolecciones/RecoleccionesView.vue';

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
    meta: { requiresAuth: true, roles: ['admin', 'dueño'] }
  },
  {
    path: '/huertos',
    name: 'huertos',
    component: HuertosView,
    meta: { requiresAuth: true, roles: ['admin', 'dueño'] }
  },
  {
    path: '/temporadas',
    name: 'temporadas',
    component: TemporadasView,
    meta: { requiresAuth: true, roles: ['admin', 'dueño'] }
  },
  {
    path: '/recolecciones',
    name: 'recolecciones',
    component: RecoleccionesView,
    meta: { requiresAuth: true, roles: ['admin', 'dueño'] }
  },

  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: ReportesView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/trabajadores',
    name: 'trabajadores',
    component: TrabajadoresView,
    meta: { requiresAuth: true, roles: ['dueño'] }
  },
  {
    path: '/pagos',
    name: 'pagos',
    component: PagosView,
    meta: { requiresAuth: true, roles: ['dueño'] }
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: VentasView,
    meta: { requiresAuth: true, roles: ['dueño'] }
  },
  {
    path: '/compradores',
    name: 'compradores',
    component: CompradoresView,
    meta: { requiresAuth: true, roles: ['dueño'] }
  },
  {
    path: '/reporte-temporada',
    name: 'reporte-temporada',
    component: ReporteTemporadaView,
    meta: { requiresAuth: true, roles: ['dueño'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const uid = localStorage.getItem('uid');
  const rol = localStorage.getItem('rol');

  if (!to.meta.requiresAuth) {
    if (uid && to.path === '/login') {
      return next('/dashboard');
    }
    return next();
  }

  if (!uid) {
    return next('/login');
  }

  if (to.meta.roles && !to.meta.roles.includes(rol)) {
    return next('/dashboard');
  }

  next();
});

export default router;