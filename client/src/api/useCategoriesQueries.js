import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, addCategory, deleteCategory } from './categories';
import { queryKeys } from './queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}

export function useAddCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name) => addCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}
