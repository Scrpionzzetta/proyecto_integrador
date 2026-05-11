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
      // Solo mostramos admins y dueños, no trabajadores
      usuarios.value = response.data.filter(u => u.rol !== 'trabajador');
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
      error.value = err.response?.data?.error || 'Error al crear usuario';
    }
  };

  const eliminarUsuario = async (uid) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${uid}`);
      await cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  onMounted(cargarUsuarios);

  return {
    usuarios, cargando, mostrarFormulario, error, form,
    cerrarFormulario, crearUsuario, eliminarUsuario
  };
}