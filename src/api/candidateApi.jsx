import axiosClient from './axiosClient';

export const candidateApi = {
  getCandidatesForCategory: (categoryId) => axiosClient.get(`/api/categories/${categoryId}/candidates`),
  getCandidate: (id) => axiosClient.get(`/api/candidates/${id}`),
};
