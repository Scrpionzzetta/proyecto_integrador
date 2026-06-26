<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="sidebar-header">
        <h2>Digital en el Campo</h2>
        <p>{{ authStore.usuario?.nombre }}</p>
        <span class="rol">{{ authStore.usuario?.rol }}</span>
      </div>
      <button class="btn-menu" @click="menuAbierto = !menuAbierto">
        {{ menuAbierto ? '✕' : '☰' }}
      </button>
    </div>

    <nav :class="{ 'nav-abierto': menuAbierto }">
      <!-- Ambos roles -->
      <router-link to="/dashboard" @click="menuAbierto = false">Dashboard</router-link>
      <router-link to="/huertos" @click="menuAbierto = false">Huertos</router-link>
      <router-link to="/temporadas" @click="menuAbierto = false">Temporadas</router-link>
      <router-link to="/recolecciones" @click="menuAbierto = false">Recolecciones</router-link>

      <!-- Solo admin -->
      <template v-if="authStore.esAdmin">
        <router-link to="/usuarios" @click="menuAbierto = false">Productores</router-link>
        <router-link to="/reportes" @click="menuAbierto = false">Reportes globales</router-link>
      </template>

      <!-- Solo productor (dueño) -->
      <template v-if="authStore.esDueno">
        <router-link to="/trabajadores" @click="menuAbierto = false">Cosecheros</router-link>
        <router-link to="/pagos" @click="menuAbierto = false">Pagos</router-link>
        <router-link to="/ventas" @click="menuAbierto = false">Ventas</router-link>
        <router-link to="/compradores" @click="menuAbierto = false">Compradores</router-link>
        <router-link to="/reporte-temporada" @click="menuAbierto = false">Reporte temporada</router-link>
      </template>
    </nav>

    <button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const menuAbierto = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>