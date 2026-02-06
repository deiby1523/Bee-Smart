import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';
import { LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            router.replace('/(auth)/login')
            await logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut color={theme.colors.black} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  greeting: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.darkGray,
    marginBottom: 2,
  },
  userName: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.black,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
});
