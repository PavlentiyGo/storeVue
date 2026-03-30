<template>
  <div>
    <h3>Вход</h3>
    <form @submit.prevent="submit" class="form">
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="password" placeholder="Password" type="password" required />
      <button :disabled="loading">{{ loading ? 'Входим...' : 'Войти' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { fetchMe } from '../store/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    const { data } = await authService.login({
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    await fetchMe();
    router.push('/profile');
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка входа';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
.error { color: red; margin-top: 10px; }
</style>