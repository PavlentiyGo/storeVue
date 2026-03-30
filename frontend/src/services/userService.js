import api from '../api/client';

export const userService = {
  getAll() {
    return api.get('/users');
  },
  getById(id) {
    return api.get(`/users/${id}`);
  },
  update(id, payload) {
    return api.put(`/users/${id}`, payload);
  },
  remove(id) {
    return api.delete(`/users/${id}`);
  },
};