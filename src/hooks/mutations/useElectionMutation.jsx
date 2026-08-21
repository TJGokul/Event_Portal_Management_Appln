import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../api/managerApi';

export const useElectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ electionId, status }) => managerApi.toggleVotingStatus(electionId, status),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['election'] });
        queryClient.invalidateQueries({ queryKey: ['tally'] });
      }
    },
  });
};
