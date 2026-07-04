import api from './axios';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const getMe = () =>
  api.get('/auth/me');

export const changePassword = (currentPassword, newPassword) =>
  api.put('/auth/change-password', { currentPassword, newPassword });

export const deleteAccount = () =>
  api.delete("/auth/delete");