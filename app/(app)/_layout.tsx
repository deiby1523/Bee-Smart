import React from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Home, FileText } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function AppLayout() {
  const tabBarOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.black,
    tabBarInactiveTintColor: theme.colors.darkGray,
    tabBarStyle: {
      backgroundColor: theme.colors.white,
      borderTopColor: theme.colors.mediumGray,
      borderTopWidth: 1,
    },
  };

  return (
    <Tabs screenOptions={tabBarOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="page1"
        options={{
          title: 'Página 1',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="page2"
        options={{
          title: 'Página 2',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="page3"
        options={{
          title: 'Página 3',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
