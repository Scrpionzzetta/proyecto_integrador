import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useRecolecciones() {
  const recolecciones = ref([]);
  const huertos = ref([]);
  const trabajadores = ref([]);
  const temporadas = ref([]);

  const cargando = ref(true);
  const guardando = ref(false);
  const mostrarFormulario = ref(false);
  const error = ref('');

  const form = ref({
    huertoId: '',
    trabajadorId: '',
    temporadaId: '',
    tipo: 'bandeja',
    cantidad: ''
  });

  const trabajadoresDelHuerto = ref([]);
  const temporadasDelHuerto = ref([]);

  const cargarDatos = async () => {
    try {
      cargando.value = true;
      const [recoleccionesRes, huertosRes, trabajadoresRes, temporadasRes] = await Promise.all([
        api.get('/recolecciones'),
        api.get('/huertos'),
        api.get('/trabajadores/mis-trabajadores'), // ← Fix: solo los cosecheros del productor
        api.get('/temporadas')
      ]);

      recolecciones.value = recoleccionesRes.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      huertos.value = huertosRes.data;
      trabajadores.value = trabajadoresRes.data; // ← ya vienen filtrados, sin necesidad de .filter()
      temporadas.value = temporadasRes.data;
    } catch (err) {
      console.error('Error cargando datos de recolecciones:', err);
      error.value = 'No se pudieron cargar los datos';
    } finally {
      cargando.value = false;
    }
  };

  // Cuando cambia el huerto filtramos sus cosecheros activos y temporada activa (RF15)
  const onHuertoChange = () => {
    form.value.trabajadorId = '';
    form.value.temporadaId = '';
    trabajadoresDelHuerto.value = [];
    temporadasDelHuerto.value = [];

    if (!form.value.huertoId) return;

    const huerto = huertos.value.find(h => h.id === form.value.huertoId);
    if (!huerto) return;

    // Cada trabajador de mis-trabajadores trae su array "huertos"
    // así que filtramos los que tienen este huertoId
    trabajadoresDelHuerto.value = trabajadores.value.filter(t =>
      t.huertos?.some(h => h.huertoId === form.value.huertoId)
    );

    temporadasDelHuerto.value = temporadas.value.filter(
      t => t.huertoId === form.value.huertoId && t.estado === 'activa'
    );
  };

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = { huertoId: '', trabajadorId: '', temporadaId: '', tipo: 'bandeja', cantidad: '' };
    trabajadoresDelHuerto.value = [];
    temporadasDelHuerto.value = [];
  };

  const registrarRecoleccion = async () => {
    error.value = '';

    if (!form.value.huertoId || !form.value.trabajadorId || !form.value.temporadaId || !form.value.cantidad) {
      error.value = 'Completa todos los campos';
      return;
    }
    if (Number(form.value.cantidad) <= 0) {
      error.value = 'La cantidad debe ser mayor a 0';
      return;
    }

    try {
      guardando.value = true;
      await api.post('/recolecciones', {
        trabajadorId: form.value.trabajadorId,
        huertoId: form.value.huertoId,
        temporadaId: form.value.temporadaId,
        tipo: form.value.tipo,
        cantidad: Number(form.value.cantidad)
      });
      await cargarDatos();
      cerrarFormulario();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrar la recoleccion';
    } finally {
      guardando.value = false;
    }
  };

  // Helpers para la tabla
  const nombreTrabajador = (uid) => {
    const t = trabajadores.value.find(t => t.uid === uid);
    return t ? t.nombre : 'Desconocido';
  };

  const nombreHuerto = (id) => {
    const h = huertos.value.find(h => h.id === id);
    return h ? h.nombre : 'Desconocido';
  };

  const nombreTemporada = (id) => {
    const t = temporadas.value.find(t => t.id === id);
    return t ? t.fruta : 'Desconocido';
  };

  onMounted(cargarDatos);

  return {
    recolecciones, huertos, trabajadores, temporadas,
    trabajadoresDelHuerto, temporadasDelHuerto,
    cargando, guardando, mostrarFormulario, error, form,
    cerrarFormulario, onHuertoChange, registrarRecoleccion,
    nombreTrabajador, nombreHuerto, nombreTemporada
  };
}