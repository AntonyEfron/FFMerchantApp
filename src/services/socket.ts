import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '@/src/store/notificationStore';
import type { Order } from '@/src/types';

const SOCKET_URL = 'https://ff-api-web-2.onrender.com';

let socket: Socket | null = null;
let isConnected = false;

export const connectSocket = (merchantId: string) => {
  // Prevent duplicate connection
  if (isConnected && socket) {
    console.log('⚡ Socket already connected:', socket.id);
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    query: { merchantId, role: 'merchant' },
  });

  socket.removeAllListeners('connect');
  socket.on('connect', () => {
    isConnected = true;
    console.log('✅ Connected to socket:', socket?.id);
    socket?.emit('registerMerchant', merchantId);
  });

  socket.removeAllListeners('disconnect');
  socket.on('disconnect', () => {
    isConnected = false;
    console.log('❌ Disconnected from socket');
  });

  // Clear old listeners before attaching new ones
  socket.removeAllListeners('orderUpdate');
  socket.removeAllListeners('newOrder');

  socket.on('orderUpdate', (_order: Order) => {
    // Order updates can trigger re-fetch in the orders screen
    console.log('📦 Order update received');
  });

  socket.on('newOrder', (orderData: Order) => {
    console.log('📩 Received new order:', orderData._id);
    const { addOrder } = useNotificationStore.getState();
    addOrder(orderData);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
    console.log('🔌 Socket disconnected manually');
  }
};
