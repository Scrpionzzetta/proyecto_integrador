<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Compradores</h1>
          <div class="content-sub">Empresas y personas que adquieren la produccion</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarFormulario = true">
            Nuevo Comprador
          </button>
        </div>
      </div>

      <div class="page">

        <!-- Modal crear comprador -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card">
            <h2>Agregar Comprador</h2>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Nombre</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  placeholder="Ej: Frutas del Sur SpA"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Tipo</label>
                <select v-model="form.tipo">
                  <option value="empresa">Empresa</option>
                  <option value="persona">Persona</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Telefono (opcional)</label>
                <input
                  v-model="form.telefono"
                  type="text"
                  placeholder="+56912345678"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Email (opcional)</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="contacto@empresa.cl"
                />
              </div>
            </div>

            <div class="notice notice-blue" style="margin-top: 4px;">
              Los compradores registrados apareceran disponibles al registrar
              una nueva venta.
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
              <button class="btn-primary" @click="crearComprador">Guardar</button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando compradores...</div>
        <div v-else-if="compradores.length === 0" class="vacio">
          No hay compradores registrados aun.
        </div>

        <!-- Tabla de compradores -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comprador in compradores" :key="comprador.id">
                <td class="fw-500">{{ comprador.nombre }}</td>
                <td>
                  <span
                    v-if="comprador.tipo === 'empresa'"
                    class="badge-blue"
                  >
                    Empresa
                  </span>
                  <span v-else class="badge-gray">Persona</span>
                </td>
                <td class="text-muted">{{ comprador.telefono || '—' }}</td>
                <td class="text-muted">{{ comprador.email || '—' }}</td>
                <td>
                  <button
                    class="btn-danger btn-sm"
                    @click="eliminarComprador(comprador.id)"
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
import { useCompradores } from '../../composables/useCompradores';

const {
  compradores, cargando, mostrarFormulario, error, form,
  cerrarFormulario, crearComprador, eliminarComprador
} = useCompradores();
</script>