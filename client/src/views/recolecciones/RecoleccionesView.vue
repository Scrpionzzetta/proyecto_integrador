<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Cosechas Diarias</h1>
          <div class="content-sub">Registro de kilos cosechados por cosechero y especie</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarFormulario = true">
            Registrar Cosecha
          </button>
        </div>
      </div>

      <div class="page">

        <!-- Modal registrar cosecha -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card">
            <h2>Registrar Cosecha</h2>

            <div class="form-group">
              <label>Huerto</label>
              <select v-model="form.huertoId" @change="onHuertoChange">
                <option value="">Selecciona un huerto</option>
                <option v-for="h in huertos" :key="h.id" :value="h.id">
                  {{ h.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Cosechero</label>
              <select v-model="form.trabajadorId" :disabled="!form.huertoId">
                <option value="">Selecciona un cosechero</option>
                <option
                  v-for="t in trabajadoresDelHuerto"
                  :key="t.uid"
                  :value="t.uid"
                >
                  {{ t.nombre }}
                </option>
              </select>
              <span
                v-if="form.huertoId && trabajadoresDelHuerto.length === 0"
                class="aviso-small"
              >
                Este huerto no tiene cosecheros asignados
              </span>
            </div>

            <div class="form-group">
              <label>Temporada activa</label>
              <select v-model="form.temporadaId" :disabled="!form.huertoId">
                <option value="">Selecciona una temporada</option>
                <option
                  v-for="t in temporadasDelHuerto"
                  :key="t.id"
                  :value="t.id"
                >
                  {{ t.fruta }} (desde {{ t.fechaInicio }})
                </option>
              </select>
              <span
                v-if="form.huertoId && temporadasDelHuerto.length === 0"
                class="aviso-small"
              >
                Este huerto no tiene temporadas activas
              </span>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Tipo de recoleccion</label>
                <select v-model="form.tipo">
                  <option value="bandeja">Bandeja</option>
                  <option value="granel">Granel (kilos)</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>
                  {{ form.tipo === 'bandeja' ? 'Cantidad de bandejas' : 'Kilos cosechados' }}
                </label>
                <input
                  v-model="form.cantidad"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ej: 80"
                />
              </div>
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
              <button
                class="btn-primary"
                :disabled="guardando"
                @click="registrarRecoleccion"
              >
                {{ guardando ? 'Guardando...' : 'Guardar registro' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando cosechas...</div>
        <div v-else-if="recolecciones.length === 0" class="vacio">
          No hay cosechas registradas aun.
        </div>

        <!-- Tabla de recolecciones -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Huerto</th>
                <th>Cosechero</th>
                <th>Temporada</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio vigente</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in recolecciones" :key="r.id">
                <td class="text-muted">{{ r.fecha?.split('T')[0] }}</td>
                <td class="fw-500">{{ nombreHuerto(r.huertoId) }}</td>
                <td>{{ nombreTrabajador(r.trabajadorId) }}</td>
                <td>{{ nombreTemporada(r.temporadaId) }}</td>
                <td>
                  <span :class="r.tipo === 'bandeja' ? 'badge-bandeja' : 'badge-amber'">
                    {{ r.tipo === 'bandeja' ? 'Bandeja' : 'Granel' }}
                  </span>
                </td>
                <td class="fw-500">
                  {{ r.cantidad }}
                  {{ r.tipo === 'bandeja' ? 'bandejas' : 'kg' }}
                </td>
                <td class="text-muted text-sm">
                  {{ r.precioVigente
                    ? '$' + r.precioVigente.toLocaleString('es-CL')
                    : '—'
                  }}
                </td>
                <td class="fw-500 color-green">
                  {{ r.precioVigente
                    ? '$' + (r.cantidad * r.precioVigente).toLocaleString('es-CL')
                    : '—'
                  }}
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
import { useRecolecciones } from '../../composables/useRecolecciones';

const {
  recolecciones, huertos, trabajadoresDelHuerto, temporadasDelHuerto,
  cargando, guardando, mostrarFormulario, error, form,
  cerrarFormulario, onHuertoChange, registrarRecoleccion,
  nombreTrabajador, nombreHuerto, nombreTemporada
} = useRecolecciones();
</script>