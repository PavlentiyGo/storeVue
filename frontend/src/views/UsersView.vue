<template>
  <div>
    <h3>Пользователи (admin)</h3>
    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <ul class="list">
      <li v-for="u in users" :key="u.id">
        <RouterLink :to="`/users/${u.id}`">
          {{ u.email }} — {{ u.first_name }} {{ u.last_name }} ({{ u.role }})
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { userService } from '../services/userService';

const users = ref([]);
const loading = ref(false);
const error = ref('');

async function loadUsers() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await userService.getAll();
    users.value = data;
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка загрузки пользователей';
  } finally {
    loading.value = false;
  }
}

onMounted(loadUsers);
</script>

<style scoped>
.error { color: red; }
.list { display: grid; gap: 8px; }
</style>