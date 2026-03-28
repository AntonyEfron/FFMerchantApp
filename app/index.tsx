import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';

export default function Index() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
