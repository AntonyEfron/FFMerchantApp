import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'file-tray-outline',
  title,
  message,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'] }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.borderLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name={icon} size={36} color={colors.textTertiary} />
      </View>
      <Text style={[typography.h5, { color: colors.textSecondary, textAlign: 'center' }]}>
        {title}
      </Text>
      {message && (
        <Text
          style={[
            typography.body,
            { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};
