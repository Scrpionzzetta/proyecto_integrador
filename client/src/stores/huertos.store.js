import { defineStore } from 'pinia';
import api from '../services/api';

export const useHuertosStore = defineStore('huertos', {
  state: () => ({
    huertos: [],
    cargando: false
  }),

  actions: {
    async cargarHuertos() {
      try {
        this.cargando = true;
        const response = await api.get('/huertos');
        this.huertos = response.data;
      } catch (err) {
        console.error('Error cargando huertos:', err);
      } finally {
        this.cargando = false;
      }
    },

    async asignarTrabajador(huertoId, trabajadorId) {
      await api.post(`/huertos/${huertoId}/asignar`, { trabajadorId });
      await this.cargarHuertos();
    },

    async desasignarTrabajador(huertoId) {
      await api.post(`/huertos/${huertoId}/desasignar`);
      await this.cargarHuertos();
    }
  }
});