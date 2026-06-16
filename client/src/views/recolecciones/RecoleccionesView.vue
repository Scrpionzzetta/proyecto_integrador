<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Recolecciones</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">+ Registrar Recoleccion</button>
      </div>

      <!-- Tabla de recolecciones -->
      <div v-if="cargando" class="aviso">Cargando recolecciones...</div>
      <div v-else-if="recolecciones.length === 0" class="aviso">Aun no hay recolecciones registradas</div>

      <div v-else class="table-wrap">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Huerto</th>
              <th>Trabajador</th>
              <th>Temporada</th>
              <th>Tipo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in recolecciones" :key="r.id">
              <td>{{ new Date(r.fecha).toLocaleDateString() }}</td>
              <td>{{ nombreHuerto(r.huertoId) }}</td>
              <td>{{ nombreTrabajador(r.trabajadorId) }}</td>
              <td>{{ nombreTemporada(r.temporadaId) }}</td>
              <td>
                <span :class="r.tipo === 'bandeja' ? 'badge-bandeja' : 'badge-granel'">
                  {{ r.tipo === 'bandeja' ? 'Bandeja' : 'Granel' }}
                </span>
              </td>
              <td>{{ r.cantidad }} {{ r.tipo === 'bandeja' ? 'bandejas' : 'kg' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal registrar recoleccion -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Registrar Recoleccion</h2>

          <p v-if="error" class="aviso aviso-error">{{ error }}</p>

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
            <label>Trabajador</label>
            <select v-model="form.trabajadorId" :disabled="!form.huertoId">
              <option value="">Selecciona un trabajador</option>
              <option v-for="t in trabajadoresDelHuerto" :key="t.uid" :value="t.uid">
                {{ t.nombre }}
              </option>
            </select>
            <small v-if="form.huertoId && trabajadoresDelHuerto.length === 0" class="aviso">
              Este huerto no tiene trabajadores asignados
            </small>
          </div>

          <div class="form-group">
            <label>Temporada</label>
            <select v-model="form.temporadaId" :disabled="!form.huertoId">
              <option value="">Selecciona una temporada</option>
              <option v-for="t in temporadasDelHuerto" :key="t.id" :value="t.id">
                {{ t.fruta }} (desde {{ t.fechaInicio }})
              </option>
            </select>
            <small v-if="form.huertoId && temporadasDelHuerto.length === 0" class="aviso">
              Este huerto no tiene temporadas activas
            </small>
          </div>

          <div class="form-group">
            <label>Tipo de recoleccion</label>
            <select v-model="form.tipo">
              <option value="bandeja">Bandeja</option>
              <option value="granel">Granel (kilos)</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ form.tipo === 'bandeja' ? 'Cantidad de bandejas' : 'Cantidad de kilos' }}</label>
            <input type="number" min="1" step="1" v-model="form.cantidad" />
          </div>

          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" :disabled="guardando" @click="registrarRecoleccion">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
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