<template>
  <div class="grid" style="gap: 16px">
    <div v-if="canManage" class="card">
      <h3 style="margin-top: 0">Добавить товар</h3>
      <form @submit.prevent="createProduct" class="form">
        <input v-model="form.title" placeholder="Название" required />
        <input v-model="form.category" placeholder="Категория" required />
        <textarea v-model="form.description" placeholder="Описание" />
        <input v-model.number="form.price" type="number" placeholder="Цена" required />
        <button class="btn">Создать</button>
      </form>
    </div>

    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div class="grid grid-products">
      <article v-for="p in products" :key="p.id" class="card product-card">
        <div class="top">
          <span class="badge">{{ p.category }}</span>
          <span class="price">{{ p.price }} ₽</span>
        </div>

        <h4 class="title">{{ p.title }}</h4>
        <p class="desc">{{ p.description || 'Без описания' }}</p>

        <RouterLink :to="`/products/${p.id}`" class="open-link">
          Открыть
        </RouterLink>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { productService } from '../services/productService';
import { authState, fetchMe } from '../store/auth';

const products = ref([]);
const loading = ref(false);
const error = ref('');

const form = reactive({
  title: '',
  category: '',
  description: '',
  price: 0,
});

const canManage = computed(() => ['admin', 'seller'].includes(authState.user?.role));

async function loadProducts() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await productService.getAll();
    products.value = data;
  } catch {
    error.value = 'Ошибка загрузки товаров';
  } finally {
    loading.value = false;
  }
}

async function createProduct() {
  try {
    await productService.create(form);
    form.title = '';
    form.category = '';
    form.description = '';
    form.price = 0;
    await loadProducts();
  } catch (e) {
    error.value = e.response?.data?.message || 'Ошибка создания товара';
  }
}

onMounted(async () => {
  if (!authState.user && localStorage.getItem('accessToken')) await fetchMe();
  await loadProducts();
});
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge {
  border: 1px solid #2a3244;
  background: #161a22;
  color: #b7c1d1;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
}
.price {
  font-weight: 700;
  color: #87aaff;
}
.title {
  margin: 0;
}
.desc {
  margin: 0;
  color: #9aa4b2;
  min-height: 40px;
}
.open-link {
  margin-top: auto;
  width: fit-content;
  border: 1px solid #2a3244;
  padding: 8px 10px;
  border-radius: 10px;
  background: #161a22;
}
</style>