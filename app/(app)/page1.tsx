import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';
import { theme } from '@/constants/theme';

export default function Page1Screen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Página 1</Text>
          <Text style={styles.description}>
            Esta es la primera página de contenido de tu aplicación. Puedes agregarle toda la funcionalidad que necesites.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Sección de Contenido</Text>
          <Text style={styles.contentText}>
            Aquí puedes colocar información, formularios, listas u otros elementos según las necesidades de tu proyecto.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Características</Text>
          <Text style={styles.contentText}>
            • Navegación funcional{'\n'}
            • Header personalizable{'\n'}
            • Layout responsivo{'\n'}
            • Sistema de autenticación
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
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    lineHeight: 24,
  },
  contentBox: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  contentTitle: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    lineHeight: 24,
  },
});
