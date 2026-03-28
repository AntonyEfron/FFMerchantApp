import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/theme';
import { Button } from '../ui/Button';
import { useNotificationStore } from '@/src/store/notificationStore';
import { acceptOrRejectOrder } from '@/src/api/orders';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const REJECTION_REASONS = [
  'Out of stock',
  'Delivery not available in this area',
  'Technical issue',
  'High order volume',
  'Other',
];

export const OrderNotificationModal: React.FC = () => {
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const currentOrder = useNotificationStore((s) => s.currentOrder);
  const dismissCurrentOrder = useNotificationStore((s) => s.dismissCurrentOrder);
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!currentOrder) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptOrRejectOrder(currentOrder._id, 'accept', 'accepted');
      dismissCurrentOrder();
      router.push('/(app)/orders');
    } catch (e) {
      console.error('Failed to accept order:', e);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReason) return;
    setIsRejecting(true);
    try {
      await acceptOrRejectOrder(currentOrder._id, 'reject', selectedReason);
      dismissCurrentOrder();
    } catch (e) {
      console.error('Failed to reject order:', e);
    } finally {
      setIsRejecting(false);
      setShowReasons(false);
      setSelectedReason('');
    }
  };

  return (
    <Modal
      visible={!!currentOrder}
      transparent
      animationType="fade"
      onRequestClose={() => dismissCurrentOrder()}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              ...shadows.xl,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={[styles.header, { marginBottom: spacing.lg }]}>
              <Text style={[typography.h4, { color: colors.primary, textAlign: 'center' }]}>
                📩 New Order Received
              </Text>
            </View>

            {/* Order ID & Amount */}
            <View
              style={[
                styles.infoCard,
                { backgroundColor: colors.background, borderRadius: borderRadius.md },
              ]}
            >
              <View style={styles.infoRow}>
                <View style={[styles.dot, { backgroundColor: colors.info }]} />
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                  Order ID
                </Text>
                <Text style={[typography.labelSmall, { color: colors.text, marginLeft: 'auto' }]}>
                  #{currentOrder._id.slice(-8)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <View style={styles.infoRow}>
                <View style={[styles.dot, { backgroundColor: colors.success }]} />
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                  Total Amount
                </Text>
                <Text style={[typography.h4, { color: colors.success, marginLeft: 'auto' }]}>
                  ₹{currentOrder.totalAmount}
                </Text>
              </View>
            </View>

            {/* Items */}
            <Text
              style={[
                typography.label,
                { color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
              ]}
            >
              🛍️ Order Items
            </Text>

            {currentOrder.items.map((item, idx) => (
              <View
                key={item._id}
                style={[
                  styles.itemRow,
                  idx < currentOrder.items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                    paddingBottom: spacing.md,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: item.image }}
                    style={[styles.itemImage, { borderRadius: borderRadius.sm }]}
                  />
                  <View
                    style={[
                      styles.qtyBadge,
                      { backgroundColor: colors.primary, borderRadius: borderRadius.full },
                    ]}
                  >
                    <Text style={[typography.overline, { color: '#fff', fontSize: 9, textTransform: 'none' }]}>
                      {item.quantity}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={[typography.bodySmall, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>
                    Size: {item.size}
                  </Text>
                </View>
                <Text style={[typography.label, { color: colors.text }]}>₹{item.price}</Text>
              </View>
            ))}

            {/* Rejection Reasons */}
            {showReasons && (
              <View style={{ marginTop: spacing.lg }}>
                <Text style={[typography.label, { color: colors.text, marginBottom: spacing.sm }]}>
                  Select a reason:
                </Text>
                {REJECTION_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    style={[
                      styles.reasonChip,
                      {
                        backgroundColor:
                          selectedReason === reason ? colors.errorLight : colors.background,
                        borderColor: selectedReason === reason ? colors.error : colors.border,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    <Ionicons
                      name={selectedReason === reason ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={selectedReason === reason ? colors.error : colors.textTertiary}
                    />
                    <Text
                      style={[
                        typography.bodySmall,
                        {
                          color: selectedReason === reason ? colors.error : colors.text,
                          marginLeft: spacing.sm,
                        },
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={[styles.actions, { marginTop: spacing.xl }]}>
              <Button
                title="Accept Order"
                onPress={handleAccept}
                variant="primary"
                loading={isAccepting}
                fullWidth
                icon={<Ionicons name="checkmark-circle" size={20} color="#fff" />}
              />
              <View style={{ height: spacing.sm }} />
              {!showReasons ? (
                <Button
                  title="Reject Order"
                  onPress={() => setShowReasons(true)}
                  variant="danger"
                  fullWidth
                  icon={<Ionicons name="close-circle" size={20} color="#fff" />}
                />
              ) : (
                <Button
                  title="Confirm Rejection"
                  onPress={handleReject}
                  variant="danger"
                  loading={isRejecting}
                  disabled={!selectedReason}
                  fullWidth
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxHeight: '90%',
    padding: 20,
  },
  header: {
    alignItems: 'center',
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 52,
    height: 52,
  },
  qtyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  actions: {},
});
