import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>
            {user?.isGuest
              ? 'Estás navegando como invitado'
              : 'Tu cuenta ha sido sincronizada correctamente'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Tipo de cuenta:</Text>
          <Text style={styles.infoValue}>
            {user?.isGuest ? 'Invitado' : 'Registrado'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>

        {!user?.isGuest && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Correo:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        )}

        <View style={styles.navigationHint}>
          <Text style={styles.navigationText}>
            Usa las pestañas inferiores para navegar por la aplicación
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.black,
  },
  infoLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.black,
  },
  navigationHint: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  navigationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
});
