import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { useAuth } from '@/src/hooks/useAuth';
import { fetchProductsByMerchantId, deleteProduct } from '@/src/api/products';
import { Input } from '@/src/components/ui/Input';
import { ProductCard } from '@/src/components/products/ProductCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import type { Product } from '@/src/types';

export default function InventoryScreen() {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const { merchantId } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: products = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['products', merchantId],
    queryFn: () => fetchProductsByMerchantId(merchantId!),
    enabled: !!merchantId,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleDelete = (productId: string, name: string) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate({ productId }) },
    ]);
  };

  const filteredProducts = (products as Product[]).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header & Search */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={[typography.h4, { color: colors.text }]}>Inventory</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {products.length} product{products.length !== 1 ? 's' : ''} in catalog
            </Text>
          </View>
          <TouchableOpacity
             onPress={() => router.push('/(app)/inventory/add' as any)}
             style={[
               styles.headerAddBtn,
               { backgroundColor: colors.primary, borderRadius: borderRadius.full }
             ]}
          >
             <Ionicons name="add" size={20} color={colors.textInverse} />
             <Text style={[typography.buttonSmall, { color: colors.textInverse, marginLeft: 4 }]}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            leftIcon="search-outline"
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
      </View>

      <Animated.FlatList
        entering={FadeIn.duration(400)}
        data={filteredProducts}
        keyExtractor={(item: Product) => item._id}
        renderItem={({ item }: { item: Product }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/(app)/inventory/${item._id}` as any)}
            onDelete={() => handleDelete(item._id, item.name)}
          />
        )}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100, flexGrow: 1 }}
        ListEmptyComponent={
          <Animated.View entering={FadeInUp}>
            <EmptyState
              icon="cube-outline"
              title="No Products Found"
              message={searchQuery ? "Try a different search term" : "Add your first product to get started"}
            />
          </Animated.View>
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
