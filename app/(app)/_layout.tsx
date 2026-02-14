import { theme } from '@/constants/theme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { FileText, Hexagon, Home, Grid } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ColmenasIcon from '@/components/ColmenasIcon';



const styles = StyleSheet.create({
  colmenasContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hexagon: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'absolute',
  },
});

export default function AppLayout() {
  const tabBarOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
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
        name="home_page"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="apiarios"
        options={{
          title: 'Apiarios',
          tabBarIcon: ({ color }) => <Hexagon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="colmenas_page"
        options={{
          title: 'Colmenas',
          tabBarIcon: ({ color }) => <ColmenasIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="inspecciones_page"
        options={{
          title: 'Inspecciones',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="produccion_page"
        options={{
          title: 'Produccion',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
