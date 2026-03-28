import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { sendEmailOtp, verifyEmailOtp, registerMerchant } from '@/src/api/auth';
import { useAuthStore } from '@/src/store/authStore';

type Step = 'info' | 'otp' | 'password';

export default function SignupScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const loginAction = useAuthStore((s) => s.login);

  const [step, setStep] = useState<Step>('info');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await sendEmailOtp({ email: email.trim(), phoneNumber: phone.trim() });
      setStep('otp');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyEmailOtp({ email: email.trim(), otp: otp.trim() });
      setStep('password');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!password || password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await registerMerchant({
        identifier: email.trim(),
        password,
      });

      if (res?.token && res?.merchant) {
        await loginAction(
          {
            id: res.merchant._id || res.merchant.id,
            shopName: res.merchant.shopName || '',
            email: res.merchant.email,
            phoneNumber: res.merchant.phoneNumber || '',
          },
          res.token
        );
        router.replace('/(auth)/register');
      } else {
        Alert.alert('Success', 'Account created! Please log in.');
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/merchntlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={{ width: 44 }} /> 
          </View>

          <Animated.View entering={FadeInUp.duration(500).springify()}>
            <Text style={[typography.h2, { color: colors.text, marginTop: spacing.xl, marginBottom: spacing.xs }]}>
              Create Account
            </Text>
            <Text style={[typography.bodyLarge, { color: colors.textSecondary, marginBottom: spacing['2xl'] }]}>
              Join FlashFits as a Merchant
            </Text>
          </Animated.View>

          {/* Setup Progress via Animated view */}
          <View style={[styles.stepRow, { marginBottom: spacing['2xl'] }]}>
            {['info', 'otp', 'password'].map((s, i) => (
              <View key={s} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        step === s
                          ? colors.primary
                          : i < ['info', 'otp', 'password'].indexOf(step)
                          ? colors.success
                          : colors.borderLight,
                    },
                  ]}
                >
                  {i < ['info', 'otp', 'password'].indexOf(step) ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Text style={[typography.labelSmall, { color: step === s ? colors.surface : colors.textTertiary }]}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    typography.caption,
                    { color: step === s ? colors.primary : colors.textTertiary, marginTop: 4 },
                  ]}
                >
                  {s === 'info' ? 'Details' : s === 'otp' ? 'Verify' : 'Password'}
                </Text>
              </View>
            ))}
          </View>

          {/* Form Content - Slide Animations tied to Step */}
          {step === 'info' && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <Input
                label="Email Address"
                placeholder="merchant@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                required
              />
              <Input
                label="Phone Number"
                placeholder="+91 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon="call-outline"
              />
              <Button title="Continue" onPress={handleSendOtp} loading={loading} fullWidth size="lg" />
            </Animated.View>
          )}

          {step === 'otp' && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <Text
                style={[
                  typography.body,
                  { color: colors.textSecondary, marginBottom: spacing.xl, textAlign: 'center' },
                ]}
              >
                Enter the 6-digit code sent to {email}
              </Text>
              <Input
                label="Verification Code"
                placeholder="000000"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                leftIcon="key-outline"
              />
              <Button title="Verify OTP" onPress={handleVerifyOtp} loading={loading} fullWidth size="lg" />
              <Button title="Resend OTP" onPress={handleSendOtp} variant="ghost" fullWidth style={{ marginTop: spacing.md }} />
            </Animated.View>
          )}

          {step === 'password' && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <Input
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
                required
              />
              <Input
                label="Confirm Password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
                required
                error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
              />
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                fullWidth
                size="lg"
                disabled={!password || password !== confirmPassword}
              />
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.loginRow, { marginTop: spacing['2xl'] }]}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Text
              onPress={() => router.push('/(auth)/login')}
              style={[typography.label, { color: colors.primary }]}
            >
              Sign In
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  logo: { width: 140, height: 40 },
  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  stepItem: { alignItems: 'center' },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
});
