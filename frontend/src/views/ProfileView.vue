<template>
  <div class="card">
    <h3 style="margin-top: 0">Личный кабинет</h3>
    <p v-if="loading">Загрузка...</p>
    <div v-else-if="user" class="grid" style="gap: 8px">
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Имя:</b> {{ user.first_name }}</p>
      <p><b>Фамилия:</b> {{ user.last_name }}</p>
      <p><b>Роль:</b> {{ user.role }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { authState, fetchMe } from '../store/auth';

onMounted(async () => {
  if (!authState.user) await fetchMe();
});

const user = computed(() => authState.user);
const loading = computed(() => authState.loading);
</script>