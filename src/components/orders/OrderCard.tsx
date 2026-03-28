import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import type { Order } from '@/src/types';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  style?: ViewStyle;
}

const getStatusVariant = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'placed':
    case 'pending':
    case 'accepted':
      return 'warning';
    case 'cancelled':
    case 'rejected':
      return 'error';
    case 'packed':
    case 'shipped':
      return 'info';
    default:
      return 'default';
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  style,
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <Card onPress={onPress} style={[{ marginBottom: spacing.md }, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            Order #{order._id.slice(-8)}
          </Text>
          {order.createdAt && (
            <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
        <Badge
          label={order.status || 'Unknown'}
          variant={getStatusVariant(order.status) as any}
        />
      </View>

      {/* Items */}
      <View style={{ marginTop: spacing.md }}>
        {order.items.slice(0, 3).map((item) => (
          <View key={item._id} style={[styles.itemRow, { marginBottom: spacing.sm }]}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={[styles.itemImage, { borderRadius: borderRadius.sm }]}
              />
            ) : (
              <View
                style={[
                  styles.itemImage,
                  {
                    borderRadius: borderRadius.sm,
                    backgroundColor: colors.borderLight,
                  },
                ]}
              />
            )}
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[typography.bodySmall, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[typography.caption, { color: colors.textTertiary }]}>
                Size: {item.size} × {item.quantity}
              </Text>
            </View>
            <Text style={[typography.label, { color: colors.text }]}>
              ₹{item.price}
            </Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            +{order.items.length - 3} more items
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.divider, marginTop: spacing.md, paddingTop: spacing.md }]}>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </Text>
        <Text style={[typography.labelLarge, { color: colors.success }]}>
          ₹{order.totalAmount}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 44,
    height: 44,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
