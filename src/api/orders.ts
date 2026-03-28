import apiClient from './client';
import type { Order } from '@/src/types';

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await apiClient.get('/merchant/getAllOrders');
  return res.data.orders;
};

export const acceptOrRejectOrder = async (
  orderId: string,
  status: string,
  reason: string
) => {
  const res = await apiClient.put(
    `merchant/orderRequestForMerchant/${orderId}`,
    { status, reason }
  );
  return res.data;
};

export const fetchPlacedOrders = async () => {
  const res = await apiClient.get('merchant/getPlacedOrder');
  return res.data;
};

export const packOrder = async (orderId: string) => {
  const res = await apiClient.post(`merchant/order/packed/${orderId}`);
  return res.data;
};
