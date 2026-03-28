import apiClient from './client';
import type { AnalyticsResponse, WalletResponse } from '@/src/types';

export const getMerchantAnalytics = async (
  startDate?: string,
  endDate?: string
): Promise<AnalyticsResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await apiClient.get(
    `merchant/analytics?${params.toString()}`
  );
  return res.data;
};

export const getMerchantWallet = async (): Promise<WalletResponse> => {
  const res = await apiClient.get('merchant/wallet');
  return res.data;
};
