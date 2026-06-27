<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Huertos</h1>
          <div class="content-sub">Gestion de predios agricolas</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarFormulario = true">Nuevo Huerto</button>
        </div>
      </div>

      <div class="page">

        <!-- Modal crear huerto -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card">
            <h2>Crear Huerto</h2>
            <div class="form-group">
              <label>Nombre del huerto</label>
              <input v-model="form.nombre" type="text" placeholder="Ej: Huerto Los Aromos" />
            </div>
            <div class="form-group">
              <label>Ubicacion</label>
              <input v-model="form.ubicacion" type="text" placeholder="Ej: Parral, Chile" />
            </div>
            <p v-if="error" class="error">{{ error }}</p>
            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
              <button class="btn-primary" @click="crearHuerto">Crear</button>
            </div>
          </div>
        </div>

        <!-- Modal asignar cosechero -->
        <div v-if="mostrarAsignar" class="modal">
          <div class="modal-card">
            <h2>Asignar Cosechero</h2>
            <div class="notice notice-green" style="margin-bottom: 16px;">
              Huerto: <strong>{{ huertoSeleccionado?.nombre }}</strong>
            </div>

            <div v-if="trabajadoresDisponibles.length === 0" class="vacio">
              No hay cosecheros disponibles para asignar.
            </div>

            <div v-else class="form-group">
              <label>Selecciona un cosechero disponible</label>
              <select v-model="formAsignar.trabajadorId">
                <option value="">-- Selecciona --</option>
                <option
                  v-for="t in trabajadoresDisponibles"
                  :key="t.uid"
                  :value="t.uid"
                >
                  {{ t.nombre }} —
                  {{ t.tipo_contrato === 'con_contrato' ? 'Con contrato' : 'Sin contrato' }}
                </option>
              </select>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarAsignar">Cancelar</button>
              <button
                v-if="trabajadoresDisponibles.length > 0"
                class="btn-primary"
                @click="asignarTrabajador"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando huertos...</div>
        <div v-else-if="huertos.length === 0" class="vacio">
          No hay huertos registrados aun.
        </div>

        <!-- Tabla de huertos -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicacion</th>
                <th>Cosecheros asignados</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="huerto in huertos" :key="huerto.id">
                <td>
                  <span class="fw-500">{{ huerto.nombre }}</span>
                </td>
                <td class="text-muted">{{ huerto.ubicacion }}</td>
                <td>
                  <div
                    v-if="huerto.trabajadoresActivos && huerto.trabajadoresActivos.length > 0"
                  >
                    <span class="badge-activo" style="margin-bottom: 6px; display: inline-flex;">
                      {{ huerto.trabajadoresActivos.length }}
                      {{ huerto.trabajadoresActivos.length === 1 ? 'cosechero' : 'cosecheros' }}
                    </span>
                    <div
                      v-for="uid in huerto.trabajadoresActivos"
                      :key="uid"
                      style="margin-top: 4px;"
                    >
                      <button
                        class="btn-danger btn-xs"
                        @click="desasignarTrabajador(huerto.id, uid)"
                      >
                        Desasignar
                      </button>
                    </div>
                  </div>
                  <span v-else class="badge-gray">Sin cosecheros</span>
                </td>
                <td>
                  <span
                    v-if="huerto.trabajadoresActivos && huerto.trabajadoresActivos.length > 0"
                    class="badge-green"
                  >
                    Activo
                  </span>
                  <span v-else class="badge-gray">Libre</span>
                </td>
                <td class="acciones">
                  <button class="btn-secondary btn-sm" @click="abrirAsignar(huerto)">
                    Asignar
                  </button>
                  <button class="btn-danger btn-sm" @click="eliminarHuerto(huerto.id)">
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
import { useHuertos } from '../../composables/useHuertos';

const {
  huertos, trabajadoresDisponibles, cargando,
  mostrarFormulario, mostrarAsignar,
  huertoSeleccionado, error, form, formAsignar,
  cerrarFormulario, cerrarAsignar, abrirAsignar,
  crearHuerto, eliminarHuerto,
  asignarTrabajador, desasignarTrabajador
} = useHuertos();
</script>