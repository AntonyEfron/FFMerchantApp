import { useAuthStore } from '@/src/store/authStore';

export const useAuth = () => {
  const merchant = useAuthStore((s) => s.merchant);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loginAction = useAuthStore((s) => s.login);
  const logoutAction = useAuthStore((s) => s.logout);
  const setMerchant = useAuthStore((s) => s.setMerchant);

  return {
    merchant,
    token,
    isLoading,
    isAuthenticated,
    login: loginAction,
    logout: logoutAction,
    setMerchant,
    merchantId: merchant?.id ?? null,
  };
};
