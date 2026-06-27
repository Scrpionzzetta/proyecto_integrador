<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <!-- ── Dashboard Administrador ── -->
      <template v-if="authStore.esAdmin">
        <div class="content-header">
          <div>
            <h1>Panel de Administracion</h1>
            <div class="content-sub">Temporada {{ anioActual }} · Parral, Region del Maule</div>
          </div>
          <div class="content-actions">
            <router-link to="/reportes" class="btn-primary btn-sm">Ver reportes</router-link>
          </div>
        </div>

        <div class="page">
          <!-- Metricas globales (RF04) -->
          <div class="metrics grid-4">
            <div class="metric">
              <div class="metric-icon" style="background:var(--purple-l);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="#7c3aed" stroke-width="1.5"/>
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="metric-label">Productores activos</div>
              <div class="metric-value" style="color:var(--purple);">{{ totales.productoresActivos }}</div>
              <div class="metric-sub">de {{ totales.totalProductores }} registrados</div>
            </div>
            <div class="metric">
              <div class="metric-icon" style="background:var(--g100);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13C3 8 7 3 13 3c0 6-4 10-10 10z" stroke="var(--g700)" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="metric-label">Cosechas registradas</div>
              <div class="metric-value color-green">{{ totales.recolecciones }}</div>
              <div class="metric-sub">esta temporada</div>
            </div>
            <div class="metric">
              <div class="metric-icon" style="background:var(--blue-l);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M5 6l3-4 3 4M5 12l3 2 3-2" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="metric-label">Kilos cosechados</div>
              <div class="metric-value color-blue">{{ totales.kilosRecolectados.toLocaleString('es-CL') }}</div>
              <div class="metric-sub">todas las especies</div>
            </div>
            <div class="metric">
              <div class="metric-icon" style="background:var(--amber-l);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="var(--amber)" stroke-width="1.5"/>
                  <path d="M8 5v3l2 2" stroke="var(--amber)" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="metric-label">Total ventas registradas</div>
              <div class="metric-value color-amber">{{ formatMonto(totales.totalVentas) }}</div>
              <div class="metric-sub">{{ totales.ventas }} operaciones</div>
            </div>
          </div>

          <!-- Produccion por productor (barras) -->
          <div class="grid-2" style="margin-bottom: 14px;">
            <div class="card">
              <div class="card-header">
                <h3>Produccion por productor</h3>
              </div>
              <div class="card-body">
                <div v-if="cargando" class="text-muted text-sm">Cargando...</div>
                <div v-else-if="produccionPorProductor.length === 0" class="text-muted text-sm">
                  Sin datos aun.
                </div>
                <div
                  v-for="p in produccionPorProductor"
                  :key="p.uid"
                  class="pbar-row"
                >
                  <div class="pbar-meta">
                    <span class="pbar-label">{{ p.nombre }}</span>
                    <span class="pbar-value">{{ p.kilos.toLocaleString('es-CL') }} kg</span>
                  </div>
                  <div class="pbar-wrap">
                    <div
                      class="pbar pbar-green"
                      :style="{ width: p.porcentaje + '%' }"
                    ></div>
                  </div>
                  <div class="text-xs text-muted mt-4">
                    {{ formatMonto(p.ingresos) }} en ventas
                  </div>
                </div>
              </div>
            </div>

            <!-- Distribucion por especie (barras) -->
            <div class="card">
              <div class="card-header">
                <h3>Distribucion por especie</h3>
              </div>
              <div class="card-body">
                <div v-if="cargando" class="text-muted text-sm">Cargando...</div>
                <div v-else-if="distribucionEspecies.length === 0" class="text-muted text-sm">
                  Sin datos aun.
                </div>
                <div
                  v-for="(e, i) in distribucionEspecies"
                  :key="e.especie"
                  class="pbar-row"
                >
                  <div class="pbar-meta">
                    <span class="pbar-label">{{ e.especie }}</span>
                    <span class="pbar-value">{{ e.porcentaje }}%</span>
                  </div>
                  <div class="pbar-wrap">
                    <div
                      class="pbar"
                      :class="coloresEspecie[i % coloresEspecie.length]"
                      :style="{ width: e.porcentaje + '%' }"
                    ></div>
                  </div>
                  <div class="text-xs text-muted mt-4">
                    {{ e.kilos.toLocaleString('es-CL') }} kg totales
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RF09: ultimos registros ingresados -->
          <div class="card">
            <div class="card-header">
              <h3>Actividad reciente de productores</h3>
              <router-link to="/reportes" class="btn-secondary btn-sm">Ver reportes</router-link>
            </div>
            <div v-if="cargando" class="card-body text-muted text-sm">Cargando...</div>
            <div v-else-if="ultimosIngresos.length === 0" class="card-body text-muted text-sm">
              No hay registros aun.
            </div>
            <div v-else class="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Huerto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in ultimosIngresos" :key="r.id">
                    <td>{{ r.fecha?.split('T')[0] }}</td>
                    <td>
                      <span :class="r.tipo === 'bandeja' ? 'badge-bandeja' : 'badge-granel'">
                        {{ r.tipo === 'bandeja' ? 'Bandeja' : 'Granel' }}
                      </span>
                    </td>
                    <td>{{ r.cantidad }} {{ r.tipo === 'bandeja' ? 'bandejas' : 'kg' }}</td>
                    <td class="text-muted">{{ r.huertoId }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <!-- ── Dashboard Productor (RF04) ── -->
      <template v-else-if="authStore.esDueno">
        <div class="content-header">
          <div>
            <h1>Bienvenido, {{ authStore.usuario?.nombre?.split(' ')[0] }}</h1>
            <div class="content-sub">{{ fechaHoy }}</div>
          </div>
          <div class="content-actions">
            <router-link to="/recolecciones" class="btn-primary btn-sm">Registrar cosecha</router-link>
          </div>
        </div>

        <div class="page">
          <!-- Metricas del productor -->
          <div class="metrics grid-4">
            <div class="metric">
              <div class="metric-icon" style="background:var(--g100);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="8" width="12" height="6" rx="1.5" stroke="var(--g700)" stroke-width="1.4"/>
                  <path d="M5 8V5a3 3 0 016 0v3" stroke="var(--g700)" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="metric-label">Mis huertos</div>
              <div class="metric-value color-green">{{ totales.huertos }}</div>
              <div class="metric-sub">registrados</div>
            </div>
            <div class="metric">
              <div class="metric-icon" style="background:var(--blue-l);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <circle cx="6" cy="5" r="2.5" stroke="var(--blue)" stroke-width="1.4"/>
                  <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="var(--blue)" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="metric-label">Cosecheros activos</div>
              <div class="metric-value color-blue">{{ totales.cosecherosActivos }}</div>
              <div class="metric-sub">en mis huertos</div>
            </div>
            <div class="metric">
              <div class="metric-icon" style="background:var(--amber-l);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13C3 8 7 3 13 3c0 6-4 10-10 10z" stroke="var(--amber)" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="metric-label">Cosechas registradas</div>
              <div class="metric-value color-amber">{{ totales.recolecciones }}</div>
              <div class="metric-sub">esta temporada</div>
            </div>
            <div class="metric">
              <div class="metric-icon" style="background:var(--purple-l);">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="var(--purple)" stroke-width="1.4"/>
                  <path d="M1 7h14" stroke="var(--purple)" stroke-width="1.4"/>
                  <circle cx="5" cy="11" r="1" fill="var(--purple)"/>
                </svg>
              </div>
              <div class="metric-label">Pagos realizados</div>
              <div class="metric-value" style="color:var(--purple);">{{ totales.pagos }}</div>
              <div class="metric-sub">a cosecheros</div>
            </div>
          </div>

          <!-- Produccion por especie (barras) -->
          <div class="grid-2" style="margin-bottom: 14px;">
            <div class="card">
              <div class="card-header">
                <h3>Produccion por especie</h3>
              </div>
              <div class="card-body">
                <div v-if="cargando" class="text-muted text-sm">Cargando...</div>
                <div v-else-if="distribucionEspecies.length === 0" class="text-muted text-sm">
                  Sin cosechas registradas aun.
                </div>
                <div
                  v-for="(e, i) in distribucionEspecies"
                  :key="e.especie"
                  class="pbar-row"
                >
                  <div class="pbar-meta">
                    <span class="pbar-label">{{ e.especie }}</span>
                    <span class="pbar-value">{{ e.porcentaje }}%</span>
                  </div>
                  <div class="pbar-wrap">
                    <div
                      class="pbar"
                      :class="coloresEspecie[i % coloresEspecie.length]"
                      :style="{ width: e.porcentaje + '%' }"
                    ></div>
                  </div>
                  <div class="text-xs text-muted mt-4">
                    {{ e.kilos.toLocaleString('es-CL') }} kg totales
                  </div>
                </div>
              </div>
            </div>

            <!-- Acceso rapido -->
            <div class="card">
              <div class="card-header">
                <h3>Acceso rapido</h3>
              </div>
              <div class="card-body">
                <div class="accesos-rapidos">
                  <router-link to="/recolecciones" class="acceso-card">
                    Registrar cosecha
                  </router-link>
                  <router-link to="/ventas" class="acceso-card">
                    Registrar venta
                  </router-link>
                  <router-link to="/pagos" class="acceso-card">
                    Calcular pago
                  </router-link>
                  <router-link to="/reporte-temporada" class="acceso-card">
                    Ver reporte de temporada
                  </router-link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import AppSidebar from '../../components/AppSidebar.vue';
import api from '../../services/api';

const authStore = useAuthStore();
const cargando = ref(true);
const ultimosIngresos = ref([]);
const produccionPorProductor = ref([]);
const distribucionEspecies = ref([]);

const anioActual = new Date().getFullYear();

const fechaHoy = new Date().toLocaleDateString('es-CL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const totales = ref({
  huertos: 0,
  cosecherosActivos: 0,
  productoresActivos: 0,
  totalProductores: 0,
  recolecciones: 0,
  kilosRecolectados: 0,
  totalVentas: 0,
  ventas: 0,
  pagos: 0
});

