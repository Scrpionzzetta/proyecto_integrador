<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Pagos a Cosecheros</h1>
          <div class="content-sub">Calculo y registro de pagos por periodo</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarCalculador = true">
            Calcular Pago
          </button>
        </div>
      </div>

      <div class="page">

        <!-- Modal calcular pago -->
        <div v-if="mostrarCalculador" class="modal">
          <div class="modal-card">
            <h2>Calcular Pago</h2>

            <!-- Paso 1: Huerto -->
            <div class="form-group">
              <label>Huerto</label>
              <select v-model="form.huertoId" @change="onHuertoChange">
                <option value="">Selecciona un huerto</option>
                <option v-for="h in huertos" :key="h.id" :value="h.id">
                  {{ h.nombre }}
                </option>
              </select>
            </div>

            <!-- Paso 2: Cosechero filtrado por huerto -->
            <div class="form-group">
              <label>Cosechero</label>
              <select v-model="form.trabajadorId" :disabled="!form.huertoId">
                <option value="">Selecciona un cosechero</option>
                <option
                  v-for="t in trabajadoresDelHuerto(form.huertoId)"
                  :key="t.uid"
                  :value="t.uid"
                >
                  {{ t.nombre }}
                </option>
              </select>
              <span
                v-if="form.huertoId && trabajadoresDelHuerto(form.huertoId).length === 0"
                class="aviso-small"
              >
                Este huerto no tiene cosecheros asignados
              </span>
            </div>

            <!-- Paso 3: Temporada activa del huerto -->
            <div class="form-group">
              <label>Temporada</label>
              <select v-model="form.temporadaId" :disabled="!form.huertoId">
                <option value="">Selecciona una temporada</option>
                <option
                  v-for="t in temporadasDelHuerto(form.huertoId)"
                  :key="t.id"
                  :value="t.id"
                >
                  {{ t.fruta }} — {{ t.anio }} (activa)
                </option>
              </select>
              <span
                v-if="form.huertoId && temporadasDelHuerto(form.huertoId).length === 0"
                class="aviso-small"
              >
                Este huerto no tiene temporadas activas
              </span>
            </div>

            <!-- Periodo y fechas -->
            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Periodo de pago</label>
                <select v-model="form.periodo">
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <!-- espacio intencional -->
              </div>
            </div>

            <div class="form-row" style="margin-top: 4px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Fecha inicio</label>
                <input v-model="form.fechaInicio" type="date" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Fecha fin</label>
                <input v-model="form.fechaFin" type="date" />
              </div>
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

            <!-- Resultado del calculo -->
            <div v-if="resultado && resultado.resumen" style="margin-top: 16px;">
              <div class="sep"></div>
              <h3 style="margin-bottom: 12px;">Resumen del periodo</h3>

              <div class="grid-2" style="margin-bottom: 12px;">
                <div class="stat-row">
                  <span class="stat-label">Total bandejas</span>
                  <span class="stat-val">{{ resultado.resumen.totalBandejas ?? 0 }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Monto bandejas</span>
                  <span class="stat-val">
                    ${{ resultado.resumen.montoBandejas?.toLocaleString('es-CL') ?? 0 }}
                  </span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Total kilos</span>
                  <span class="stat-val">{{ resultado.resumen.totalKilos ?? 0 }} kg</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Monto granel</span>
                  <span class="stat-val">
                    ${{ resultado.resumen.montoGranel?.toLocaleString('es-CL') ?? 0 }}
                  </span>
                </div>
              </div>

              <!-- Total destacado -->
              <div
                class="notice notice-green"
                style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px;"
              >
                <span class="fw-500" style="font-size: 14px;">Total a pagar</span>
                <span style="font-family: 'Lora', serif; font-size: 22px; font-weight: 600; color: var(--g700);">
                  ${{ resultado.resumen.totalAPagar?.toLocaleString('es-CL') ?? 0 }}
                </span>
              </div>
            </div>

            <!-- Sin recolecciones en el periodo -->
            <div
              v-else-if="resultado && !resultado.resumen"
              class="notice notice-amber"
              style="margin-top: 14px;"
            >
              {{ resultado.mensaje }}
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarCalculador">Cancelar</button>
              <button class="btn-primary" @click="calcularPago">Calcular</button>
              <button
                v-if="resultado && resultado.resumen"
                class="btn-success"
                @click="registrarPago"
              >
                Registrar Pago
              </button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando pagos...</div>
        <div v-else-if="pagos.length === 0" class="vacio">
          No hay pagos registrados aun.
        </div>

        <!-- Tabla historial de pagos -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Cosechero</th>
                <th>Huerto</th>
                <th>Temporada</th>
                <th>Periodo</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagos" :key="pago.id">
                <td class="fw-500">{{ nombreTrabajador(pago.trabajadorId) }}</td>
                <td>{{ nombreHuerto(pago.huertoId) }}</td>
                <td>{{ nombreTemporada(pago.temporadaId) }}</td>
                <td>
                  <span class="badge-blue">{{ pago.periodo }}</span>
                </td>
                <td class="text-muted text-sm">{{ pago.fechaInicio }}</td>
                <td class="text-muted text-sm">{{ pago.fechaFin }}</td>
                <td class="fw-500 color-green">
                  ${{ pago.monto?.toLocaleString('es-CL') }}
                </td>
                <td>
                  <span class="badge-green">{{ pago.estado }}</span>
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
import { usePagos } from '../../composables/usePagos';

const {
  pagos, huertos,
  cargando, mostrarCalculador, resultado, error, form,
  cerrarCalculador,
  nombreTrabajador, nombreHuerto, nombreTemporada,
  trabajadoresDelHuerto, temporadasDelHuerto,
  calcularPago, registrarPago
} = usePagos();

// Resetear cosechero y temporada al cambiar huerto
const onHuertoChange = () => {
  form.value.trabajadorId = '';
  form.value.temporadaId = '';
};
</script>