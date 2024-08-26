// utils/dishUtils.js

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchDishById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/api/food/dish/${id}`);
    if (!response.ok) throw new Error('Failed to fetch dish');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw error;
  }
};

export const updateDish = async (dish) => {
  try {
    const response = await fetch(`${apiUrl}/api/food/dish/${dish._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish),
    });
    if (!response.ok) throw new Error('Failed to update dish');
    return await response.json();
  } catch (error) {
    console.error('Error updating dish:', error);
    throw error;
  }
};

export const deleteDish = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/api/food/dish/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete dish');
    return true;
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw error;
  }
};

export const checkIfProxyIsNeeded = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
    });

    const xFrameOptions = response.headers.get('x-frame-options');
    const contentSecurityPolicy = response.headers.get('content-security-policy');

    return !!(xFrameOptions || contentSecurityPolicy);
  } catch (error) {
    console.error('Error checking if proxy is needed:', error);
    return true; // Assume proxy is needed if the fetch fails
  }
};
