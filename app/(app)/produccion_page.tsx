import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { theme } from '@/constants/theme';

export default function Page3Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Página 3</Text>
          <Text style={styles.description}>
            Esta es la tercera página de contenido. Completa la plantilla de navegación de tu aplicación.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Configuración Completada</Text>
          <Text style={styles.contentText}>
            Tu aplicación está lista con todos los componentes esenciales para un proyecto móvil moderno.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Tecnologías Implementadas</Text>
          <Text style={styles.contentText}>
            • React Native{'\n'}
            • TypeScript{'\n'}
            • Expo Router{'\n'}
            • AsyncStorage para persistencia{'\n'}
            • Lucide React Native para iconos
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Listo para Expandir</Text>
          <Text style={styles.contentText}>
            Ahora puedes comenzar a agregar funcionalidades específicas de tu proyecto. La estructura está lista para escalar.
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
