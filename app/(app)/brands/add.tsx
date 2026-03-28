import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/src/theme';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { addBrand } from '@/src/api/products';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function AddBrandScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { merchantId } = useAuth();
  const queryClient = useQueryClient();
  const { imageUri, pickImage, clearImage } = useImagePicker();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Brand name is required');
      return;
    }
    if (!merchantId) return;

    setLoading(true);
    try {
      await addBrand({
        name: name.trim(),
        description: description.trim(),
        createdByType: 'Merchant',
        createdById: merchantId,
        logo: imageUri ? { uri: imageUri } : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      Alert.alert('Success', 'Brand added!');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to add brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.text }]}>Add Brand</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(400).springify()}>
          {/* Logo Picker */}
          <Text style={[typography.label, { color: colors.text, marginBottom: spacing.sm }]}>Brand Logo</Text>
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.logoPicker, { borderColor: colors.border, borderRadius: borderRadius.lg }]}
          >
            {imageUri ? (
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: imageUri }} style={[styles.logoImage, { borderRadius: borderRadius.lg }]} />
                <TouchableOpacity onPress={clearImage} style={[styles.removeBtn, { backgroundColor: colors.error }]}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
                <Text style={[typography.caption, { color: colors.textTertiary, marginTop: spacing.sm }]}>
                  Tap to upload logo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{ height: spacing.xl }} />

          <Input label="Brand Name" value={name} onChangeText={setName} placeholder="e.g. Nike" required leftIcon="pricetag-outline" />
          <Input label="Description" value={description} onChangeText={setDescription} placeholder="Brand description" multiline numberOfLines={3} leftIcon="document-text-outline" />

          <Button title="Add Brand" onPress={handleSubmit} loading={loading} fullWidth size="lg" style={{ marginTop: spacing.lg }} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  logoPicker: { borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImage: { width: 120, height: 120 },
  logoPlaceholder: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
  removeBtn: { position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
