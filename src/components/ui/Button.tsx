import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors, borderRadius, typography } = useTheme();
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16 },
    md: { paddingVertical: 12, paddingHorizontal: 20 },
    lg: { paddingVertical: 16, paddingHorizontal: 24 },
  };

  const fontStyles = {
    sm: typography.buttonSmall,
    md: typography.button,
    lg: typography.buttonLarge,
  };

  const baseStyle: ViewStyle = {
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: isDisabled ? 0.5 : 1,
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[{ borderRadius: borderRadius.md }, fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[baseStyle, { overflow: 'hidden' }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <>
              {icon}
              <Text style={[fontStyles[size], { color: colors.textInverse }, textStyle]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<string, { bg: string; textColor: string; borderColor?: string }> = {
    secondary: { bg: colors.secondary, textColor: colors.textInverse },
    outline: { bg: 'transparent', textColor: colors.primary, borderColor: colors.primary },
    ghost: { bg: 'transparent', textColor: colors.primary },
    danger: { bg: colors.error, textColor: colors.textInverse },
  };

  const v = variantStyles[variant] || variantStyles.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        baseStyle,
        {
          backgroundColor: v.bg,
          ...(v.borderColor ? { borderWidth: 1.5, borderColor: v.borderColor } : {}),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[fontStyles[size], { color: v.textColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
