import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useHuertos() {
  const huertos = ref([]);
  const trabajadoresDisponibles = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const mostrarAsignar = ref(false);
  const huertoSeleccionado = ref(null);
  const error = ref('');

  const form = ref({ nombre: '', ubicacion: '' });
  const formAsignar = ref({ trabajadorId: '' });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    form.value = { nombre: '', ubicacion: '' };
    error.value = '';
  };

  const cerrarAsignar = () => {
    mostrarAsignar.value = false;
    huertoSeleccionado.value = null;
    formAsignar.value = { trabajadorId: '' };
    trabajadoresDisponibles.value = [];
    error.value = '';
  };

  const abrirAsignar = async (huerto) => {
    huertoSeleccionado.value = huerto;
    mostrarAsignar.value = true;
    trabajadoresDisponibles.value = [];

    try {
      const response = await api.get('/trabajadores/libres');
      const yaAsignados = huerto.trabajadoresActivos || [];
      trabajadoresDisponibles.value = response.data.filter(
        t => !yaAsignados.includes(t.uid)
      );
    } catch (err) {
      console.error('Error cargando trabajadores disponibles:', err);
      error.value = 'No se pudieron cargar los cosecheros disponibles';
    }
  };

  const cargarHuertos = async () => {
    try {
      cargando.value = true;
      const response = await api.get('/huertos');
      huertos.value = response.data;
    } catch (err) {
      console.error('Error cargando huertos:', err);
      error.value = 'No se pudieron cargar los huertos';
    } finally {
      cargando.value = false;
    }
  };

  const crearHuerto = async () => {
    error.value = '';
    try {
      if (!form.value.nombre || !form.value.ubicacion) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      await api.post('/huertos', form.value);
      cerrarFormulario();
      await cargarHuertos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear huerto';
    }
  };

  const eliminarHuerto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este huerto?')) return;
    try {
      await api.delete(`/huertos/${id}`);
      await cargarHuertos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar huerto');
    }
  };

  const asignarTrabajador = async () => {
    error.value = '';
    try {
      if (!formAsignar.value.trabajadorId) {
        error.value = 'Debes seleccionar un cosechero';
        return;
      }
      await api.post(`/huertos/${huertoSeleccionado.value.id}/asignar`, {
        trabajadorId: formAsignar.value.trabajadorId
      });
      cerrarAsignar();
      await cargarHuertos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al asignar cosechero';
    }
  };

  const desasignarTrabajador = async (huertoId, trabajadorId) => {
    if (!confirm('¿Desasignar este cosechero del huerto?')) return;
    try {
      await api.post(`/huertos/${huertoId}/desasignar`, { trabajadorId });
      await cargarHuertos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al desasignar cosechero');
    }
  };

  onMounted(cargarHuertos);

  return {
    huertos, trabajadoresDisponibles, cargando,
    mostrarFormulario, mostrarAsignar,
    huertoSeleccionado, error, form, formAsignar,
    cerrarFormulario, cerrarAsignar, abrirAsignar,
    crearHuerto, eliminarHuerto,
    asignarTrabajador, desasignarTrabajador
  };
}