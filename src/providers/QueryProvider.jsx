import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure a global QueryClient with robust default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, // Turn off automatic retries to see immediate mock backend failures
      staleTime: 5000, // Cache is fresh for 5 seconds
    },
  },
});

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
