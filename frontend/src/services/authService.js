import api from '../api/client';

export const authService = {
  register(payload) {
    return api.post('/auth/register', payload);
  },

  login(payload) {
    return api.post('/auth/login', payload);
  },

  me() {
    return api.get('/auth/me');
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};