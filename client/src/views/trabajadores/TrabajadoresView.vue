<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">

      <div class="content-header">
        <div>
          <h1>Cosecheros</h1>
          <div class="content-sub">Gestion de temporeros y trabajadores del campo</div>
        </div>
        <div class="content-actions">
          <button class="btn-primary" @click="mostrarFormulario = true">Nuevo Cosechero</button>
        </div>
      </div>

      <div class="page">

        <!-- Pestanas -->
        <div class="tabs">
          <button :class="['tab', { active: pestanaActiva === 'mis-trabajadores' }]"
            @click="pestanaActiva = 'mis-trabajadores'">
            Mis Cosecheros ({{ misTrabajadores?.length ?? 0 }})
          </button>
          <button :class="['tab', { active: pestanaActiva === 'libres' }]" @click="pestanaActiva = 'libres'">
            Cosecheros Disponibles ({{ trabajadoresLibres?.length ?? 0 }})
          </button>
        </div>

        <!-- Modal registrar cosechero -->
        <div v-if="mostrarFormulario" class="modal">
          <div class="modal-card">
            <h2>Registrar Cosechero</h2>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Nombre completo</label>
                <input v-model="form.nombre" type="text" placeholder="Nombre y apellidos" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Telefono</label>
                <input v-model="form.telefono" type="text" placeholder="+56912345678" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Email</label>
                <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Contrasena</label>
                <input v-model="form.password" type="password" placeholder="••••••••" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Tipo documento</label>
                <select v-model="form.tipo_documento">
                  <option value="rut">RUT</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Numero documento</label>
                <input v-model="form.numero_documento" type="text" placeholder="12.345.678-9" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Fecha nacimiento</label>
                <input v-model="form.fecha_nacimiento" type="date" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Nacionalidad</label>
                <select v-model="form.nacionalidad">
                  <option value="chileno">Chileno</option>
                  <option value="extranjero">Extranjero</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Tipo contrato</label>
              <select v-model="form.tipo_contrato">
                <option value="con_contrato">Con contrato</option>
                <option value="sin_contrato">Sin contrato</option>
              </select>
            </div>

            <div class="notice notice-blue">
              El cosechero no tendra acceso al sistema web. Sus credenciales
              son solo para identificacion interna.
            </div>

            <p v-if="error" class="error" style="margin-top: 10px;">{{ error }}</p>

            <div class="modal-actions">
              <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
              <button class="btn-primary" @click="crearTrabajador">Registrar</button>
            </div>
          </div>
        </div>

        <!-- Modal ficha cosechero -->
        <div v-if="fichaSeleccionada" class="modal">
          <div class="modal-card">
            <h2>Ficha del Cosechero</h2>

            <div class="grid-2" style="margin-bottom: 16px;">
              <div>
                <div class="stat-row">
                  <span class="stat-label">Nombre</span>
                  <span class="stat-val">{{ fichaSeleccionada.trabajador.nombre }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Email</span>
                  <span class="stat-val text-sm">{{ fichaSeleccionada.trabajador.email }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Documento</span>
                  <span class="stat-val">{{ fichaSeleccionada.trabajador.numero_documento }}</span>
                </div>
              </div>
              <div>
                <div class="stat-row">
                  <span class="stat-label">Nacionalidad</span>
                  <span class="stat-val">{{ fichaSeleccionada.trabajador.nacionalidad }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Contrato</span>
                  <span :class="fichaSeleccionada.trabajador.tipo_contrato === 'con_contrato'
                    ? 'badge-blue' : 'badge-amber'">
                    {{ fichaSeleccionada.trabajador.tipo_contrato === 'con_contrato'
                      ? 'Con contrato' : 'Sin contrato' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="sep"></div>
            <h3 style="margin-bottom: 12px;">Estadisticas de produccion</h3>

            <div class="grid-4" style="margin-bottom: 0;">
              <div class="metric metric-bottom">
                <div class="metric-label">Recolecciones</div>
                <div class="metric-value color-green" style="font-size: 20px;">
                  {{ fichaSeleccionada.estadisticas.totalRecolecciones }}
                </div>
              </div>
              <div class="metric metric-bottom">
                <div class="metric-label">Total bandejas</div>
                <div class="metric-value color-blue" style="font-size: 20px;">
                  {{ fichaSeleccionada.estadisticas.totalBandejas }}
                </div>
              </div>
              <div class="metric metric-bottom">
                <div class="metric-label">Total kilos</div>
                <div class="metric-value color-amber" style="font-size: 20px;">
                  {{ fichaSeleccionada.estadisticas.totalKilos }}
                </div>
              </div>
              <div class="metric metric-bottom">
                <div class="metric-label">Total recibido</div>
                <div class="metric-value" style="font-size: 18px; color: var(--purple);">
                  ${{ fichaSeleccionada.estadisticas.totalRecibido?.toLocaleString('es-CL') }}
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" @click="fichaSeleccionada = null">Cerrar</button>
            </div>
          </div>
        </div>

        <div v-if="cargando" class="cargando">Cargando cosecheros...</div>

        <!-- Pestana Mis Cosecheros -->
        <div v-else-if="pestanaActiva === 'mis-trabajadores'">
          <div v-if="misTrabajadores.length === 0" class="vacio">
            No tienes cosecheros asignados a tus huertos aun.
          </div>
          <div v-else class="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Nacionalidad</th>
                  <th>Contrato</th>
                  <th>Huerto asignado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trabajador in misTrabajadores" :key="trabajador.uid">
                  <td class="fw-500">{{ trabajador.nombre }}</td>
                  <td class="text-muted text-sm">
                    {{ trabajador.tipo_documento?.toUpperCase() }}:
                    {{ trabajador.numero_documento }}
                  </td>
                  <td>{{ trabajador.nacionalidad }}</td>
                  <td>
                    <span v-if="trabajador.tipo_contrato === 'con_contrato'" class="badge-blue">
                      Con contrato
                    </span>
                    <span v-else class="badge-amber">Sin contrato</span>
                  </td>
                  <td>
                    <span v-for="huerto in trabajador.huertos" :key="huerto.huertoId" class="badge-green"
                      style="display: block; margin-bottom: 3px;">
                      {{ huerto.huertoNombre }}
                    </span>
                  </td>
                  <td class="acciones">
                    <button class="btn-secondary btn-sm" @click="verFicha(trabajador.uid)">
                      Ver ficha
                    </button>
                    <button class="btn-danger btn-sm" @click="desactivarTrabajador(trabajador.uid)">
                      Desactivar
                    </button>
                    <button v-if="authStore.esAdmin" class="btn-danger btn-sm"
                      @click="eliminarTrabajador(trabajador.uid)">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pestana Cosecheros Disponibles -->
        <div v-else-if="pestanaActiva === 'libres'">
          <div v-if="trabajadoresLibres.length === 0" class="vacio">
            No hay cosecheros disponibles en este momento.
          </div>
          <div v-else class="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Nacionalidad</th>
                  <th>Contrato</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trabajador in trabajadoresLibres" :key="trabajador.uid">
                  <td class="fw-500">{{ trabajador.nombre }}</td>
                  <td class="text-muted text-sm">
                    {{ trabajador.tipo_documento?.toUpperCase() }}:
                    {{ trabajador.numero_documento }}
                  </td>
                  <td>{{ trabajador.nacionalidad }}</td>
                  <td>
                    <span v-if="trabajador.tipo_contrato === 'con_contrato'" class="badge-blue">
                      Con contrato
                    </span>
                    <span v-else class="badge-amber">Sin contrato</span>
                  </td>
                  <td class="acciones">
                    <button class="btn-secondary btn-sm" @click="verFicha(trabajador.uid)">
                      Ver ficha
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useTrabajadores } from '../../composables/useTrabajadores';

const {
  misTrabajadores, trabajadoresLibres, cargando,
  mostrarFormulario, fichaSeleccionada, error, form,
  pestanaActiva, cerrarFormulario, crearTrabajador,
  verFicha, eliminarTrabajador, desactivarTrabajador,
  authStore
} = useTrabajadores();
</script>