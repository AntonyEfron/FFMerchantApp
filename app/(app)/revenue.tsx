import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { StatCard } from '@/src/components/ui/StatCard';
import { Card } from '@/src/components/ui/Card';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { getMerchantAnalytics, getMerchantWallet } from '@/src/api/analytics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RevenueScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const [startDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: analytics, isLoading: loadingAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['revenue-analytics', startDate, endDate],
    queryFn: () => getMerchantAnalytics(startDate, endDate),
  });

  const { data: wallet, isLoading: loadingWallet, refetch: refetchWallet, isRefetching } = useQuery({
    queryKey: ['wallet'],
    queryFn: getMerchantWallet,
  });

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchAnalytics(), refetchWallet()]);
  }, [refetchAnalytics, refetchWallet]);

  if (loadingAnalytics && loadingWallet) return <LoadingScreen />;

  const stats = analytics?.stats || { totalRevenue: 0, avgOrderValue: 0, totalOrders: 0 };
  const walletBalance = (wallet as any)?.balance || 0;
  const transactions = (wallet as any)?.transactions || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <View>
          <Text style={[typography.h4, { color: colors.text }]}>Wallet & Revenue</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Last 30 days overview
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['4xl'] }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <Animated.View entering={FadeInDown.duration(400).springify()}>
          {/* Wallet Card */}
          <Card style={{ backgroundColor: colors.primary, marginBottom: spacing.xl, borderColor: colors.primary }}>
            <View style={styles.walletRow}>
              <View>
                <Text style={[typography.label, { color: colors.textInverse, opacity: 0.8 }]}>
                  Wallet Balance
                </Text>
                <Text style={[typography.h1, { color: colors.textInverse, marginTop: spacing.xs }]}>
                  ₹{walletBalance.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.walletIcon, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: borderRadius.md }]}>
                <Ionicons name="wallet-outline" size={28} color={colors.textInverse} />
              </View>
            </View>
          </Card>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard
              title="Total Revenue"
              value={(stats.totalRevenue || 0).toFixed(0)}
              icon="trending-up-outline"
              prefix="₹"
              iconColor={colors.success}
              iconBgColor={colors.successLight}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <StatCard
              title="Avg Order"
              value={(stats.avgOrderValue || 0).toFixed(0)}
              icon="analytics-outline"
              prefix="₹"
              iconColor={colors.info}
              iconBgColor={colors.infoLight}
              style={{ flex: 1, marginLeft: spacing.sm }}
            />
          </View>

          {/* Transactions */}
          <Text style={[typography.h5, { color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md }]}>
            Recent Transactions
          </Text>

          <Card>
            {transactions.length === 0 ? (
              <Text style={[typography.body, { color: colors.textTertiary, textAlign: 'center', padding: spacing.md }]}>
                No transactions yet
              </Text>
            ) : (
              transactions
                .slice()
                .reverse()
                .slice(0, 20)
                .map((tx: any, idx: number) => (
                  <View
                    key={idx}
                    style={[
                      styles.txRow,
                      idx < Math.min(transactions.length, 20) - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.divider,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.txIcon,
                        {
                          backgroundColor: tx.type === 'credit' ? colors.successLight : colors.errorLight,
                          borderRadius: borderRadius.md,
                        },
                      ]}
                    >
                      <Ionicons
                        name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                        size={18}
                        color={tx.type === 'credit' ? colors.success : colors.error}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={[typography.label, { color: colors.text }]}>
                        {tx.description || tx.type?.toUpperCase()}
                      </Text>
                      <Text style={[typography.caption, { color: colors.textTertiary }]}>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        typography.labelLarge,
                        { color: tx.type === 'credit' ? colors.success : colors.text },
                      ]}
                    >
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount?.toFixed(2)}
                    </Text>
                  </View>
                ))
            )}
          </Card>
        </Animated.View>
      </ScrollView>
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
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletIcon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  txIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