// Colores rotativos para las barras de especie
const coloresEspecie = ['pbar-blue', 'pbar-pink', 'pbar-purple', 'pbar-amber', 'pbar-green'];

const formatMonto = (n) => {
  if (n >= 1000000) return '$' + (Math.round(n / 100000) / 10) + 'M';
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K';
  return '$' + Math.round(n).toLocaleString('es-CL');
};

onMounted(async () => {
  try {
    if (authStore.esAdmin) {
      const [usuariosRes, recoleccionesRes, ventasRes, ingresosRes] = await Promise.all([
        api.get('/usuarios'),
        api.get('/recolecciones'),
        api.get('/ventas'),
        api.get('/reportes/ultimos-ingresos')
      ]);

      const productores = usuariosRes.data.filter(u => u.rol === 'dueño');
      const recolecciones = recoleccionesRes.data;
      const ventas = ventasRes.data;

      totales.value.productoresActivos = productores.filter(u => u.activo !== false).length;
      totales.value.totalProductores = productores.length;
      totales.value.recolecciones = recolecciones.length;
      totales.value.kilosRecolectados = recolecciones
        .filter(r => r.tipo === 'granel')
        .reduce((acc, r) => acc + r.cantidad, 0);
      totales.value.ventas = ventas.length;
      totales.value.totalVentas = ventas.reduce((acc, v) => acc + v.totalVenta, 0);
      ultimosIngresos.value = ingresosRes.data;

      // Produccion por productor para las barras
      const totalKilosGlobal = totales.value.kilosRecolectados || 1;
      produccionPorProductor.value = productores
        .filter(p => p.activo !== false)
        .map(p => {
          const kilos = recolecciones
            .filter(r => r.registradoPor === p.uid && r.tipo === 'granel')
            .reduce((acc, r) => acc + r.cantidad, 0);
          const ingresos = ventas
            .filter(v => v.duenoId === p.uid)
            .reduce((acc, v) => acc + v.totalVenta, 0);
          return {
            uid: p.uid,
            nombre: p.nombre,
            kilos,
            ingresos,
            porcentaje: Math.round(kilos / totalKilosGlobal * 100)
          };
        })
        .filter(p => p.kilos > 0)
        .sort((a, b) => b.kilos - a.kilos);

      // Distribucion por especie
      const especiesMap = ventas.reduce((acc, v) => {
        if (!acc[v.especie]) acc[v.especie] = { kilos: 0 };
        acc[v.especie].kilos += v.cantidad;
        return acc;
      }, {});
      const totalKilosVendidos = Object.values(especiesMap).reduce((s, e) => s + e.kilos, 0) || 1;
      distribucionEspecies.value = Object.entries(especiesMap)
        .map(([especie, data]) => ({
          especie,
          kilos: data.kilos,
          porcentaje: Math.round(data.kilos / totalKilosVendidos * 100)
        }))
        .sort((a, b) => b.kilos - a.kilos);

    } else {
      // Productor
      const [huertosRes, trabajadoresRes, recoleccionesRes, pagosRes] = await Promise.all([
        api.get('/huertos'),
        api.get('/trabajadores/mis-trabajadores'),
        api.get('/recolecciones'),
        api.get('/pagos')
      ]);

      const recolecciones = recoleccionesRes.data;
      totales.value.huertos = huertosRes.data.length;
      totales.value.cosecherosActivos = trabajadoresRes.data.length;
      totales.value.recolecciones = recolecciones.length;
      totales.value.pagos = pagosRes.data.length;

      // Distribucion por especie del productor
      // Cruzamos recolecciones con temporadas para obtener la fruta
      const temporadasRes = await api.get('/temporadas');
      const temporadasMap = temporadasRes.data.reduce((acc, t) => {
        acc[t.id] = t.fruta;
        return acc;
      }, {});

      const especiesMap = recolecciones
        .filter(r => r.tipo === 'granel')
        .reduce((acc, r) => {
          const especie = temporadasMap[r.temporadaId] || 'Sin especie';
          if (!acc[especie]) acc[especie] = { kilos: 0 };
          acc[especie].kilos += r.cantidad;
          return acc;
        }, {});

      const totalKilos = Object.values(especiesMap).reduce((s, e) => s + e.kilos, 0) || 1;
      distribucionEspecies.value = Object.entries(especiesMap)
        .map(([especie, data]) => ({
          especie,
          kilos: data.kilos,
          porcentaje: Math.round(data.kilos / totalKilos * 100)
        }))
        .sort((a, b) => b.kilos - a.kilos);
    }
  } catch (error) {
    console.error('Error cargando dashboard:', error);
  } finally {
    cargando.value = false;
  }
});
</script>