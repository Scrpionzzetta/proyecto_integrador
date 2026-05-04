import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useTemporadas() {
  const temporadas = ref([]);
  const huertos = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const error = ref('');

  const form = ref({
    huertoId: '',
    fruta: '',
    fechaInicio: '',
    precio_bandeja: '',
    precio_granel: ''
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      huertoId: '', fruta: '', fechaInicio: '',
      precio_bandeja: '', precio_granel: ''
    };
  };

  const cargarDatos = async () => {
    try {
      cargando.value = true;
      const [temporadasRes, huertosRes] = await Promise.all([
        api.get('/temporadas'),
        api.get('/huertos')
      ]);
      temporadas.value = temporadasRes.data;
      huertos.value = huertosRes.data;
    } catch (err) {
      console.error('Error cargando temporadas:', err);
    } finally {
      cargando.value = false;
    }
  };

  const crearTemporada = async () => {
    error.value = '';
    try {
      if (!form.value.huertoId || !form.value.fruta || 
          !form.value.fechaInicio || !form.value.precio_bandeja || 
          !form.value.precio_granel) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      await api.post('/temporadas', {
        ...form.value,
        precio_bandeja: Number(form.value.precio_bandeja),
        precio_granel: Number(form.value.precio_granel)
      });
      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear temporada';
    }
  };

  const cerrarTemporada = async (id) => {
    if (!confirm('¿Cerrar esta temporada?')) return;
    try {
      await api.put(`/temporadas/${id}/cerrar`);
      await cargarDatos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cerrar temporada');
    }
  };

  const nombreHuerto = (id) => {
    const h = huertos.value.find(h => h.id === id);
    return h ? h.nombre : 'Desconocido';
  };

  onMounted(cargarDatos);

  return {
    temporadas, huertos, cargando,
    mostrarFormulario, error, form,
    cerrarFormulario, crearTemporada,
    cerrarTemporada, nombreHuerto
  };
}