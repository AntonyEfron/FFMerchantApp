import { useColorScheme } from 'react-native';
import { colors } from './colors';
import type { ColorScheme, ThemeMode } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';
import { useThemeStore } from '@/src/store/themeStore';

export { colors, typography, spacing, borderRadius, shadows };
export type { ColorScheme, ThemeMode };

export interface Theme {
  colors: ColorScheme;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
}

export function useTheme(): Theme {
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((s) => s.themeMode);

  const mode = themeMode === 'system'
    ? (systemColorScheme ?? 'light')
    : themeMode;

  return {
    colors: colors[mode] as ColorScheme,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark: mode === 'dark',
  };
}
