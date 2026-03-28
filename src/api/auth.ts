import apiClient from './client';
import type { LoginResponse, Merchant } from '@/src/types';

// 📧 Send OTP to email
export const sendEmailOtp = async (data: {
  email: string;
  phoneNumber?: string;
  password?: string;
}) => {
  const res = await apiClient.post('merchant/auth/send-email-otp', data);
  return res.data;
};

// 📧 Verify OTP
export const verifyEmailOtp = async (data: { email: string; otp: string }) => {
  const res = await apiClient.post('merchant/auth/verify-email-otp', data);
  return res.data;
};

// Register merchant
export const registerMerchant = async (data: {
  identifier: string;
  password: string;
  shopName?: string;
}) => {
  const res = await apiClient.post('merchant/register', data);
  return res.data;
};

// Login
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await apiClient.post('merchant/login', {
    identifier: email,
    password,
  });
  return {
    merchant: res.data?.merchant,
    token: res.data?.token,
  };
};

// Get current merchant
export const getMerchantById = async (): Promise<Merchant> => {
  const res = await apiClient.get('merchant/getMerchant');
  return res.data.merchant;
};

// Update shop details
export const updateMerchantShopDetails = async (
  merchantId: string,
  data: FormData
) => {
  const res = await apiClient.put(
    `merchant/${merchantId}/shop-details`,
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};

// Update bank details
export const updateMerchantBankDetails = async (
  merchantId: string,
  data: any
) => {
  const res = await apiClient.put(`/merchant/${merchantId}/bank-details`, data);
  return res.data;
};

// Update operating hours
export const updateMerchantOperatingHours = async (
  merchantId: string,
  data: any
) => {
  const res = await apiClient.put(
    `merchant/${merchantId}/operating-hours`,
    data
  );
  return res.data;
};

// Activate merchant
export const activateMerchant = async (merchantId: string) => {
  const res = await apiClient.put(`merchant/${merchantId}/activate`);
  return res.data;
};

// Get merchant zone
export const getMerchantZone = async () => {
  const res = await apiClient.get('merchant/zone');
  return res.data;
};
