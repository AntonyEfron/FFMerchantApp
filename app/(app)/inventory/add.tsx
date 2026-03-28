import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/hooks/useAuth';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { addBaseProduct, getCategories, getBrands } from '@/src/api/products';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';
import type { Category, Brand } from '@/src/types';

export default function AddProductScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { merchantId } = useAuth();
  const queryClient = useQueryClient();
  const { imageUri, pickImage, clearImage } = useImagePicker({ aspect: [3, 4] });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [colorHex, setColorHex] = useState('#000000');
  const [sizes, setSizes] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands', merchantId],
    queryFn: () => getBrands(merchantId!),
    enabled: !!merchantId,
  });

  const handleSubmit = async () => {
    if (!name.trim() || !price || !mrp) {
      Alert.alert('Error', 'Please fill in required fields (Name, MRP, Price)');
      return;
    }

    setLoading(true);
    try {
      const sizeArr = sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ size: s, stock: 10 }));

      const formData = new FormData();

      const productData = {
        name: name.trim(),
        description: description.trim(),
        categoryId: category || categories[0]?._id,
        brandId: brand || brands[0]?._id,
        gender: ['Unisex'],
        tags: [],
        features: {},
        variants: [
          {
            color: { name: color || 'Default', hex: colorHex },
            sizes: sizeArr.length > 0 ? sizeArr : [{ size: 'Free', stock: 10 }],
            mrp: parseFloat(mrp),
            price: parseFloat(price),
            discount: parseFloat(mrp) > parseFloat(price) 
              ? Math.round(((parseFloat(mrp) - parseFloat(price)) / parseFloat(mrp)) * 100)
              : 0,
          },
        ],
      };

      formData.append('data', JSON.stringify(productData));

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'product.jpg';
        formData.append('images', {
          uri: imageUri,
          name: filename,
          type: 'image/jpeg',
        } as any);
      }

      await addBaseProduct(formData);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Success', 'Product added successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.text }]}>Add Product</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(400).springify()}>
          {/* Image Picker */}
          <Text style={[typography.label, { color: colors.text, marginBottom: spacing.sm }]}>
            Product Image
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.imagePicker,
              {
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.surface,
              },
            ]}
          >
            {imageUri ? (
              <View style={{ position: 'relative', width: '100%', height: 200 }}>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 200, borderRadius: borderRadius.lg }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={clearImage}
                  style={[styles.removeImage, { backgroundColor: colors.error }]}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePickerContent}>
                <Ionicons name="camera-outline" size={36} color={colors.textTertiary} />
                <Text style={[typography.bodySmall, { color: colors.textTertiary, marginTop: spacing.sm }]}>
                  Tap to add product image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{ height: spacing.xl }} />

          <Input label="Product Name" value={name} onChangeText={setName} placeholder="e.g. Cotton T-Shirt" required leftIcon="pricetag-outline" />
          <Input label="Description" value={description} onChangeText={setDescription} placeholder="Product description..." multiline numberOfLines={3} leftIcon="document-text-outline" />

          {/* Category selector */}
          <Text style={[typography.label, { color: colors.text, marginBottom: spacing.xs }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
            {(categories as Category[]).map((cat) => (
              <TouchableOpacity
                key={cat._id}
                onPress={() => setCategory(cat._id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: category === cat._id ? colors.primary : colors.surface,
                    borderColor: category === cat._id ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSmall,
                    { color: category === cat._id ? colors.textInverse : colors.textSecondary },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Brand selector */}
          <Text style={[typography.label, { color: colors.text, marginBottom: spacing.xs }]}>Brand</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
            {(brands as Brand[]).map((b) => (
              <TouchableOpacity
                key={b._id}
                onPress={() => setBrand(b._id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: brand === b._id ? colors.primary : colors.surface,
                    borderColor: brand === b._id ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSmall,
                    { color: brand === b._id ? colors.textInverse : colors.textSecondary },
                  ]}
                >
                  {b.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => router.push('/(app)/brands/add')}
              style={[
                styles.chip,
                { borderColor: colors.primary, borderRadius: borderRadius.full, borderStyle: 'dashed' },
              ]}
            >
              <Ionicons name="add" size={14} color={colors.primary} />
              <Text style={[typography.labelSmall, { color: colors.primary, marginLeft: 4 }]}>New</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Pricing */}
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Input label="MRP (₹)" value={mrp} onChangeText={setMrp} keyboardType="numeric" placeholder="0" required />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Selling Price (₹)" value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" required />
            </View>
          </View>

          {/* Variant Info */}
          <Input label="Color Name" value={color} onChangeText={setColor} placeholder="e.g. Navy Blue" leftIcon="color-palette-outline" />
          <Input label="Sizes (comma-separated)" value={sizes} onChangeText={setSizes} placeholder="S, M, L, XL" leftIcon="resize-outline" hint="Leave empty for 'Free Size'" />

          <Button title="Add Product" onPress={handleSubmit} loading={loading} fullWidth size="lg" style={{ marginTop: spacing.lg }} />
        </Animated.View>
      </ScrollView>
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
  imagePicker: { borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden' },
  imagePickerContent: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  removeImage: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
});
