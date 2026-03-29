import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useAuthStore } from '@/src/store/authStore';
import { useTheme } from '@/src/theme';
import { connectSocket, disconnectSocket } from '@/src/services/socket';

export const OnlineToggle = () => {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { isOnline, setOnline, merchant } = useAuthStore();
  
  const progress = useSharedValue(isOnline ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isOnline ? 1 : 0, { duration: 300 });

    // Sync socket on state change
    if (isOnline && merchant?.id) {
      connectSocket(merchant.id);
    } else {
      disconnectSocket();
    }
  }, [isOnline, merchant?.id]);

  const handleToggle = () => {
    const nextStatus = !isOnline;
    Alert.alert(
      'Confirm Status Change',
      `Are you sure you want to go ${nextStatus ? 'ONLINE' : 'OFFLINE'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
             await setOnline(nextStatus);
          }
        },
      ]
    );
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.success]
    );
    return { backgroundColor };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    const translateX = progress.value * 44; // Adjusted for 80 width - 2*2 padding - 28 circle width
    return {
      transform: [{ translateX }],
    };
  });

  const animatedLabelOnlineStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const animatedLabelOfflineStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
    >
      <Animated.View style={[
        styles.container, 
        { borderRadius: borderRadius.full },
        animatedContainerStyle
      ]}>
        <View style={styles.labelContainer}>
          <Animated.Text style={[
            typography.labelSmall, 
            { color: colors.textInverse, fontSize: 8 },
            animatedLabelOnlineStyle
          ]}>
            ONLINE
          </Animated.Text>
          <Animated.Text style={[
            typography.labelSmall, 
            { color: colors.textSecondary, fontSize: 8 },
            animatedLabelOfflineStyle
          ]}>
            OFFLINE
          </Animated.Text>
        </View>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.full,
            },
            animatedCircleStyle
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    left: 0,
  },
  circle: {
    width: 24,
    height: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
