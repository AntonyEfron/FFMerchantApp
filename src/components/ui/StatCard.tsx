import React from 'react';
import { View, Text } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  prefix?: string;
  suffix?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  prefix = '',
  suffix = '',
  style,
}) => {
  const { colors, typography, borderRadius, spacing } = useTheme();

  return (
    <Card style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {title}
          </Text>
          <Text
            style={[
              typography.h4,
              { color: colors.text, marginTop: spacing.xs },
            ]}
            numberOfLines={1}
          >
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </Text>
        </View>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.md,
            backgroundColor: iconBgColor || colors.primaryLight + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={icon}
            size={22}
            color={iconColor || colors.primary}
          />
        </View>
      </View>
    </Card>
  );
};
