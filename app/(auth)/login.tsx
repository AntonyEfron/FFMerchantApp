import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { login as loginApi } from '@/src/api/auth';
import { useAuthStore } from '@/src/store/authStore';

export default function LoginScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const loginAction = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { merchant, token } = await loginApi(email.trim(), password);
      await loginAction(
        {
          id: merchant._id || merchant.id,
          shopName: merchant.shopName,
          email: merchant.email,
          phoneNumber: merchant.phoneNumber,
        },
        token
      );
      router.replace('/(app)/dashboard');
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
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
          <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/merchntlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(200).springify()}>
            <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.xs }]}>
              Welcome Back
            </Text>
            <Text
              style={[
                typography.bodyLarge,
                { color: colors.textSecondary, marginBottom: spacing['3xl'] },
              ]}
            >
              Sign in to manage your store and view insights
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(400).springify()}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.md }}
            />

            <View style={[styles.signupRow, { marginTop: spacing['2xl'] }]}>
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <Text
                onPress={() => router.push('/(auth)/signup')}
                style={[typography.label, { color: colors.primary }]}
              >
                Sign Up
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 60,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
