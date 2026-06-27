<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Temporadas</h1>
          <div class="content-sub">Control de periodos de cosecha por huerto</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarFormulario = true">Nueva Temporada</button>
        </div>
      </div>

      <div class="page">

        <!-- Filtro por año -->
        <div class="card" style="margin-bottom: 14px;">
          <div class="card-body" style="padding: 12px 20px;">
            <div class="flex gap-8" style="align-items: center;">
              <span class="text-sm fw-500" style="color: var(--n600);">Filtrar por año:</span>
              <div class="tabs" style="margin-bottom: 0;">
                <button
                  v-for="anio in aniosDisponibles"
                  :key="anio"
                  :class="['tab', { active: anioFiltro === anio }]"
                  @click="anioFiltro = anio"
                >
                  {{ anio }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal crear temporada -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card">
            <h2>Nueva Temporada</h2>

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
              <label>Especie / Fruta</label>
              <input
                v-model="form.fruta"
                type="text"
                placeholder="Ej: Arandano, Frambuesa, Mora"
              />
            </div>

            <div class="form-group">
              <label>Fecha de inicio</label>
              <input v-model="form.fechaInicio" type="date" />
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Precio por bandeja ($)</label>
                <input
                  v-model="form.precio_bandeja"
                  type="number"
                  placeholder="Ej: 500"
                  min="1"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Precio por kilo ($)</label>
                <input
                  v-model="form.precio_granel"
                  type="number"
                  placeholder="Ej: 300"
                  min="1"
                />
              </div>
            </div>

            <div class="notice notice-blue" style="margin-top: 14px;">
              El precio por kilo puede actualizarse semanalmente. El cambio
              afecta solo a los registros posteriores al cambio.
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

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

            <div class="notice notice-amber" style="margin-bottom: 16px;">
              Esta accion cerrara la temporada de
              <strong>{{ temporadaACerrar?.fruta }}</strong>.
              No podras registrar nuevas cosechas en ella.
            </div>

            <div class="form-group">
              <label>Fecha de inicio</label>
              <input
                :value="temporadaACerrar?.fechaInicio"
                type="text"
                disabled
              />
            </div>

            <div class="form-group">
              <label>Fecha de cierre</label>
              <input
                v-model="fechaCierre"
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                :min="temporadaACerrar?.fechaInicio"
              />
            </div>

            <p v-if="errorCierre" class="error">{{ errorCierre }}</p>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarModalCierre">Cancelar</button>
              <button class="btn-danger" @click="cerrarTemporada">Cerrar Temporada</button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando temporadas...</div>
        <div v-else-if="temporadasFiltradas.length === 0" class="vacio">
          No hay temporadas para el año {{ anioFiltro }}.
        </div>

        <!-- Tabla de temporadas -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Huerto</th>
                <th>Especie</th>
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
                <td class="fw-500">{{ nombreHuerto(temporada.huertoId) }}</td>
                <td>{{ temporada.fruta }}</td>
                <td class="text-muted">{{ temporada.anio }}</td>
                <td class="text-muted">{{ temporada.fechaInicio }}</td>
                <td class="text-muted">{{ temporada.fechaFin || '—' }}</td>
                <td>${{ temporada.precio_bandeja?.toLocaleString('es-CL') }}</td>
                <td>${{ temporada.precio_granel?.toLocaleString('es-CL') }}</td>
                <td>
                  <span
                    v-if="temporada.estado === 'activa'"
                    class="badge-green"
                  >
                    Activa
                  </span>
                  <span v-else class="badge-gray">Cerrada</span>
                </td>
                <td class="acciones">
                  <button
                    v-if="temporada.estado === 'activa'"
                    class="btn-secondary btn-sm"
                    @click="abrirCierre(temporada)"
                  >
                    Cerrar
                  </button>
                  <button
                    v-if="temporada.estado === 'cerrada'"
                    class="btn-danger btn-sm"
                    @click="eliminarTemporada(temporada.id)"
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