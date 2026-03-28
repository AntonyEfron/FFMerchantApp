import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import type { Product } from '@/src/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onDelete,
  style,
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const firstVariant = product.variants?.[0];
  const imageUrl = firstVariant?.images?.[0]?.url;
  const totalStock = product.variants?.reduce(
    (sum, v) => sum + v.sizes.reduce((s, sz) => s + sz.stock, 0),
    0
  ) ?? 0;

  return (
    <Card onPress={onPress} style={[{ marginBottom: spacing.md }, style]}>
      <View style={styles.row}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { borderRadius: borderRadius.md }]}
          />
        ) : (
          <View
            style={[
              styles.image,
              {
                borderRadius: borderRadius.md,
                backgroundColor: colors.borderLight,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <Ionicons name="image-outline" size={24} color={colors.textTertiary} />
          </View>
        )}

        <View style={styles.content}>
          <Text style={[typography.label, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={[styles.metaRow, { marginTop: spacing.xs }]}>
            {firstVariant && (
              <Text style={[typography.bodySmall, { color: colors.success }]}>
                ₹{firstVariant.price}
              </Text>
            )}
            {firstVariant && firstVariant.mrp > firstVariant.price && (
              <Text
                style={[
                  typography.caption,
                  { color: colors.textTertiary, textDecorationLine: 'line-through', marginLeft: spacing.sm },
                ]}
              >
                ₹{firstVariant.mrp}
              </Text>
            )}
          </View>

          <View style={[styles.metaRow, { marginTop: spacing.xs }]}>
            <Badge
              label={`${product.variants?.length ?? 0} variants`}
              variant="info"
            />
            <Badge
              label={`Stock: ${totalStock}`}
              variant={totalStock > 0 ? 'success' : 'error'}
              style={{ marginLeft: spacing.xs }}
            />
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            style={{ padding: spacing.xs }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
