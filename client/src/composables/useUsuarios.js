import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useUsuarios() {
  const usuarios = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const error = ref('');

  const form = ref({
    nombre: '',
    email: '',
    password: '',
    rol: 'dueño',
    tipo_documento: 'rut',
    numero_documento: '',
    fecha_nacimiento: '',
    telefono: ''
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      nombre: '', email: '', password: '',
      rol: 'dueño', tipo_documento: 'rut',
      numero_documento: '', fecha_nacimiento: '', telefono: ''
    };
  };

  const cargarUsuarios = async () => {
    try {
      cargando.value = true;
      const response = await api.get('/usuarios');

      usuarios.value = response.data.filter(u => u.rol === 'dueño');
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      cargando.value = false;
    }
  };

  const crearUsuario = async () => {
    error.value = '';
    try {
      if (!form.value.nombre || !form.value.email || !form.value.password ||
        !form.value.tipo_documento || !form.value.numero_documento ||
        !form.value.fecha_nacimiento) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      await api.post('/auth/registro', form.value);
      cerrarFormulario();
      await cargarUsuarios();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear productor';
    }
  };

  const desactivarUsuario = async (uid) => {
    if (!confirm('¿Desactivar este productor? No podrá acceder al sistema pero su historial se conservará.')) return;
    try {
      await api.put(`/usuarios/${uid}/desactivar`);
      await cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al desactivar productor');
    }
  };

  const activarUsuario = async (uid) => {
    if (!confirm('¿Reactivar este productor? Volverá a tener acceso al sistema.')) return;
    try {
      await api.put(`/usuarios/${uid}/activar`);
      await cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al activar productor');
    }
  };

  const eliminarUsuario = async (uid) => {
    if (!confirm('¿Eliminar permanentemente este productor? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/usuarios/${uid}`);
      await cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar productor');
    }
  };

  onMounted(cargarUsuarios);

  return {
    usuarios, cargando, mostrarFormulario, error, form,
    cerrarFormulario, crearUsuario,
    desactivarUsuario, activarUsuario, eliminarUsuario
  };
}