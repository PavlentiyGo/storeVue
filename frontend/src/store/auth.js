import { reactive } from 'vue';
import { authService } from '../services/authService';

export const authState = reactive({
  user: null,
  loading: false,
});

export async function fetchMe() {
  if (!authService.isAuthenticated()) {
    authState.user = null;
    return null;
  }

  authState.loading = true;
  try {
    const { data } = await authService.me();
    authState.user = data;
    return data;
  } catch (e) {
    authState.user = null;
    authService.logout();
    return null;
  } finally {
    authState.loading = false;
  }
}

export function logout() {
  authService.logout();
  authState.user = null;
}