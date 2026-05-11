<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Usuarios</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">+ Nuevo Usuario</button>
      </div>

      <!-- Modal crear usuario -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Crear Usuario</h2>

          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Nombre completo" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="form.password" type="password" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="form.rol">
              <option value="dueño">Dueño de huerto</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tipo documento</label>
            <select v-model="form.tipo_documento">
              <option value="rut">RUT</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>
          <div class="form-group">
            <label>Número documento</label>
            <input v-model="form.numero_documento" type="text" placeholder="12.345.678-9" />
          </div>
          <div class="form-group">
            <label>Fecha nacimiento</label>
            <input v-model="form.fecha_nacimiento" type="date" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" type="text" placeholder="+56912345678" />
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="crearUsuario">Crear</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando usuarios...</div>
      <div v-else-if="usuarios.length === 0" class="vacio">No hay usuarios registrados aún.</div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.uid">
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.tipo_documento?.toUpperCase() }}: {{ usuario.numero_documento }}</td>
              <td>
                <span v-if="usuario.rol === 'admin'" class="badge-admin">Admin</span>
                <span v-else class="badge-dueno">Dueño</span>
              </td>
              <td>
                <button class="btn-danger" @click="eliminarUsuario(usuario.uid)">Eliminar</button>
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
import { useUsuarios } from '../../composables/useUsuarios';

const {
  usuarios, cargando, mostrarFormulario, error, form,
  cerrarFormulario, crearUsuario, eliminarUsuario
} = useUsuarios();
</script>

<style scoped>
.badge-admin {
  background-color: #caf0f8;
  color: #023e8a;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-dueno {
  background-color: #d8f3dc;
  color: #2d6a4f;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}
</style>