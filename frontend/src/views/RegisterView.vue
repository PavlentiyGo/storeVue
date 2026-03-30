<template>
  <div>
    <h3>Регистрация</h3>
    <form @submit.prevent="submit" class="form">
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="first_name" placeholder="Имя" required />
      <input v-model="last_name" placeholder="Фамилия" required />
      <input v-model="password" placeholder="Password" type="password" required />
      <button :disabled="loading">{{ loading ? 'Создаем...' : 'Зарегистрироваться' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Успешно! Теперь можно войти.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '../services/authService';

const email = ref('');
const first_name = ref('');
const last_name = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    await authService.register({
      email: email.value,
      first_name: first_name.value,
      last_name: last_name.value,
      password: password.value,
    });
    success.value = 'Регистрация выполнена';
    email.value = '';
    first_name.value = '';
    last_name.value = '';
    password.value = '';
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
.error { color: red; margin-top: 10px; }
.success { color: green; margin-top: 10px; }
</style>