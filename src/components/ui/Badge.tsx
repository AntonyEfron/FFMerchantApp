import React from 'react';
import { View, Text } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  const { colors, typography, borderRadius, spacing } = useTheme();

  const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
    success: { bg: colors.successLight, text: colors.success },
    error: { bg: colors.errorLight, text: colors.error },
    warning: { bg: colors.warningLight, text: colors.warning },
    info: { bg: colors.infoLight, text: colors.info },
    default: { bg: colors.borderLight, text: colors.textSecondary },
  };

  const v = variantStyles[variant];

  return (
    <View
      style={[
        {
          backgroundColor: v.bg,
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={[typography.labelSmall, { color: v.text }]}>{label}</Text>
    </View>
  );
};
