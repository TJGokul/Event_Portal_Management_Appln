import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../../api/managerApi';

export const useTallyQuery = (electionId = 'election-1', categoryId = null, isOpen = false) => {
  return useQuery({
    queryKey: categoryId ? ['tally', electionId, categoryId] : ['tally', electionId],
    queryFn: async () => {
      const response = await managerApi.getLiveTally(electionId);
      if (categoryId && response.success) {
        // If categoryId is specified, extract just the tally for that category
        const tally = response.data.tallies.find(t => t.categoryId === categoryId);
        return {
          ...response,
          data: {
            ...response.data,
            tally
          }
        };
      }
      return response;
    },
    // Poll the server every 3 seconds for updates if voting is open
    refetchInterval: isOpen ? 3000 : false,
    refetchIntervalInBackground: false,
  });
};
