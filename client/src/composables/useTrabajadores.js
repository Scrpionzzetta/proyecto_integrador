import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useTrabajadores() {
  const trabajadores = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const fichaSeleccionada = ref(null);
  const error = ref('');

  const form = ref({
    nombre: '', email: '', password: '', rol: 'trabajador',
    tipo_documento: 'rut', numero_documento: '', fecha_nacimiento: '',
    telefono: '', nacionalidad: 'chileno', tipo_contrato: 'con_contrato'
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      nombre: '', email: '', password: '', rol: 'trabajador',
      tipo_documento: 'rut', numero_documento: '', fecha_nacimiento: '',
      telefono: '', nacionalidad: 'chileno', tipo_contrato: 'con_contrato'
    };
  };

  const cargarTrabajadores = async () => {
    try {
      cargando.value = true;
      const response = await api.get('/usuarios');
      trabajadores.value = response.data.filter(u => u.rol === 'trabajador');
    } catch (err) {
      console.error('Error cargando trabajadores:', err);
    } finally {
      cargando.value = false;
    }
  };

  const crearTrabajador = async () => {
    error.value = '';
    try {
      await api.post('/auth/registro', form.value);
      cerrarFormulario();
      await cargarTrabajadores();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrar trabajador';
    }
  };

  const verFicha = async (uid) => {
    try {
      const response = await api.get(`/fichas/${uid}`);
      fichaSeleccionada.value = response.data;
    } catch (err) {
      alert('Error al cargar ficha');
    }
  };

  const eliminarTrabajador = async (uid) => {
    if (!confirm('¿Estás seguro de eliminar este trabajador?')) return;
    try {
      await api.delete(`/usuarios/${uid}`);
      await cargarTrabajadores();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar trabajador');
    }
  };

  onMounted(cargarTrabajadores);

  return {
    trabajadores,
    cargando,
    mostrarFormulario,
    fichaSeleccionada,
    error,
    form,
    cerrarFormulario,
    crearTrabajador,
    verFicha,
    eliminarTrabajador
  };
}