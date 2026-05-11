<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Temporadas</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">+ Nueva Temporada</button>
      </div>

      <!-- Filtro por año -->
      <div class="filtro-anio">
        <label>Filtrar por año:</label>
        <div class="anios">
          <button v-for="anio in aniosDisponibles" :key="anio" :class="['btn-anio', { activo: anioFiltro === anio }]"
            @click="anioFiltro = anio">
            {{ anio }}
          </button>
        </div>
      </div>

      <!-- Modal crear temporada -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Crear Temporada</h2>
          <div class="form-group">
            <label>Huerto</label>
            <select v-model="form.huertoId">
              <option value="">Selecciona un huerto</option>
              <option v-for="h in huertos" :key="h.id" :value="h.id">
                {{ h.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Fruta / Verdura</label>
            <input v-model="form.fruta" type="text" placeholder="Ej: Manzana, Uva, Tomate" />
          </div>
          <div class="form-group">
            <label>Fecha inicio</label>
            <input v-model="form.fechaInicio" type="date" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Precio por bandeja ($)</label>
              <input v-model="form.precio_bandeja" type="number" placeholder="Ej: 500" />
            </div>
            <div class="form-group">
              <label>Precio por kilo ($)</label>
              <input v-model="form.precio_granel" type="number" placeholder="Ej: 300" />
            </div>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="crearTemporada">Crear</button>
          </div>
        </div>
      </div>

      <!-- Modal cerrar temporada -->
      <div v-if="mostrarCierre" class="modal">
        <div class="modal-card">
          <h2>Cerrar Temporada</h2>
          <p class="info-texto">
            Temporada: <strong>{{ temporadaACerrar?.fruta }}</strong>
          </p>
          <p class="info-texto">
            Fecha inicio: <strong>{{ temporadaACerrar?.fechaInicio }}</strong>
          </p>
          <div class="form-group">
            <label>Fecha de cierre</label>
            <input v-model="fechaCierre" type="date" :max="new Date().toISOString().split('T')[0]"
              :min="temporadaACerrar?.fechaInicio" />
          </div>
          <p v-if="errorCierre" class="error">{{ errorCierre }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarModalCierre">Cancelar</button>
            <button class="btn-danger" @click="cerrarTemporada">Cerrar Temporada</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando temporadas...</div>
      <div v-else-if="temporadasFiltradas.length === 0" class="vacio">
        No hay temporadas para el año {{ anioFiltro }}.
      </div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Huerto</th>
              <th>Fruta/Verdura</th>
              <th>Año</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Precio bandeja</th>
              <th>Precio kilo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="temporada in temporadasFiltradas" :key="temporada.id">
              <td>{{ nombreHuerto(temporada.huertoId) }}</td>
              <td>{{ temporada.fruta }}</td>
              <td>{{ temporada.anio }}</td>
              <td>{{ temporada.fechaInicio }}</td>
              <td>{{ temporada.fechaFin || '—' }}</td>
              <td>${{ temporada.precio_bandeja?.toLocaleString('es-CL') }}</td>
              <td>${{ temporada.precio_granel?.toLocaleString('es-CL') }}</td>
              <td>
                <span v-if="temporada.estado === 'activa'" class="badge-activo">Activa</span>
                <span v-else class="badge-libre">Cerrada</span>
              </td>
              <td class="acciones">
                <button v-if="temporada.estado === 'activa'" class="btn-secondary" @click="abrirCierre(temporada)">
                  Cerrar
                </button>
                <button v-if="temporada.estado === 'cerrada'" class="btn-danger"
                  @click="eliminarTemporada(temporada.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useTemporadas } from '../../composables/useTemporadas';

const {
  huertos, cargando, mostrarFormulario, mostrarCierre,
  temporadaACerrar, fechaCierre, error, errorCierre, form,
  anioFiltro, aniosDisponibles, temporadasFiltradas,
  cerrarFormulario, abrirCierre, cerrarModalCierre,
  crearTemporada, cerrarTemporada,
  eliminarTemporada, nombreHuerto
} = useTemporadas();
</script>

<style scoped>
.filtro-anio {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.filtro-anio label {
  font-weight: bold;
  color: #444;
  margin: 0;
}

.anios {
  display: flex;
  gap: 0.5rem;
}

.btn-anio {
  padding: 0.4rem 1rem;
  border: 2px solid #2d6a4f;
  border-radius: 20px;
  background: white;
  color: #2d6a4f;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-anio:hover {
  background-color: #d8f3dc;
}

.btn-anio.activo {
  background-color: #2d6a4f;
  color: white;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

.info-texto {
  margin-bottom: 0.5rem;
  color: #444;
}
</style>