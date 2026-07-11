import { apiFetch } from './httpClient';

export const fetchCategories = () => apiFetch('/api/food/category');

export const addCategory = (name) =>
  apiFetch('/api/food/category', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

export const deleteCategory = (categoryId) =>
  apiFetch(`/api/food/category/${categoryId}`, { method: 'DELETE' });
