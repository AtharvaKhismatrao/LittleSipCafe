import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function fetchMenu() {
  const { data } = await api.get('/menu');
  return data;
}

export async function postReservation(payload) {
  const { data } = await api.post('/reservations', payload);
  return data;
}

export async function fetchReviews() {
  const { data } = await api.get('/reviews');
  return data;
}

export async function postReview(payload) {
  const { data } = await api.post('/reviews', payload);
  return data;
}

export async function postOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data;
}

export async function adminLogin(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/users/login', payload);
  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post('/users/register', payload);
  return data;
}

export async function fetchCurrentUser(token) {
  const { data } = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function fetchAdminReservations() {
  const { data } = await api.get('/reservations');
  return data;
}

export async function fetchAdminOrders() {
  const { data } = await api.get('/orders');
  return data;
}

export async function createMenuItem(payload) {
  const { data } = await api.post('/menu', payload);
  return data;
}

export async function updateMenuItem(id, payload) {
  const { data } = await api.put(`/menu/${id}`, payload);
  return data;
}

export async function deleteMenuItem(id) {
  const { data } = await api.delete(`/menu/${id}`);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
}
