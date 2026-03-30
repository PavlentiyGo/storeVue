<template>
  <div>
    <p><RouterLink to="/users">← Назад</RouterLink></p>
    <h3>Редактирование пользователя</h3>

    <p v-if="loading">Загрузка...</p>
    <div v-else-if="user">
      <p><b>Email:</b> {{ user.email }}</p>

      <form @submit.prevent="save" class="form">
        <input v-model="form.first_name" placeholder="Имя" />
        <input v-model="form.last_name" placeholder="Фамилия" />
        <select v-model="form.role">
          <option value="user">user</option>
          <option value="seller">seller</option>
          <option value="admin">admin</option>
        </select>
        <button>Сохранить</button>
      </form>

      <button class="danger" @click="removeUser">Удалить</button>
      <p v-if="message" class="ok">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { userService } from '../services/userService';

const route = useRoute();
const router = useRouter();

const user = ref(null);
const loading = ref(false);
const error = ref('');
const message = ref('');

const form = reactive({
  first_name: '',
  last_name: '',
  role: 'user',
});

async function loadUser() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await userService.getById(route.params.id);
    user.value = data;
    form.first_name = data.first_name;
    form.last_name = data.last_name;
    form.role = data.role;
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка загрузки пользователя';
  } finally {
    loading.value = false;
  }
}

async function save() {
  error.value = '';
  message.value = '';
  try {
    await userService.update(route.params.id, form);
    message.value = 'Сохранено';
    await loadUser();
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка сохранения';
  }
}

async function removeUser() {
  if (!confirm('Удалить пользователя?')) return;
  try {
    await userService.remove(route.params.id);
    router.push('/users');
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка удаления';
  }
}

onMounted(loadUser);
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 8px; max-width: 420px; margin: 10px 0; }
.error { color: red; }
.ok { color: green; }
.danger { background: #c62828; color: #fff; border: none; padding: 8px 12px; cursor: pointer; }
</style>