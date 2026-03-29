import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { getAllOrders } from '@/src/api/orders';
import { OrderCard } from '@/src/components/orders/OrderCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { useNotificationStore } from '@/src/store/notificationStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { Order } from '@/src/types';
import { OnlineToggle } from '@/src/components/ui/OnlineToggle';

const TABS = ['All', 'Placed', 'Accepted', 'Packed', 'Delivered', 'Cancelled'];

export default function OrdersScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const resetCount = useNotificationStore((s) => s.resetCount);

  const [activeTab, setActiveTab] = useState('All');

  const { data: orders = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });

  const onRefresh = useCallback(async () => {
    resetCount();
    await refetch();
  }, [refetch, resetCount]);

  if (isLoading) return <LoadingScreen />;

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter((o: Order) =>
        o.status?.toLowerCase() === activeTab.toLowerCase()
      );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <View>
          <Text style={[typography.h4, { color: colors.text }]}>Orders</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <OnlineToggle />
      </View>

      {/* Tab Filter */}
      <View style={{ backgroundColor: colors.surface, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        >
          {TABS.map((item) => {
            const isActive = activeTab === item;
            const count = item === 'All'
              ? orders.length
              : orders.filter((o: Order) => o.status?.toLowerCase() === item.toLowerCase()).length;
            
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setActiveTab(item)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? colors.primary : colors.background,
                    borderColor: isActive ? colors.primary : colors.borderLight,
                    borderRadius: borderRadius.full,
                    marginRight: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSmall,
                    { color: isActive ? colors.textInverse : colors.textSecondary },
                  ]}
                >
                  {item} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <Animated.FlatList
        entering={FadeIn.duration(300)}
        data={filteredOrders}
        keyExtractor={(item: Order) => item._id}
        renderItem={({ item }: { item: Order }) => <OrderCard order={item} />}
        contentContainerStyle={{
          padding: spacing.lg,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No Orders"
            message={activeTab === 'All' ? 'No orders yet' : `No ${activeTab.toLowerCase()} orders`}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
});
