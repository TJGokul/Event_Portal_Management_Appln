import axiosClient from './axiosClient';

export const voteApi = {
  castVote: (categoryId, candidateId) => axiosClient.post('/api/votes', { categoryId, candidateId }),
  getReceipt: (id) => axiosClient.get(`/api/receipts/${id}`),
  getVoterStatus: () => axiosClient.get('/api/voter/status'),
};
