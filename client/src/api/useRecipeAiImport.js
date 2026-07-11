import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importRecipeFromLinkWithAI } from './recipes';
import { queryKeys } from './queryKeys';

export function useImportRecipeFromLinkWithAI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => importRecipeFromLinkWithAI(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes });
    },
  });
}
