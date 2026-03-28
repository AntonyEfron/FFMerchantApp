import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useTheme } from '@/src/theme';
import { useAuth } from '@/src/hooks/useAuth';
import { getBrands, deleteBrand } from '@/src/api/products';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import type { Brand } from '@/src/types';

export default function BrandsScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { merchantId } = useAuth();
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['brands', merchantId],
    queryFn: () => getBrands(merchantId!),
    enabled: !!merchantId,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ brandId }: { brandId: string }) => deleteBrand(merchantId!, brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleDelete = (brandId: string, name: string) => {
    Alert.alert('Delete Brand', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate({ brandId }) },
    ]);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.text, flex: 1, textAlign: 'center' }]}>Brands</Text>
        <TouchableOpacity onPress={() => router.push('/(app)/brands/add')} style={styles.addBtn}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        entering={FadeIn.duration(400)}
        data={brands as Brand[]}
        keyExtractor={(item: Brand) => item._id}
        renderItem={({ item }: { item: Brand }) => (
          <Card style={{ marginBottom: spacing.md }}>
            <View style={styles.brandRow}>
              {item.logo?.url ? (
                <Image source={{ uri: item.logo.url }} style={[styles.brandLogo, { borderRadius: borderRadius.md }]} />
              ) : (
                <View style={[styles.brandLogo, { borderRadius: borderRadius.md, backgroundColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="pricetag" size={20} color={colors.textTertiary} />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[typography.label, { color: colors.text }]}>{item.name}</Text>
                <Text style={[typography.caption, { color: colors.textTertiary }]} numberOfLines={1}>
                  {item.description || 'No description'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item._id, item.name)} style={{ padding: spacing.xs }}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        ListEmptyComponent={
          <Animated.View entering={FadeInUp}>
            <EmptyState icon="pricetag-outline" title="No Brands" message="Add your first brand" />
          </Animated.View>
        }
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      />
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
  addBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandLogo: { width: 48, height: 48 },
});
