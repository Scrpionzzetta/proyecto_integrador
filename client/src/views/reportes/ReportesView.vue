<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Reportes y Estadisticas</h1>
          <div class="content-sub">
            Produccion global filtrable por productor, especie y temporada
          </div>
        </div>
      </div>

      <div class="page">

        <!-- Filtros -->
        <div class="card" style="margin-bottom: 18px;">
          <div class="card-header">
            <h3>Filtros de busqueda</h3>
            <button class="btn-secondary btn-sm" @click="limpiarFiltros">
              Limpiar filtros
            </button>
          </div>
          <div class="card-body">
            <div class="grid-3" style="margin-bottom: 16px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Productor</label>
                <select v-model="filtros.duenoId">
                  <option value="">Todos los productores</option>
                  <option v-for="u in usuarios" :key="u.uid" :value="u.uid">
                    {{ u.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Especie / Fruta</label>
                <select v-model="filtros.especie">
                  <option value="">Todas las especies</option>
                  <option
                    v-for="especie in especiesDisponibles"
                    :key="especie"
                    :value="especie"
                  >
                    {{ especie }}
                  </option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Temporada</label>
                <select v-model="filtros.temporadaId">
                  <option value="">Todas las temporadas</option>
                  <option v-for="t in temporadas" :key="t.id" :value="t.id">
                    {{ t.fruta }} — {{ t.anio }}
                  </option>
                </select>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button
                class="btn-primary"
                :disabled="cargando"
                @click="generarReporte"
              >
                {{ cargando ? 'Generando...' : 'Generar Reporte' }}
              </button>
            </div>
            <p v-if="error" class="error" style="margin-top: 8px; text-align: right;">
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Resultado del reporte -->
        <template v-if="reporte">

          <!-- Metricas globales -->
          <div class="metrics grid-4" style="margin-bottom: 18px;">
            <div class="metric">
              <div class="metric-label">Total recolecciones</div>
              <div class="metric-value color-green">
                {{ reporte.resumen.totalRecolecciones }}
              </div>
              <div class="metric-sub">registros de cosecha</div>
            </div>
            <div class="metric">
              <div class="metric-label">Kilos recolectados</div>
              <div class="metric-value color-blue">
                {{ reporte.resumen.totalKilosRecolectados.toLocaleString('es-CL') }}
              </div>
              <div class="metric-sub">
                + {{ reporte.resumen.totalBandejas }} bandejas
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Kilos vendidos</div>
              <div class="metric-value color-amber">
                {{ reporte.resumen.totalKilosVendidos.toLocaleString('es-CL') }}
              </div>
              <div class="metric-sub">
                {{ reporte.resumen.cantidadVentas }} ventas
              </div>
            </div>
            <div class="metric" style="background: var(--g700);">
              <div class="metric-label" style="color: rgba(255,255,255,.7);">
                Total recaudado
              </div>
              <div class="metric-value" style="color: #fff; font-size: 20px;">
                ${{ reporte.resumen.totalVentas.toLocaleString('es-CL') }}
              </div>
              <div class="metric-sub" style="color: rgba(255,255,255,.5);">
                ${{ reporte.resumen.totalPagado.toLocaleString('es-CL') }} pagado
              </div>
            </div>
          </div>

          <div class="grid-2" style="margin-bottom: 18px;">

            <!-- Ventas por especie con barras -->
            <div class="card">
              <div class="card-header">
                <h3>Distribucion por especie</h3>
              </div>
              <div class="card-body">
                <div
                  v-if="reporte.ventasPorEspecie.length === 0"
                  class="text-muted text-sm"
                >
                  Sin datos para los filtros seleccionados.
                </div>
                <div
                  v-else
                  v-for="(item, i) in reporte.ventasPorEspecie"
                  :key="item.especie"
                  class="pbar-row"
                >
                  <div class="pbar-meta">
                    <span class="pbar-label">{{ item.especie }}</span>
                    <span class="pbar-value">
                      {{ item.cantidad.toLocaleString('es-CL') }} kg
                    </span>
                  </div>
                  <div class="pbar-wrap">
                    <div
                      class="pbar"
                      :class="coloresEspecie[i % coloresEspecie.length]"
                      :style="{
                        width: calcularPorcentaje(
                          item.cantidad,
                          reporte.resumen.totalKilosVendidos
                        ) + '%'
                      }"
                    ></div>
                  </div>
                  <div class="flex-between text-xs text-muted mt-4">
                    <span>
                      {{ calcularPorcentaje(
                          item.cantidad,
                          reporte.resumen.totalKilosVendidos
                        ) }}% del total
                    </span>
                    <span class="fw-500 color-green">
                      ${{ item.total.toLocaleString('es-CL') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagos a trabajadores -->
            <div class="card">
              <div class="card-header">
                <h3>Pagos a cosecheros</h3>
              </div>
              <div v-if="reporte.pagos.length === 0" class="card-body">
                <div class="text-muted text-sm">Sin pagos en este periodo.</div>
              </div>
              <div v-else class="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Periodo</th>
                      <th>Desde</th>
                      <th>Hasta</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pago in reporte.pagos" :key="pago.id">
                      <td>
                        <span class="badge-blue">{{ pago.periodo }}</span>
                      </td>
                      <td class="text-muted text-sm">{{ pago.fechaInicio }}</td>
                      <td class="text-muted text-sm">{{ pago.fechaFin }}</td>
                      <td class="fw-500 color-green">
                        ${{ pago.monto?.toLocaleString('es-CL') }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Detalle de ventas -->
          <div
            class="card"
            v-if="reporte.ventas.length > 0"
            style="margin-bottom: 18px;"
          >
            <div class="card-header">
              <h3>Detalle de ventas</h3>
              <span class="badge-gray">{{ reporte.ventas.length }} operaciones</span>
            </div>
            <div class="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Comprador</th>
                    <th>Especie</th>
                    <th>Cantidad</th>
                    <th>Precio x kg</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="venta in reporte.ventas" :key="venta.id">
                    <td class="text-muted">{{ venta.fecha }}</td>
                    <td class="fw-500">{{ venta.comprador }}</td>
                    <td>
                      <span class="badge-green">{{ venta.especie }}</span>
                    </td>
                    <td>{{ venta.cantidad.toLocaleString('es-CL') }} kg</td>
                    <td class="text-muted">
                      ${{ venta.precioVenta?.toLocaleString('es-CL') }}
                    </td>
                    <td class="fw-500 color-green">
                      ${{ venta.totalVenta?.toLocaleString('es-CL') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            v-if="reporte.ventas.length === 0 && reporte.pagos.length === 0"
            class="notice notice-amber"
          >
            No hay datos para los filtros seleccionados. Intenta con otros parametros.
          </div>

        </template>

        <!-- Ultimos ingresos (cuando no hay reporte generado) -->
        <template v-else>
          <div class="card">
            <div class="card-header">
              <h3>Actividad reciente de productores</h3>
            </div>
            <div v-if="cargandoIngresos" class="card-body text-muted text-sm">
              Cargando...
            </div>
            <div
              v-else-if="ultimosIngresos.length === 0"
              class="card-body text-muted text-sm"
            >
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
                    <td class="text-muted">{{ r.fecha?.split('T')[0] }}</td>
                    <td>
                      <span
                        :class="r.tipo === 'bandeja' ? 'badge-bandeja' : 'badge-amber'"
                      >
                        {{ r.tipo === 'bandeja' ? 'Bandeja' : 'Granel' }}
                      </span>
                    </td>
                    <td>
                      {{ r.cantidad }}
                      {{ r.tipo === 'bandeja' ? 'bandejas' : 'kg' }}
                    </td>
                    <td class="text-muted text-sm">{{ r.huertoId }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useReportes } from '../../composables/useReportes';

const {
  reporte, ultimosIngresos, usuarios, temporadas,
  especiesDisponibles,
  cargando, cargandoIngresos, error, filtros,
  limpiarFiltros, generarReporte,
  nombreUsuario, nombreTemporada
} = useReportes();

const coloresEspecie = ['pbar-blue', 'pbar-pink', 'pbar-purple', 'pbar-amber', 'pbar-green'];

const calcularPorcentaje = (cantidad, total) => {
  if (!total || total === 0) return 0;
  return Math.round(cantidad / total * 100);
};
</script>