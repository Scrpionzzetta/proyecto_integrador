<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Reporte de Temporada</h1>
          <div class="content-sub">
            Resumen completo de produccion, ventas y pagos por temporada
          </div>
        </div>
      </div>

      <div class="page">

        <!-- Selector de temporada -->
        <div class="card" style="margin-bottom: 18px;">
          <div class="card-header">
            <h3>Selecciona una temporada</h3>
          </div>
          <div class="card-body">
            <div class="grid-2" style="margin-bottom: 16px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Temporada</label>
                <select v-model="temporadaSeleccionada">
                  <option value="">-- Selecciona una temporada --</option>
                  <option v-for="t in temporadas" :key="t.id" :value="t.id">
                    {{ t.fruta }} — {{ t.anio }}
                    ({{ t.estado === 'activa' ? 'En curso' : 'Cerrada' }})
                  </option>
                </select>
              </div>
              <div style="display: flex; align-items: flex-end;">
                <button
                  class="btn-primary"
                  :disabled="cargando || !temporadaSeleccionada"
                  @click="generarReporte"
                  style="width: 100%;"
                >
                  {{ cargando ? 'Generando...' : 'Generar Reporte' }}
                </button>
              </div>
            </div>
            <p v-if="error" class="error">{{ error }}</p>
          </div>
        </div>

        <!-- Reporte generado -->
        <template v-if="reporte">

          <!-- Encabezado de la temporada -->
          <div class="card" style="margin-bottom: 18px;">
            <div class="card-body">
              <div class="flex-between">
                <div>
                  <h2 style="margin-bottom: 6px;">
                    {{ reporte.temporada.fruta }} — {{ reporte.temporada.anio }}
                  </h2>
                  <div class="text-sm text-muted" style="margin-bottom: 3px;">
                    Huerto: <strong>{{ reporte.temporada.huerto }}</strong>
                  </div>
                  <div class="text-sm text-muted" style="margin-bottom: 3px;">
                    Periodo:
                    <strong>{{ reporte.temporada.fechaInicio }}</strong>
                    —
                    <strong>{{ reporte.temporada.fechaFin || 'En curso' }}</strong>
                  </div>
                  <div class="text-sm text-muted">
                    Precio bandeja:
                    <strong>
                      ${{ reporte.temporada.precioBandeja?.toLocaleString('es-CL') }}
                    </strong>
                    &nbsp;|&nbsp; Precio kilo:
                    <strong>
                      ${{ reporte.temporada.precioGranel?.toLocaleString('es-CL') }}
                    </strong>
                  </div>
                </div>
                <span
                  :class="reporte.temporada.estado === 'activa'
                    ? 'badge-green' : 'badge-gray'"
                  style="font-size: 13px; padding: 5px 14px;"
                >
                  {{ reporte.temporada.estado === 'activa' ? 'En curso' : 'Cerrada' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Metricas de resumen -->
          <div class="metrics grid-4" style="margin-bottom: 18px;">
            <div class="metric">
              <div class="metric-label">Total cosechas</div>
              <div class="metric-value color-green">
                {{ reporte.resumen.totalRecolecciones }}
              </div>
              <div class="metric-sub">registros</div>
            </div>
            <div class="metric">
              <div class="metric-label">Kilos cosechados</div>
              <div class="metric-value color-blue">
                {{ reporte.resumen.totalKilos.toLocaleString('es-CL') }}
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
            <div class="metric">
              <div class="metric-label">Total pagado</div>
              <div class="metric-value" style="color: var(--purple);">
                ${{ reporte.resumen.totalPagado.toLocaleString('es-CL') }}
              </div>
              <div class="metric-sub">
                {{ reporte.resumen.cantidadPagos }} pagos
              </div>
            </div>
          </div>

          <!-- Balance destacado -->
          <div
            class="notice notice-green"
            style="display: flex; justify-content: space-between; align-items: center;
                   padding: 18px 24px; margin-bottom: 18px;"
          >
            <div>
              <div class="fw-500" style="font-size: 14px; margin-bottom: 2px;">
                Balance de temporada
              </div>
              <div class="text-sm" style="color: var(--g700); opacity: .8;">
                Ingresos totales menos pagos a cosecheros
              </div>
            </div>
            <div style="text-align: right;">
              <div
                style="font-family: 'Lora', serif; font-size: 28px;
                       font-weight: 600; color: var(--g700);"
              >
                ${{ reporte.resumen.balance.toLocaleString('es-CL') }}
              </div>
              <div class="text-xs text-muted">
                de ${{ reporte.resumen.totalVentas.toLocaleString('es-CL') }} en ventas
              </div>
            </div>
          </div>

          <div class="grid-2" style="margin-bottom: 18px;">

            <!-- Rendimiento por cosechero con barras -->
            <div class="card">
              <div class="card-header">
                <h3>Rendimiento por cosechero</h3>
              </div>
              <div class="card-body">
                <div
                  v-if="reporte.detalleTrabajadores.length === 0"
                  class="text-muted text-sm"
                >
                  Sin cosechas registradas.
                </div>
                <div
                  v-for="t in reporte.detalleTrabajadores"
                  :key="t.trabajadorId"
                  style="padding: 10px 0; border-bottom: 1px solid var(--n100);"
                >
                  <div class="flex-between text-sm" style="margin-bottom: 4px;">
                    <span class="fw-500">{{ t.nombre }}</span>
                    <span class="fw-500 color-green">
                      {{ t.totalKilos.toLocaleString('es-CL') }} kg
                    </span>
                  </div>
                  <div class="pbar-wrap" style="margin-bottom: 4px;">
                    <div
                      class="pbar pbar-green"
                      :style="{
                        width: calcularPorcentaje(
                          t.totalKilos,
                          reporte.resumen.totalKilos
                        ) + '%'
                      }"
                    ></div>
                  </div>
                  <div class="flex-between text-xs text-muted">
                    <span>
                      {{ t.totalBandejas }} bandejas
                    </span>
                    <span class="fw-500" style="color: var(--purple);">
                      ${{ t.totalPagado.toLocaleString('es-CL') }} pagado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resumen financiero -->
            <div class="card">
              <div class="card-header">
                <h3>Resumen financiero</h3>
              </div>
              <div class="card-body">
                <div class="stat-row">
                  <span class="stat-label">Total kilos vendidos</span>
                  <span class="stat-val">
                    {{ reporte.resumen.totalKilosVendidos.toLocaleString('es-CL') }} kg
                  </span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Total ventas registradas</span>
                  <span class="stat-val">{{ reporte.resumen.cantidadVentas }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Total pagos a cosecheros</span>
                  <span class="stat-val">{{ reporte.resumen.cantidadPagos }}</span>
                </div>
                <div class="sep"></div>
                <div class="stat-row">
                  <span class="stat-label">Ingresos por ventas</span>
                  <span class="stat-val color-green fw-600">
                    ${{ reporte.resumen.totalVentas.toLocaleString('es-CL') }}
                  </span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Total pagado a cosecheros</span>
                  <span class="stat-val" style="color: var(--purple);">
                    ${{ reporte.resumen.totalPagado.toLocaleString('es-CL') }}
                  </span>
                </div>
                <div class="stat-row" style="border-bottom: none;">
                  <span
                    class="stat-label fw-600"
                    style="color: var(--g700);"
                  >
                    Balance final
                  </span>
                  <span
                    class="stat-val fw-600"
                    style="color: var(--g700); font-size: 16px;"
                  >
                    ${{ reporte.resumen.balance.toLocaleString('es-CL') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ventas por especie -->
          <div
            class="card"
            v-if="reporte.ventasPorEspecie.length > 0"
            style="margin-bottom: 18px;"
          >
            <div class="card-header">
              <h3>Ventas por especie</h3>
            </div>
            <div class="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Especie</th>
                    <th>Kilos vendidos</th>
                    <th>Participacion</th>
                    <th>Total recaudado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in reporte.ventasPorEspecie"
                    :key="item.especie"
                  >
                    <td>
                      <span class="badge-green">{{ item.especie }}</span>
                    </td>
                    <td>{{ item.cantidad.toLocaleString('es-CL') }} kg</td>
                    <td>
                      <div class="flex gap-8" style="align-items: center;">
                        <div class="pbar-wrap" style="flex: 1; margin-bottom: 0;">
                          <div
                            class="pbar pbar-green"
                            :style="{
                              width: calcularPorcentaje(
                                item.cantidad,
                                reporte.resumen.totalKilosVendidos
                              ) + '%'
                            }"
                          ></div>
                        </div>
                        <span class="text-xs text-muted">
                          {{ calcularPorcentaje(
                              item.cantidad,
                              reporte.resumen.totalKilosVendidos
                            ) }}%
                        </span>
                      </div>
                    </td>
                    <td class="fw-500 color-green">
                      ${{ item.total.toLocaleString('es-CL') }}
                    </td>
                  </tr>
                </tbody>
              </table>
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

          <!-- Aviso si no hay datos -->
          <div
            v-if="reporte.detalleTrabajadores.length === 0 && reporte.ventas.length === 0"
            class="notice notice-amber"
          >
            No hay datos registrados para esta temporada aun.
          </div>

          <!-- Pie del reporte -->
          <div class="notice notice-green" style="margin-top: 18px;">
            <strong>Reporte generado:</strong>
            {{ fechaGeneracion }} · Todos los datos corresponden a registros
            ingresados en la plataforma durante la temporada
            {{ reporte.temporada.anio }}. Este documento puede ser presentado
            a la Oficina de Desarrollo Rural de la Municipalidad de Parral.
          </div>

        </template>

      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useReporteTemporada } from '../../composables/useReporteTemporada';

const {
  reporte, temporadas, temporadaSeleccionada,
  cargando, error,
  generarReporte
} = useReporteTemporada();

const coloresEspecie = ['pbar-blue', 'pbar-pink', 'pbar-purple', 'pbar-amber', 'pbar-green'];

const calcularPorcentaje = (cantidad, total) => {
  if (!total || total === 0) return 0;
  return Math.round(cantidad / total * 100);
};

const fechaGeneracion = new Date().toLocaleDateString('es-CL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
</script>