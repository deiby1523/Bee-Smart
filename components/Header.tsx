import { theme } from '@/constants/theme';
import { Hexagon, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header() {
  const handleProfilePress = () => {
    console.log('Ir a perfil');
    // router.push('/profile') si quieres navegación
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Izquierda */}
        <View style={styles.left}>
          <Hexagon color={theme.colors.primary} size={28} strokeWidth={2} />
        </View>

        {/* Título centrado */}
        <Text style={styles.title}>Bee-Smart</Text>

        {/* Icono derecha */}
        <TouchableOpacity style={styles.right} onPress={handleProfilePress}>
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
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
});
