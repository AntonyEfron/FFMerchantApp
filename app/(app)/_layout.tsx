import React from 'react';
import { Tabs, Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme';
import { useAuthStore } from '@/src/store/authStore';
import { useNotificationStore } from '@/src/store/notificationStore';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { useAuth } from '@/src/hooks/useAuth';
import { connectSocket, disconnectSocket } from '@/src/services/socket';
import { useEffect } from 'react';

export default function AppLayout() {
  const { colors, typography, borderRadius } = useTheme();
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const newOrderCount = useNotificationStore((s) => s.newOrderCount);
  const { merchant } = useAuth(); // For profile icon usage
  const isOnline = useAuthStore((s) => s.isOnline);
  
  useEffect(() => {
    if (isAuthenticated && isOnline && merchant?.id) {
       connectSocket(merchant.id);
    } else {
       disconnectSocket();
    }
  }, [isAuthenticated, isOnline, merchant?.id]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 10,
          letterSpacing: 0.3,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "cube" : "cube-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "receipt" : "receipt-outline"} size={26} color={color} />
          ),
          tabBarBadge: newOrderCount > 0 ? newOrderCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.surface,
            fontSize: 10,
            fontFamily: typography.fontFamily.bold,
          }
        }}
      />
      <Tabs.Screen
        name="revenue"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "wallet" : "wallet-outline"} size={26} color={color} />
          ),
        }}
      />
      
      {/* Settings / Profile screen combined icon */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              borderWidth: focused ? 2 : 0,
              borderColor: color,
              borderRadius: borderRadius.full,
              padding: focused ? 2 : 0,
            }}>
              <Ionicons name="person-circle-outline" size={focused ? 24 : 28} color={color} />
            </View>
          ),
        }}
      />
      {/* Hidden screens accessible via navigation */}
      <Tabs.Screen
        name="brands"
        options={{
          href: null, // Hidden from tab bar
        }}
      />
    </Tabs>
  );
}
