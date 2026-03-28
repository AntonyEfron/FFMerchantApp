import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { updateMerchantShopDetails, updateMerchantBankDetails, activateMerchant } from '@/src/api/auth';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

type Step = 'shop' | 'bank' | 'done';

export default function RegisterScreen() {
  const { colors, typography, spacing } = useTheme();
  const { merchantId } = useAuth();

  const [step, setStep] = useState<Step>('shop');
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');

  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  const handleShopSubmit = async () => {
    if (!shopName.trim()) {
      Alert.alert('Error', 'Shop name is required');
      return;
    }
    if (!merchantId) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('shopName', shopName.trim());
      fd.append('shopDescription', shopDesc.trim());
      fd.append('ownerName', ownerName.trim());
      fd.append('address', address.trim());
      await updateMerchantShopDetails(merchantId, fd);
      setStep('bank');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleBankSubmit = async () => {
    if (!merchantId) return;
    setLoading(true);
    try {
      await updateMerchantBankDetails(merchantId, {
        bankName: bankName.trim(),
        accountNumber: accNumber.trim(),
        ifscCode: ifsc.trim(),
      });
      await activateMerchant(merchantId);
      setStep('done');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save bank details');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View entering={FadeInUp.springify()} style={styles.doneContainer}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.successLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <Ionicons name="checkmark-sharp" size={60} color={colors.success} />
          </View>
          <Text style={[typography.h3, { color: colors.text, textAlign: 'center' }]}>
            Registration Complete
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md },
            ]}
          >
            Your merchant account is now active.
          </Text>
          <Button
            title="Go to Dashboard"
            onPress={() => router.replace('/(app)/dashboard')}
            fullWidth
            size="lg"
            style={{ marginTop: spacing['3xl'] }}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        {step === 'bank' ? (
          <TouchableOpacity onPress={() => setStep('shop')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
        <Text style={[typography.h5, { color: colors.text }]}>Setup Account</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing['2xl'], flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(400).springify()}>
          <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.xs }]}>
            {step === 'shop' ? 'Shop Details' : 'Bank Details'}
          </Text>
          <Text
            style={[
              typography.bodyLarge,
              { color: colors.textSecondary, marginBottom: spacing['2xl'] },
            ]}
          >
            {step === 'shop'
              ? 'Tell us about your store'
              : 'Add your bank details for payouts'}
          </Text>
        </Animated.View>

        {step === 'shop' ? (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
            <Input label="Shop Name" value={shopName} onChangeText={setShopName} placeholder="Your store name" required leftIcon="storefront-outline" />
            <Input label="Owner Name" value={ownerName} onChangeText={setOwnerName} placeholder="Full name" leftIcon="person-outline" />
            <Input label="Shop Description" value={shopDesc} onChangeText={setShopDesc} placeholder="Describe your store" leftIcon="document-text-outline" multiline numberOfLines={3} />
            <Input label="Address" value={address} onChangeText={setAddress} placeholder="Store address" leftIcon="location-outline" />
            <Button title="Continue" onPress={handleShopSubmit} loading={loading} fullWidth size="lg" style={{ marginTop: spacing.lg }} />
          </Animated.View>
        ) : (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
            <Input label="Bank Name" value={bankName} onChangeText={setBankName} placeholder="e.g. State Bank of India" leftIcon="business-outline" />
            <Input label="Account Number" value={accNumber} onChangeText={setAccNumber} placeholder="Account number" keyboardType="number-pad" leftIcon="card-outline" />
            <Input label="IFSC Code" value={ifsc} onChangeText={setIfsc} placeholder="e.g. SBIN0001234" autoCapitalize="characters" leftIcon="code-outline" />
            <Button title="Complete Registration" onPress={handleBankSubmit} loading={loading} fullWidth size="lg" style={{ marginTop: spacing.lg }} />
            <Button title="Skip for Now" onPress={() => router.replace('/(app)/dashboard')} variant="ghost" fullWidth style={{ marginTop: spacing.md }} />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
});
