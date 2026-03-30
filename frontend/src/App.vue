<template>
  <div class="container">
    <header class="header card">
      <div class="brand">
        <h2>Магазин</h2>
      </div>

      <nav class="nav">
        <RouterLink to="/products">Товары</RouterLink>

        <RouterLink v-if="isAuth" to="/profile" class="cabinet-link">
          Личный кабинет
        </RouterLink>

        <RouterLink v-if="isAdmin" to="/users">Пользователи</RouterLink>

        <!-- Гость -->
        <RouterLink v-if="!isAuth" to="/login">Войти</RouterLink>
        <RouterLink v-if="!isAuth" to="/register">Регистрация</RouterLink>

        <!-- Авторизован -->
        <button v-if="isAuth" @click="onLogout" class="btn-danger logout-btn">
          Выйти
        </button>
      </nav>
    </header>

    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { authService } from './services/authService';
import { authState, fetchMe, logout } from './store/auth';

const router = useRouter();

onMounted(async () => {
  if (authService.isAuthenticated()) {
    await fetchMe();
  } else {
    authState.user = null;
  }
});

// ВАЖНО: реактивная проверка
const isAuth = computed(() => !!authState.user);
const isAdmin = computed(() => authState.user?.role === 'admin');

function onLogout() {
  logout();
  router.push('/login');
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}
.brand h2 { margin: 0; }
.muted { color: #9aa4b2; font-size: 13px; }
.nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.cabinet-link {
  padding: 8px 12px;
  border: 1px solid #2a3244;
  border-radius: 10px;
  background: #161a22;
}
.logout-btn {
  width: auto;
  padding: 8px 12px;
}
.page { margin-top: 16px; }
</style>