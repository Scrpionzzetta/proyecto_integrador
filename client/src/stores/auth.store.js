import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null,
    uid: localStorage.getItem('uid') || null,
    rol: localStorage.getItem('rol') || null
  }),

  getters: {
    esAdmin: (state) => state.rol === 'admin',
    esDueno: (state) => state.rol === 'dueño',
    estaAutenticado: (state) => !!state.uid
  },

  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', { email, password });
      const { usuario } = response.data;

      // Persistimos uid Y rol en localStorage para que el router guard
      // pueda leerlos de forma sincrónica en cada navegación
      localStorage.setItem('uid', usuario.uid);
      localStorage.setItem('rol', usuario.rol);

      this.uid = usuario.uid;
      this.rol = usuario.rol;
      this.usuario = usuario;
    },

    // Se llama en App.vue al montar, para restaurar la sesión tras un refresh
    async cargarUsuario() {
      const uid = localStorage.getItem('uid');
      if (!uid) return;

      try {
        const response = await api.get(`/usuarios/${uid}`);
        this.usuario = response.data;
        this.uid = uid;
        this.rol = response.data.rol;

        // Sincronizamos por si cambió el rol en el backend
        localStorage.setItem('rol', response.data.rol);
      } catch (err) {
        // Si el backend rechaza (cuenta desactivada, token inválido) cerramos sesión
        console.error('Error cargando usuario:', err);
        this.logout();
      }
    },

    logout() {
      localStorage.removeItem('uid');
      localStorage.removeItem('rol');
      this.uid = null;
      this.rol = null;
      this.usuario = null;
    }
  }
});