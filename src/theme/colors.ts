export const colors = {
  light: {
    primary: '#0F172A', // Black
    primaryDark: '#000000',
    primaryLight: '#334155',
    primaryGradient: ['#0F172A', '#334155'] as const,

    secondary: '#64748B', // Grey
    secondaryDark: '#475569',
    secondaryLight: '#94A3B8',

    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',

    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',

    success: '#059669',
    successLight: '#D1FAE5',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    info: '#2563EB',
    infoLight: '#DBEAFE',

    skeleton: '#E2E8F0',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',

    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#0F172A',
    tabBarInactive: '#94A3B8',
  },

  dark: {
    primary: '#FFFFFF',
    primaryDark: '#E2E8F0',
    primaryLight: '#F8FAFC',
    primaryGradient: ['#FFFFFF', '#E2E8F0'] as const,

    secondary: '#94A3B8',
    secondaryDark: '#64748B',
    secondaryLight: '#CBD5E1',

    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    card: '#1E293B',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',

    border: '#334155',
    borderLight: '#1E293B',
    divider: '#334155',

    success: '#34D399',
    successLight: '#064E3B',
    error: '#F87171',
    errorLight: '#7F1D1D',
    warning: '#FBBF24',
    warningLight: '#78350F',
    info: '#60A5FA',
    infoLight: '#1E3A5F',

    skeleton: '#334155',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadowColor: '#000000',

    tabBar: '#1E293B',
    tabBarBorder: '#334155',
    tabBarActive: '#FFFFFF',
    tabBarInactive: '#64748B',
  },
} as const;

export type ColorScheme = typeof colors.light;
export type ThemeMode = 'light' | 'dark';
