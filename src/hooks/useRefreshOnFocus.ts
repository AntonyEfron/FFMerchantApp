import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

export const useRefreshOnFocus = (refetch: () => void) => {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
};
