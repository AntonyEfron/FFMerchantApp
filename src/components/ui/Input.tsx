import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required = false,
  secureTextEntry,
  ...props
}) => {
  const { colors, typography, borderRadius, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.border;

  return (
    <View style={[{ marginBottom: spacing.lg }, containerStyle]}>
      {label && (
        <Text
          style={[
            typography.label,
            { color: colors.text, marginBottom: spacing.xs },
          ]}
        >
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderRadius: borderRadius.md,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.textTertiary}
            style={{ marginRight: spacing.sm }}
          />
        )}

        <TextInput
          {...props}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.textTertiary}
          style={[
            typography.body,
            {
              flex: 1,
              color: colors.text,
              paddingVertical: 0,
            },
            props.style,
          ]}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={[
            typography.caption,
            { color: colors.error, marginTop: spacing.xxs },
          ]}
        >
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text
          style={[
            typography.caption,
            { color: colors.textTertiary, marginTop: spacing.xxs },
          ]}
        >
          {hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
