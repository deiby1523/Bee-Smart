import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { theme } from '@/constants/theme';

export default function Page2Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Página 2</Text>
          <Text style={styles.description}>
            Esta es la segunda página -- de contenido. Es un espacio listo para expandirse con tus propias características.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Plantilla Base</Text>
          <Text style={styles.contentText}>
            Esta aplicación sirve como una plantilla sólida para iniciar proyectos más grandes y complejos.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Estructura Modular</Text>
          <Text style={styles.contentText}>
            • Contexto de autenticación configurado{'\n'}
            • Componentes reutilizables{'\n'}
            • Sistema de rutas con expo-router{'\n'}
            • TypeScript para mayor seguridad
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Próximos Pasos</Text>
          <Text style={styles.contentText}>
            Puedes agregar funcionalidades específicas, integrar APIs, o expandir la lógica de negocio según sea necesario.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
