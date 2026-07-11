import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchDishes,
  fetchDishById,
  addRecipe,
  updateDish,
  deleteDish,
  uploadDishImage,
  deleteDishImage,
} from './dishes';
import { queryKeys } from './queryKeys';

export function useDishes() {
  return useQuery({
    queryKey: queryKeys.dishes,
    queryFn: fetchDishes,
  });
}

export function useDish(id, { placeholderData } = {}) {
  // placeholderData (not initialData): the dish handed via navigation state
  // comes from the trimmed list endpoint (no ingredients/steps), so it must
  // never be treated as a fresh cache value -- a real fetch always has to
  // follow to fill in the fields the list view doesn't carry.
  return useQuery({
    queryKey: queryKeys.dish(id),
    queryFn: () => fetchDishById(id),
    enabled: !!id,
    placeholderData,
  });
}

export function useAddRecipeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ recipeData, categoryIds, images = [] }) => {
      const newDish = await addRecipe(recipeData, categoryIds);
      if (images.length === 0) return newDish;

      const uploads = await Promise.all(images.map((file) => uploadDishImage(newDish.id, file)));
      return uploads[uploads.length - 1] ?? newDish;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes });
    },
  });
}

export function useUpdateDishMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dish) => updateDish(dish),
    onSuccess: (updatedDish) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes });
      queryClient.invalidateQueries({ queryKey: queryKeys.dish(updatedDish.id) });
    },
  });
}

export function useDeleteDishMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDish(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes });
      queryClient.removeQueries({ queryKey: queryKeys.dish(id) });
    },
  });
}

export function useUploadDishImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, file }) => uploadDishImage(dishId, file),
    onSuccess: (updatedDish) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes });
      queryClient.invalidateQueries({ queryKey: queryKeys.dish(updatedDish.id) });
    },
  });
}

export function useDeleteDishImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, imageId }) => deleteDishImage(dishId, imageId),
    onSuccess: (updatedDish) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes });
      queryClient.invalidateQueries({ queryKey: queryKeys.dish(updatedDish.id) });
    },
  });
}
