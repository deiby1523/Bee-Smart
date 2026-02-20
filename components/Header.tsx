import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { Hexagon, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header() {
  const goHome = () => {
    router.push('/(app)/home_page');
  };

  const goMore = () => {
    router.push('/(app)/more');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Hexagon color={theme.colors.primary} size={28} strokeWidth={2} />

        <TouchableOpacity onPress={goHome}>
          <Text style={styles.title}>Bee-Smart</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goMore}>
          <User color={theme.colors.primary} size={26} strokeWidth={2} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: -5,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
});
