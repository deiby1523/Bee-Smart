import { theme } from '@/constants/theme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { FileText, Hexagon, Home, Grid } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Componente personalizado para el icono de colmenas
const ColmenasIcon = ({ color, size = 24 }: { color: string; size?: number }) => {
  return (
    <View style={[styles.colmenasContainer, { width: size, height: size }]}>
      <View style={[styles.hexagon, { borderColor: color }]} />
      <View style={[styles.hexagon, { borderColor: color }]} />
    </View>
  );
};

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
        name="index"
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
        name="page1"
        options={{
          title: 'Colmenas',
          tabBarIcon: ({ color }) => <ColmenasIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="page2"
        options={{
          title: 'Inspecciones',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="page3"
        options={{
          title: 'Produccion',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
