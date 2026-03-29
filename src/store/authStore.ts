import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface Merchant {
  id: string;
  shopName: string;
  email: string;
  phoneNumber: string;
  [key: string]: any;
}

interface AuthState {
  merchant: Merchant | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnline: boolean;

  login: (merchant: Merchant, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  setMerchant: (merchant: Merchant) => void;
  setOnline: (status: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  merchant: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isOnline: false,

  login: async (merchant, token) => {
    try {
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('merchant', JSON.stringify(merchant));
      await SecureStore.setItemAsync('merchant_id', merchant.id);
    } catch (e) {
      console.error('Failed to save auth data:', e);
    }
    set({
      merchant,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('merchant');
      await SecureStore.deleteItemAsync('merchant_id');
      await SecureStore.deleteItemAsync('isOnline');
    } catch (e) {
      console.error('Failed to clear auth data:', e);
    }
    set({
      merchant: null,
      token: null,
      isAuthenticated: false,
      isOnline: false,
      isLoading: false,
    });
  },

  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const merchantStr = await SecureStore.getItemAsync('merchant');
      const isOnlineStr = await SecureStore.getItemAsync('isOnline');

      if (token && merchantStr) {
        const merchant = JSON.parse(merchantStr) as Merchant;
        set({
          merchant,
          token,
          isAuthenticated: true,
          isOnline: isOnlineStr === 'true',
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load auth data:', e);
      set({ isLoading: false });
    }
  },

  setMerchant: (merchant) => set({ merchant }),
  setOnline: async (status: boolean) => {
    try {
      await SecureStore.setItemAsync('isOnline', String(status));
    } catch (e) {
      console.error('Failed to save online status:', e);
    }
    set({ isOnline: status });
  },
}));
