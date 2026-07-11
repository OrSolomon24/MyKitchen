import { apiFetch } from './httpClient';

export const importRecipeFromLinkWithAI = ({ url, name, description, categoryIds }) =>
  apiFetch('/api/recipes/ai-import', {
    method: 'POST',
    body: JSON.stringify({ url, name, description, categoryIds }),
  });
