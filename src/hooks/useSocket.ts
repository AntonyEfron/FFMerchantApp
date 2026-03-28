import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket } from '@/src/services/socket';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { merchantId, isAuthenticated } = useAuth();
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && merchantId && !isConnectedRef.current) {
      connectSocket(merchantId);
      isConnectedRef.current = true;
    }

    return () => {
      if (isConnectedRef.current) {
        disconnectSocket();
        isConnectedRef.current = false;
      }
    };
  }, [isAuthenticated, merchantId]);
};
