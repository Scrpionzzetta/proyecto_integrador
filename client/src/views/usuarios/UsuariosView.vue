<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Gestion de Productores</h1>
          <div class="content-sub">
            Creacion y administracion de cuentas de acceso a la plataforma
          </div>
        </div>
        <div class="content-actions">
          <button class="btn-admin" @click="mostrarFormulario = true">
            Nuevo Productor
          </button>
        </div>
      </div>

      <div class="page">

        <!-- Modal crear productor -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card" style="border: 1.5px solid #c4b5fd;">

            <div
              style="background: var(--purple-l); margin: -24px -28px 20px; padding: 16px 28px; border-radius: var(--radius-lg) var(--radius-lg) 0 0;"
            >
              <h2 style="color: var(--purple);">Nuevo Productor</h2>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Nombre completo</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  placeholder="Nombre y apellidos"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Tipo documento</label>
                <select v-model="form.tipo_documento">
                  <option value="rut">RUT</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Numero documento</label>
                <input
                  v-model="form.numero_documento"
                  type="text"
                  placeholder="12.345.678-9"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Fecha nacimiento</label>
                <input v-model="form.fecha_nacimiento" type="date" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Correo electronico</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Telefono (opcional)</label>
                <input
                  v-model="form.telefono"
                  type="text"
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Contrasena inicial</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Minimo 6 caracteres"
              />
            </div>

            <div class="notice notice-purple">
              Solo el Administrador puede crear cuentas. Las credenciales deben
              entregarse personalmente al productor.
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
              <button class="btn-admin" @click="crearUsuario">Crear cuenta</button>
            </div>
          </div>
        </div>

        <!-- Estado cargando / vacio -->
        <div v-if="cargando" class="cargando">Cargando productores...</div>
        <div v-else-if="usuarios.length === 0" class="vacio">
          No hay productores registrados aun.
        </div>

        <!-- Tabla de productores -->
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT / Documento</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.uid">
                <td>
                  <div class="fw-500">{{ usuario.nombre }}</div>
                </td>
                <td class="text-muted text-sm">
                  {{ usuario.tipo_documento?.toUpperCase() }}:
                  {{ usuario.numero_documento }}
                </td>
                <td class="text-muted text-sm">{{ usuario.email }}</td>
                <td>
                  <span
                    v-if="usuario.activo !== false"
                    class="badge-green"
                  >
                    Activo
                  </span>
                  <span v-else class="badge-red">Inactivo</span>
                </td>
                <td class="acciones">
                  <!-- Desactivar productor activo (RF03) -->
                  <button
                    v-if="usuario.activo !== false"
                    class="btn-secondary btn-sm"
                    @click="desactivarUsuario(usuario.uid)"
                  >
                    Desactivar
                  </button>
                  <!-- Reactivar productor inactivo (RF03) -->
                  <button
                    v-else
                    class="btn-info btn-sm"
                    @click="activarUsuario(usuario.uid)"
                  >
                    Activar
                  </button>
                  <!-- Eliminar cuenta completa -->
                  <button
                    class="btn-danger btn-sm"
                    @click="eliminarUsuario(usuario.uid)"
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
import { useUsuarios } from '../../composables/useUsuarios';

const {
  usuarios, cargando, mostrarFormulario, error, form,
  cerrarFormulario, crearUsuario,
  desactivarUsuario, activarUsuario, eliminarUsuario
} = useUsuarios();
</script>