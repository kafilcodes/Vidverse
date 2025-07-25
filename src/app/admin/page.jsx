'use client';

import React, { useState } from 'react';
import AdminPanel from '@/components/AdminPanel';
import AdminAuth from '@/components/AdminAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {!isAuthenticated ? (
        <AdminAuth onAuthenticated={setIsAuthenticated} />
      ) : (
        <AdminPanel />
      )}
    </QueryClientProvider>
  );
};

export default AdminPage;
