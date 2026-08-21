import { useQuery } from '@tanstack/react-query';
import { electionApi } from '../../api/electionApi';

export const useElectionQuery = (electionId = 'election-1') => {
  return useQuery({
    queryKey: ['election', electionId],
    queryFn: () => electionApi.getElection(electionId),
  });
};
