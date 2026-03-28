import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface UseImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export const useImagePicker = (options: UseImagePickerOptions = {}) => {
  const { allowsEditing = true, aspect = [1, 1], quality = 0.8 } = options;
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera roll permission is needed to pick images.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing,
      aspect,
      quality,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  }, [allowsEditing, aspect, quality]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to take photos.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing,
      aspect,
      quality,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  }, [allowsEditing, aspect, quality]);

  const clearImage = useCallback(() => setImageUri(null), []);

  return { imageUri, pickImage, takePhoto, clearImage, setImageUri };
};
