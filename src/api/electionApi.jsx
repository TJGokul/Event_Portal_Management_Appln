import axiosClient from './axiosClient';

export const electionApi = {
  getElection: (id) => axiosClient.get(`/api/elections/${id}`),
};
