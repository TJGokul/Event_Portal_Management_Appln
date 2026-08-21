import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../../api/managerApi';

export const useCreateCandidateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateData) => managerApi.createCandidate(candidateData),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['candidates'] });
        queryClient.invalidateQueries({ queryKey: ['tally'] });
      }
    },
  });
};

export const useUpdateCandidateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, candidateData }) => managerApi.updateCandidate(id, candidateData),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['candidates'] });
        queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['tally'] });
      }
    },
  });
};

export const useDeleteCandidateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => managerApi.deleteCandidate(id),
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['candidates'] });
        queryClient.invalidateQueries({ queryKey: ['candidate', id] });
        queryClient.invalidateQueries({ queryKey: ['tally'] });
      }
    },
  });
};
