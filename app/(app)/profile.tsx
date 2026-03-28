import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { useAuth } from '@/src/hooks/useAuth';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { getMerchantById, updateMerchantShopDetails } from '@/src/api/auth';
import { useThemeStore } from '@/src/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { colors, typography, spacing, borderRadius, isDark } = useTheme();
  const { merchantId, merchant, logout } = useAuth();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { imageUri: logoUri, pickImage: pickLogo } = useImagePicker();
  const { imageUri: bgUri, pickImage: pickBg } = useImagePicker({ aspect: [16, 9] });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    shopName: '',
    shopDescription: '',
    ownerName: '',
    logoUrl: '',
    bgUrl: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMerchantById();
      setForm({
        shopName: data.shopName || '',
        shopDescription: data.shopDescription || '',
        ownerName: data.ownerName || '',
        logoUrl: data.logo?.url || '',
        bgUrl: data.backgroundImage?.url || '',
      });
    } catch {
      if (merchant) {
        setForm((f) => ({ ...f, shopName: merchant.shopName || '' }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!merchantId) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('shopName', form.shopName);
      fd.append('shopDescription', form.shopDescription);
      fd.append('ownerName', form.ownerName);

      if (logoUri) {
        fd.append('logo', {
          uri: logoUri,
          name: 'logo.jpg',
          type: 'image/jpeg',
        } as any);
      }
      if (bgUri) {
        fd.append('backgroundImage', {
          uri: bgUri,
          name: 'bg.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await updateMerchantShopDetails(merchantId, fd);
      Alert.alert('Success', 'Profile updated!');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) return <LoadingScreen />;

  const displayLogo = logoUri || form.logoUrl;
  const displayBg = bgUri || form.bgUrl;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <View>
          <Text style={[typography.h4, { color: colors.text }]}>Profile</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Manage store settings
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['5xl'] }}
      >
        <Animated.View entering={FadeIn.duration(400)}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            {displayBg ? (
              <Image source={{ uri: displayBg }} style={styles.bgImage} />
            ) : (
              <View style={[styles.bgImage, { backgroundColor: colors.primaryLight }]} />
            )}
            <View style={[styles.avatarContainer, { borderColor: colors.background }]}>
              <TouchableOpacity onPress={pickLogo}>
                {displayLogo ? (
                  <Image
                    source={{ uri: displayLogo }}
                    style={[styles.avatar, { borderRadius: borderRadius.full }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      {
                        borderRadius: borderRadius.full,
                        backgroundColor: colors.borderLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Ionicons name="camera" size={28} color={colors.textTertiary} />
                  </View>
                )}
                <View
                  style={[
                    styles.editBadge,
                    { backgroundColor: colors.primary, borderRadius: borderRadius.full },
                  ]}
                >
                  <Ionicons name="pencil" size={12} color={colors.textInverse} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ padding: spacing.lg }}>
            <Text style={[typography.h3, { color: colors.text, textAlign: 'center' }]}>
              {form.shopName || 'Your Store'}
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xxs }]}>
              {merchant?.email}
            </Text>

            <View style={{ height: spacing.xl }} />

            {/* Edit Form */}
            <Input label="Shop Name" value={form.shopName} onChangeText={(v) => setForm({ ...form, shopName: v })} leftIcon="storefront-outline" />
            <Input label="Owner Name" value={form.ownerName} onChangeText={(v) => setForm({ ...form, ownerName: v })} leftIcon="person-outline" />
            <Input label="Description" value={form.shopDescription} onChangeText={(v) => setForm({ ...form, shopDescription: v })} multiline numberOfLines={3} leftIcon="document-text-outline" />

            {/* Background Image */}
            <TouchableOpacity onPress={pickBg}>
              <Card style={{ marginBottom: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="image-outline" size={22} color={colors.primary} />
                  <Text style={[typography.label, { color: colors.primary, marginLeft: spacing.sm }]}>
                    Change Background Image
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>

            <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth size="lg" />

            {/* Settings */}
            <Text style={[typography.h5, { color: colors.text, marginTop: spacing['3xl'], marginBottom: spacing.md }]}>
              Settings
            </Text>

            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.settingRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="moon-outline" size={20} color={colors.text} />
                  <Text style={[typography.label, { color: colors.text, marginLeft: spacing.md }]}>
                    Dark Mode
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={isDark ? colors.primary : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card>
              <TouchableOpacity onPress={() => router.push('/(app)/brands/' as any)}>
                <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="pricetag-outline" size={20} color={colors.text} />
                    <Text style={[typography.label, { color: colors.text, marginLeft: spacing.md }]}>
                      Manage Brands
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            </Card>

            <Button
              title="Logout"
              onPress={handleLogout}
              variant="danger"
              fullWidth
              size="lg"
              style={{ marginTop: spacing['3xl'] }}
              icon={<Ionicons name="log-out-outline" size={20} color="#fff" />}
            />
          </View>
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
  profileHeader: { position: 'relative', height: 160, marginBottom: 50 },
  bgImage: { width: '100%', height: 160 },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    borderWidth: 4,
    borderRadius: 60,
  },
  avatar: { width: 88, height: 88 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
