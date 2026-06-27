<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Registro de Ventas</h1>
          <div class="content-sub">Control de ventas de produccion por especie</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarFormulario = true">
            Nueva Venta
          </button>
        </div>
      </div>

      <div class="page">

        <!-- Metricas resumen -->
        <div class="metrics grid-3" style="margin-bottom: 18px;">
          <div class="metric">
            <div class="metric-label">Total ventas</div>
            <div class="metric-value color-green">{{ ventas.length }}</div>
            <div class="metric-sub">operaciones registradas</div>
          </div>
          <div class="metric">
            <div class="metric-label">Total kilos vendidos</div>
            <div class="metric-value color-blue">
              {{ totalKilos().toLocaleString('es-CL') }}
            </div>
            <div class="metric-sub">kg en total</div>
          </div>
          <div class="metric" style="background: var(--g700);">
            <div class="metric-label" style="color: rgba(255,255,255,.7);">
              Total recaudado
            </div>
            <div class="metric-value" style="color: #fff;">
              ${{ totalVentas().toLocaleString('es-CL') }}
            </div>
            <div class="metric-sub" style="color: rgba(255,255,255,.5);">
              ingresos totales
            </div>
          </div>
        </div>

        <!-- Modal registrar venta -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card">
            <h2>Registrar Venta</h2>

            <div class="form-group">
              <label>Comprador</label>
              <select v-model="form.compradorId" @change="onCompradorChange">
                <option value="">Selecciona un comprador</option>
                <option v-for="c in compradores" :key="c.id" :value="c.id">
                  {{ c.nombre }} — {{ c.tipo }}
                </option>
              </select>
              <span v-if="compradores.length === 0" class="aviso-small">
                No hay compradores registrados.
                Agrega uno en la seccion Compradores.
              </span>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Fecha de venta</label>
                <input
                  v-model="form.fecha"
                  type="date"
                  :max="new Date().toISOString().split('T')[0]"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Especie / Fruta</label>
                <input
                  v-model="form.especie"
                  type="text"
                  placeholder="Ej: Arandano, Frambuesa"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Cantidad (kg)</label>
                <input
                  v-model="form.cantidad"
                  type="number"
                  min="1"
                  placeholder="Ej: 500"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Precio por kilo ($)</label>
                <input
                  v-model="form.precioVenta"
                  type="number"
                  min="1"
                  placeholder="Ej: 1200"
                />
              </div>
            </div>

            <!-- Vista previa del total -->
            <div
              v-if="form.cantidad && form.precioVenta"
              class="notice notice-green"
              style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-top: 4px;"
            >
              <span class="fw-500">Total estimado</span>
              <span style="font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: var(--g700);">
                ${{ (Number(form.cantidad) * Number(form.precioVenta)).toLocaleString('es-CL') }}
              </span>
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
              <button class="btn-primary" @click="registrarVenta">Registrar</button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando ventas...</div>
        <div v-else-if="ventas.length === 0" class="vacio">
          No hay ventas registradas aun.
        </div>

        <!-- Tabla de ventas -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Comprador</th>
                <th>Especie</th>
                <th>Cantidad</th>
                <th>Precio x kg</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venta in ventas" :key="venta.id">
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
                <td>
                  <button
                    class="btn-danger btn-sm"
                    @click="eliminarVenta(venta.id)"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useVentas } from '../../composables/useVentas';

const {
  ventas, compradores, cargando, mostrarFormulario, error, form,
  cerrarFormulario, onCompradorChange, registrarVenta, eliminarVenta,
  totalVentas, totalKilos
} = useVentas();
</script>