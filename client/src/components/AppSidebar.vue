<template>
  <aside class="sidebar">

    <!-- Encabezado con logo y nombre -->
    <div class="sb-header">
      <div class="sb-brand">
        <div class="sb-logo">
          <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
            <ellipse cx="10" cy="7" rx="3.5" ry="4.5" fill="#b8e0b8"/>
            <ellipse cx="5.5" cy="13" rx="3" ry="4" fill="#85c885"/>
            <ellipse cx="14.5" cy="13" rx="3" ry="4" fill="#85c885"/>
            <circle cx="10" cy="15" r="2.5" fill="rgba(255,255,255,.35)"/>
          </svg>
        </div>
        <div>
          <div class="sb-name">Digital en el Campo</div>
          <div class="sb-sub">CFT Maule · Parral</div>
        </div>
      </div>
    </div>

    <!-- Navegacion segun rol -->
    <div v-if="authStore.esAdmin">
      <div class="sb-section">Principal</div>
      <div class="sb-nav">
        <router-link to="/dashboard" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M2 7l6-5 6 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1V7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><rect x="6" y="9" width="4" height="5" rx=".5" stroke="currentColor" stroke-width="1.4"/></svg>
          Inicio
        </router-link>
      </div>

      <div class="sb-section">Gestion</div>
      <div class="sb-nav">
        <router-link to="/usuarios" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="5" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M11 9c1.7.3 3 1.9 3 3.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Productores
        </router-link>
        <router-link to="/reportes" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M2 12l3-4 3 2 3-5 3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><line x1="2" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Reportes globales
        </router-link>
      </div>
    </div>

    <div v-else-if="authStore.esDueno">
      <div class="sb-section">Principal</div>
      <div class="sb-nav">
        <router-link to="/dashboard" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M2 7l6-5 6 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1V7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><rect x="6" y="9" width="4" height="5" rx=".5" stroke="currentColor" stroke-width="1.4"/></svg>
          Inicio
        </router-link>
      </div>

      <div class="sb-section">Produccion</div>
      <div class="sb-nav">
        <router-link to="/huertos" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><rect x="2" y="8" width="12" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 8V5a3 3 0 016 0v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Huertos
        </router-link>
        <router-link to="/temporadas" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Temporadas
        </router-link>
        <router-link to="/trabajadores" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Cosecheros
        </router-link>
        <router-link to="/recolecciones" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M3 13C3 8 7 3 13 3c0 6-4 10-10 10z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M3 13l4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Cosechas diarias
        </router-link>
      </div>

      <div class="sb-section">Comercial</div>
      <div class="sb-nav">
        <router-link to="/ventas" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M1 2h2l2 8h7l2-6H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="13" r="1" fill="currentColor"/><circle cx="12" cy="13" r="1" fill="currentColor"/></svg>
          Ventas
        </router-link>
        <router-link to="/compradores" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 3V2M11 3V2M2 7h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Compradores
        </router-link>
        <router-link to="/pagos" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1 7h14" stroke="currentColor" stroke-width="1.4"/><circle cx="5" cy="11" r="1" fill="currentColor"/></svg>
          Pagos
        </router-link>
      </div>

      <div class="sb-section">Analisis</div>
      <div class="sb-nav">
        <router-link to="/reporte-temporada" @click="menuAbierto = false">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M2 12l3-4 3 2 3-5 3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><line x1="2" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Reporte de temporada
        </router-link>
      </div>
    </div>

    <!-- Footer con usuario y logout -->
    <div class="sb-footer">
      <div class="sb-user">
        <div
          class="sb-avatar"
          :class="{ admin: authStore.esAdmin }"
        >
          {{ iniciales }}
        </div>
        <div>
          <div class="sb-uname">{{ authStore.usuario?.nombre }}</div>
          <div class="sb-urole">{{ authStore.usuario?.rol }}</div>
        </div>
      </div>

      <button class="sb-logout full-w" @click="handleLogout">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
            stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Cerrar sesion
      </button>
    </div>

  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const menuAbierto = ref(false);

// Iniciales del usuario para el avatar
const iniciales = computed(() => {
  const nombre = authStore.usuario?.nombre || '';
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>