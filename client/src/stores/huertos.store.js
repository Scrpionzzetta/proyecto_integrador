import { defineStore } from 'pinia';
import api from '../services/api';

export const useHuertosStore = defineStore('huertos', {
  state: () => ({
    huertos: [],
    cargando: false,
    error: ''
  }),

  getters: {
    // Huertos con temporada activa — útil para el dashboard del productor (RF04)
    huertosActivos: (state) => state.huertos.filter(h => h.temporadaActiva),

    // Total de cosecheros únicos activos en todos los huertos (RF04 dashboard)
    totalCosecherosActivos: (state) => {
      const uids = new Set();
      state.huertos.forEach(h => {
        (h.trabajadoresActivos || []).forEach(uid => uids.add(uid));
      });
      return uids.size;
    }
  },

  actions: {
    async cargarHuertos() {
      try {
        this.cargando = true;
        this.error = '';
        const response = await api.get('/huertos');
        this.huertos = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al cargar huertos';
        console.error('Error cargando huertos:', err);
      } finally {
        this.cargando = false;
      }
    },

    async crearHuerto(nombre, ubicacion) {
      try {
        this.error = '';
        await api.post('/huertos', { nombre, ubicacion });
        await this.cargarHuertos();
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al crear huerto';
        throw err; // re-lanzamos para que el composable lo capture
      }
    },

    async editarHuerto(id, datos) {
      try {
        this.error = '';
        await api.put(`/huertos/${id}`, datos);
        await this.cargarHuertos();
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al editar huerto';
        throw err;
      }
    },

    async eliminarHuerto(id) {
      try {
        this.error = '';
        await api.delete(`/huertos/${id}`);
        await this.cargarHuertos();
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al eliminar huerto';
        throw err;
      }
    },

    // ── Gestión de cosecheros (RF12/RF13) ─────────────────────
    async asignarTrabajador(huertoId, trabajadorId) {
      try {
        this.error = '';
        await api.post(`/huertos/${huertoId}/asignar`, { trabajadorId });
        await this.cargarHuertos();
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al asignar trabajador';
        throw err;
      }
    },

    // ← BUG FIX: ahora sí manda trabajadorId en el body
    async desasignarTrabajador(huertoId, trabajadorId) {
      try {
        this.error = '';
        await api.post(`/huertos/${huertoId}/desasignar`, { trabajadorId });
        await this.cargarHuertos();
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al desasignar trabajador';
        throw err;
      }
    }
  }
});