import { apiFetch } from './httpClient';

export const fetchDishes = () => apiFetch('/api/food/dish');

export const fetchDishById = (id) => apiFetch(`/api/food/dish/${id}`);

export const addRecipe = (recipeData, categoryIds) =>
  apiFetch('/api/food/dish', {
    method: 'POST',
    body: JSON.stringify({ ...recipeData, categoryIds }),
  });

export const updateDish = (dish) =>
  apiFetch(`/api/food/dish/${dish.id}`, {
    method: 'PATCH',
    body: JSON.stringify(dish),
  });

export const deleteDish = (id) => apiFetch(`/api/food/dish/${id}`, { method: 'DELETE' });

export const uploadDishImage = (dishId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  return apiFetch(`/api/food/dish/${dishId}/images`, { method: 'POST', body: formData });
};

export const deleteDishImage = (dishId, imageId) =>
  apiFetch(`/api/food/dish/${dishId}/images/${imageId}`, { method: 'DELETE' });

export const checkIfProxyIsNeeded = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const xFrameOptions = response.headers.get('x-frame-options');
    const contentSecurityPolicy = response.headers.get('content-security-policy');
    return !!(xFrameOptions || contentSecurityPolicy);
  } catch (error) {
    console.error('Error checking if proxy is needed:', error);
    return true; // Assume proxy is needed if the fetch fails
  }
};
