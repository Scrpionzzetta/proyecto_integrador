<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';

const authStore = useAuthStore();

// Al iniciar la app recuperamos el usuario si hay uid en localStorage
onMounted(async () => {
  await authStore.cargarUsuario();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}
</style>