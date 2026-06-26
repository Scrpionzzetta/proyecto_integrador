import { ref, onMounted } from 'vue';
import api from '../services/api';

export function usePagos() {
  const pagos = ref([]);
  const trabajadores = ref([]);
  const huertos = ref([]);
  const temporadas = ref([]);
  const cargando = ref(true);
  const mostrarCalculador = ref(false);
  const resultado = ref(null);
  const error = ref('');

  const form = ref({
    trabajadorId: '',
    huertoId: '',
    temporadaId: '',
    periodo: 'quincenal',
    fechaInicio: '',
    fechaFin: ''
  });

  const cerrarCalculador = () => {
    mostrarCalculador.value = false;
    resultado.value = null;
    error.value = '';
    form.value = {
      trabajadorId: '',
      huertoId: '',
      temporadaId: '',
      periodo: 'quincenal',
      fechaInicio: '',
      fechaFin: ''
    };
  };

  // ── Helpers de nombre ──────────────────────────────────────
  const nombreTrabajador = (uid) => {
    const t = trabajadores.value.find(t => t.uid === uid);
    return t ? t.nombre : uid;
  };

  const nombreHuerto = (id) => {
    const h = huertos.value.find(h => h.id === id);
    return h ? h.nombre : id;
  };

  const nombreTemporada = (id) => {
    const t = temporadas.value.find(t => t.id === id);
    return t ? `${t.fruta} (${t.anio})` : id;
  };

  // ── Carga inicial ──────────────────────────────────────────
  // Solo cargamos trabajadores que son los cosecheros del productor
  // (los que tiene asignados en sus huertos), no todos los usuarios
  const cargarDatos = async () => {
    try {
      cargando.value = true;
      const [pagosRes, misTrabajadoresRes, huertosRes, temporadasRes] = await Promise.all([
        api.get('/pagos'),
        api.get('/trabajadores/mis-trabajadores'),  // solo los suyos (RF12)
        api.get('/huertos'),
        api.get('/temporadas')
      ]);
      pagos.value = pagosRes.data.sort(
        (a, b) => new Date(b.fechaPago) - new Date(a.fechaPago)
      );
      trabajadores.value = misTrabajadoresRes.data;
      huertos.value = huertosRes.data;
      temporadas.value = temporadasRes.data;
    } catch (err) {
      console.error('Error cargando datos de pagos:', err);
    } finally {
      cargando.value = false;
    }
  };

  // ── Listas filtradas para el formulario ───────────────────
  // Cuando el usuario elige un huerto, filtramos los cosecheros
  // asignados a ese huerto y la temporada activa del mismo (RF14/RF16)
  const trabajadoresDelHuerto = (huertoId) => {
    if (!huertoId) return [];
    const huerto = huertos.value.find(h => h.id === huertoId);
    if (!huerto) return [];
    const activos = huerto.trabajadoresActivos || [];
    return trabajadores.value.filter(t => activos.includes(t.uid));
  };

  const temporadasDelHuerto = (huertoId) => {
    if (!huertoId) return [];
    return temporadas.value.filter(
      t => t.huertoId === huertoId && t.estado === 'activa'
    );
  };

  // ── Calcular pago (RF16) ──────────────────────────────────
  const calcularPago = async () => {
    error.value = '';
    resultado.value = null;
    try {
      const { trabajadorId, huertoId, temporadaId, periodo, fechaInicio, fechaFin } = form.value;
      if (!trabajadorId || !huertoId || !temporadaId || !fechaInicio || !fechaFin) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      if (fechaInicio > fechaFin) {
        error.value = 'La fecha de inicio no puede ser posterior a la fecha de fin';
        return;
      }
      const response = await api.post('/pagos/calcular', form.value);
      resultado.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al calcular pago';
    }
  };

  // ── Registrar pago (RF16) ─────────────────────────────────
  const registrarPago = async () => {
    error.value = '';
    try {
      if (!resultado.value) {
        error.value = 'Primero debes calcular el pago';
        return;
      }
      await api.post('/pagos', {
        ...form.value,
        monto: resultado.value.resumen.totalAPagar
      });
      cerrarCalculador();
      await cargarDatos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrar pago';
    }
  };

  onMounted(cargarDatos);

  return {
    pagos, trabajadores, huertos, temporadas,
    cargando, mostrarCalculador, resultado, error, form,
    cerrarCalculador,
    nombreTrabajador, nombreHuerto, nombreTemporada,
    trabajadoresDelHuerto, temporadasDelHuerto,
    calcularPago, registrarPago
  };
}