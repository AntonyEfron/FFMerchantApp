import React from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { StatCard } from '@/src/components/ui/StatCard';
import { Card } from '@/src/components/ui/Card';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { getMerchantAnalytics } from '@/src/api/analytics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/src/hooks/useAuth';

export default function DashboardScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { merchant } = useAuth();
  
  const [startDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate] = React.useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: () => getMerchantAnalytics(startDate, endDate),
  });

  if (isLoading) return <LoadingScreen />;

  const stats = data?.stats || { totalRevenue: 0, totalOrders: 0, newCustomers: 0, avgOrderValue: 0 };
  const orderStatus = data?.orderStatus || [];
  const topProducts = data?.topProducts || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.h4, { color: colors.text }]}>
            Overview
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {merchant?.shopName || 'Dashboard'}
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        <Animated.View entering={FadeInDown.duration(400).springify()}>
          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Revenue"
              value={stats.totalRevenue.toFixed(0)}
              icon="cash-outline"
              prefix="₹"
              iconColor={colors.success}
              iconBgColor={colors.successLight}
              style={{ flex: 1, marginRight: spacing.sm, marginBottom: spacing.md }}
            />
            <StatCard
              title="Orders"
              value={stats.totalOrders}
              icon="cube-outline"
              iconColor={colors.primary}
              iconBgColor={colors.primaryLight}
              style={{ flex: 1, marginLeft: spacing.sm, marginBottom: spacing.md }}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Avg. Order"
              value={stats.avgOrderValue.toFixed(0)}
              icon="analytics-outline"
              prefix="₹"
              iconColor={colors.info}
              iconBgColor={colors.infoLight}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <StatCard
              title="Customers"
              value={stats.newCustomers || 0}
              icon="people-outline"
              iconColor={colors.warning}
              iconBgColor={colors.warningLight}
              style={{ flex: 1, marginLeft: spacing.sm }}
            />
          </View>

          {/* Orders by Status */}
          <Text style={[typography.h5, { color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md }]}>
            Orders Setup
          </Text>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {['Placed', 'Accepted', 'Packed', 'Delivered'].map((status) => {
                const countObj = orderStatus.find((s: any) => s._id?.toLowerCase() === status.toLowerCase());
                const count = countObj?.count || 0;
                
                let icon = 'ellipse-outline';
                let iconColor = colors.textTertiary;
                if (status === 'Placed') { icon = 'time-outline'; iconColor = colors.warning as any; }
                if (status === 'Accepted') { icon = 'checkmark-circle-outline'; iconColor = colors.info as any; }
                if (status === 'Packed') { icon = 'cube-outline'; iconColor = colors.primary as any; }
                if (status === 'Delivered') { icon = 'shield-checkmark-outline'; iconColor = colors.success as any; }

                return (
                  <View key={status} style={{ alignItems: 'center' }}>
                    <Ionicons name={icon as any} size={28} color={iconColor as any} style={{ marginBottom: spacing.xs }} />
                    <Text style={[typography.h4, { color: colors.text }]}>{count}</Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>{status}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Top Products */}
          <Text style={[typography.h5, { color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md }]}>
            Top Products
          </Text>
          
          {topProducts.length === 0 ? (
            <Card>
              <Text style={[typography.body, { color: colors.textTertiary, textAlign: 'center' }]}>
                No product data this week
              </Text>
            </Card>
          ) : (
            topProducts.map((p: any, idx: number) => (
              <Card key={p.productId || idx} style={{ marginBottom: spacing.md, padding: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {p.productImage ? (
                    <Image source={{ uri: p.productImage }} style={[styles.productImage, { borderRadius: borderRadius.sm }]} />
                  ) : (
                    <View style={[styles.productImage, { borderRadius: borderRadius.sm, backgroundColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' }]}>
                      <Ionicons name="image-outline" size={20} color={colors.textTertiary} />
                    </View>
                  )}
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[typography.label, { color: colors.text }]} numberOfLines={1}>
                      {p.productName || 'Unknown Product'}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                      {p.totalQuantity} items sold
                    </Text>
                  </View>
                  <Text style={[typography.labelLarge, { color: colors.success }]}>
                    ₹{(p.totalRevenue || 0).toFixed(0)}
                  </Text>
                </View>
              </Card>
            ))
          )}
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
    paddingHorizontal: 20,
    paddingTop: 60, // Account for top inset usually 50-60 on modern iOS
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  productImage: { width: 48, height: 48 },
});
