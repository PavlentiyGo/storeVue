import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService';
import { authState, fetchMe } from '../store/auth';

import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailsView from '../views/ProductDetailsView.vue';
import UsersView from '../views/UsersView.vue';
import UserEditView from '../views/UserEditView.vue';

const routes = [
  { path: '/', redirect: '/products' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/products', component: ProductsView },
  { path: '/products/:id', component: ProductDetailsView, props: true },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/users', component: UsersView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/users/:id', component: UserEditView, props: true, meta: { requiresAuth: true, roles: ['admin'] } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const isAuth = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuth) {
    return '/login';
  }

  if (isAuth && !authState.user) {
    await fetchMe();
  }

  if (to.meta.roles?.length) {
    const role = authState.user?.role;
    if (!role || !to.meta.roles.includes(role)) {
      return '/products';
    }
  }

  if ((to.path === '/login' || to.path === '/register') && isAuth) {
    return '/profile';
  }

  return true;
});

export default router;