<template>
  <div>
    <p><RouterLink to="/products">← Назад</RouterLink></p>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="product">
      <h3>{{ product.title }}</h3>
      <p><b>Категория:</b> {{ product.category }}</p>
      <p><b>Описание:</b> {{ product.description }}</p>
      <p><b>Цена:</b> {{ product.price }} ₽</p>

      <div v-if="canEdit" class="card">
        <h4>Редактировать</h4>
        <form @submit.prevent="updateProduct" class="form">
          <input v-model="editForm.title" required />
          <input v-model="editForm.category" required />
          <textarea v-model="editForm.description" />
          <input v-model.number="editForm.price" type="number" required />
          <button>Сохранить</button>
        </form>
      </div>

      <button v-if="canDelete" @click="deleteProduct" class="danger">Удалить</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { productService } from '../services/productService';
import { authState, fetchMe } from '../store/auth';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(false);
const error = ref('');

const editForm = reactive({
  title: '',
  category: '',
  description: '',
  price: 0,
});

const canEdit = computed(() => ['admin', 'seller'].includes(authState.user?.role));
const canDelete = computed(() => authState.user?.role === 'admin');

async function loadProduct() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await productService.getById(route.params.id);
    product.value = data;
    editForm.title = data.title;
    editForm.category = data.category;
    editForm.description = data.description;
    editForm.price = data.price;
  } catch (e) {
    error.value = 'Ошибка загрузки товара';
  } finally {
    loading.value = false;
  }
}

async function updateProduct() {
  try {
    await productService.update(route.params.id, editForm);
    await loadProduct();
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка обновления';
  }
}

async function deleteProduct() {
  if (!confirm('Удалить товар?')) return;
  try {
    await productService.remove(route.params.id);
    router.push('/products');
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка удаления';
  }
}

onMounted(async () => {
  if (!authState.user && localStorage.getItem('accessToken')) {
    await fetchMe();
  }
  await loadProduct();
});
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 8px; max-width: 420px; }
.card { margin-top: 14px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
.error { color: red; }
.danger { margin-top: 12px; background: #c62828; color: white; border: none; padding: 8px 12px; cursor: pointer; }
</style>