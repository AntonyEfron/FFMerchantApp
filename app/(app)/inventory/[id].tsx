import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { getBaseProductById, editProduct } from '@/src/api/products';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { Product, Variant } from '@/src/types';

export default function EditProductScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getBaseProductById(id!),
    enabled: !!id,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      const p = product.product || product;
      setName(p.name || '');
      setDescription(p.description || '');
    }
  }, [product]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    setSaving(true);
    try {
      await editProduct(id!, { name: name.trim(), description: description.trim() });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      Alert.alert('Success', 'Product updated!');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  const p: Product = product?.product || product;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.text, flex: 1, textAlign: 'center' }]} numberOfLines={1}>
          Edit Product
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {!p ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Product not found
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(400).springify()}>
            <Input label="Product Name" value={name} onChangeText={setName} placeholder="Product name" required />
            <Input label="Description" value={description} onChangeText={setDescription} placeholder="Description" multiline numberOfLines={3} />

            {/* Variants Display */}
            <Text style={[typography.h5, { color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md }]}>
              Variants ({p.variants?.length || 0})
            </Text>

            {p.variants?.map((variant: Variant, idx: number) => (
              <Card key={variant._id || idx} style={{ marginBottom: spacing.md }}>
                {/* Variant Images */}
                {variant.images?.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                    {variant.images.map((img, imgIdx) => (
                      <Image
                        key={img._id || imgIdx}
                        source={{ uri: img.url }}
                        style={[styles.variantImage, { borderRadius: borderRadius.sm, marginRight: spacing.sm }]}
                      />
                    ))}
                  </ScrollView>
                )}

                <View style={styles.variantHeader}>
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: variant.color?.hex || '#ccc', borderRadius: borderRadius.xs },
                    ]}
                  />
                  <Text style={[typography.label, { color: colors.text, marginLeft: spacing.sm }]}>
                    {variant.color?.name || 'Unknown'}
                  </Text>
                </View>

                <View style={[styles.priceRow, { marginTop: spacing.sm }]}>
                  <Text style={[typography.bodySmall, { color: colors.success }]}>
                    ₹{variant.price}
                  </Text>
                  {variant.mrp > variant.price && (
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.textTertiary, textDecorationLine: 'line-through', marginLeft: spacing.sm },
                      ]}
                    >
                      ₹{variant.mrp}
                    </Text>
                  )}
                  {variant.discount > 0 && (
                    <Badge label={`${variant.discount}% off`} variant="success" style={{ marginLeft: spacing.sm }} />
                  )}
                </View>

                {/* Sizes */}
                <View style={[styles.sizesRow, { marginTop: spacing.md }]}>
                  {variant.sizes?.map((s, sIdx) => (
                    <View
                      key={s._id || sIdx}
                      style={[
                        styles.sizeChip,
                        {
                          backgroundColor: s.stock > 0 ? colors.successLight : colors.errorLight,
                          borderRadius: borderRadius.sm,
                        },
                      ]}
                    >
                      <Text style={[typography.labelSmall, { color: s.stock > 0 ? colors.success : colors.error }]}>
                        {s.size}: {s.stock}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}

            <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth size="lg" style={{ marginTop: spacing.lg }} />
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  variantImage: { width: 80, height: 80 },
  variantHeader: { flexDirection: 'row', alignItems: 'center' },
  colorSwatch: { width: 20, height: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  sizesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeChip: { paddingHorizontal: 10, paddingVertical: 4 },
});
