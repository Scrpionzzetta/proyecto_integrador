<template>
  <div class="login-container">
    <div class="login-card">

      <!-- Encabezado verde con logo -->
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 30 30" fill="none" width="30" height="30">
            <ellipse cx="15" cy="11" rx="5" ry="6" fill="#b8e0b8"/>
            <ellipse cx="9" cy="17" rx="4.5" ry="5" fill="#85c885"/>
            <ellipse cx="21" cy="17" rx="4.5" ry="5" fill="#85c885"/>
            <circle cx="15" cy="20" rx="3.5" ry="3.5" fill="rgba(255,255,255,.3)"/>
          </svg>
        </div>
        <div class="login-title">Digital en el Campo</div>
        <div class="login-sub">Gestion productiva - CFT Maule Campus Parral</div>
      </div>

      <!-- Formulario -->
      <div class="login-body">
        <div class="form-group">
          <label>Correo electronico</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="correo@ejemplo.com"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="form-group">
          <label>Contrasena</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            @keyup.enter="handleLogin"
          />
        </div>

        <p v-if="error" class="error" style="text-align:center; margin-bottom: 8px;">
          {{ error }}
        </p>

        <button
          class="login-btn"
          :disabled="cargando"
          @click="handleLogin"
        >
          {{ cargando ? 'Ingresando...' : 'Ingresar al sistema' }}
        </button>

        <div class="login-hint">
          Si olvidaste tu contrasena, contacta al administrador del sistema.
        </div>

        <div class="login-footer">
          CFT MAULE - Region del Maule - {{ new Date().getFullYear() }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
});

const error = ref('');
const cargando = ref(false);

const handleLogin = async () => {
  error.value = '';
  cargando.value = true;

  try {
    await authStore.login(form.value.email, form.value.password);
    router.push('/dashboard');
  } catch (err) {
    // Mostramos el mensaje de error que viene del backend
    error.value = err.response?.data?.error || err.message || 'Error al iniciar sesion';
  } finally {
    cargando.value = false;
  }
};
</script>