import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image } from 'react-native';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
require('@/assets/images/icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/(app)');
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAsGuest();
      router.replace('/(app)');
    } catch (err) {
      setError('Error al continuar como invitado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.Space} />
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>Bee-Smart</Text>
            <Text style={styles.subtitle}>Suite de manejo</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.index}>Email o Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="ingresa tu email o usuario"
              placeholderTextColor={theme.colors.mediumGray}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.index}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={theme.colors.mediumGray}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.buttonText}>Ingresar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.Space} />

            <TouchableOpacity
              style={[styles.guestButton, loading && styles.buttonDisabled]}
              onPress={handleGuestLogin}
              disabled={loading}
            >
              <Text style={styles.guestButtonText}>
                Continuar como Invitado
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Nuevo en Bee-Smart? </Text>

              <TouchableOpacity
                style={styles.buttonRegister}
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.term}>
            @2026 Bee-Smart. Todos los derechos reservados.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius * 1.2,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.ligth.shadowColor,
    shadowOffset: theme.ligth.shadowOffset,
    shadowOpacity: theme.ligth.shadowOpacity,
    shadowRadius: theme.ligth.shadowRadius,
    elevation: theme.ligth.elevation,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  Space: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.darkGray,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: theme.spacing.xl,
  },
  index: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    textAlign: 'left',
    marginBottom: theme.spacing.sm,
  },
  term: {
    fontSize: theme.typography.term.fontSize,
    color: theme.colors.darkGray,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: theme.borderRadius,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.black,
    backgroundColor: theme.colors.white,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  buttonRegister: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.mediumGray,
    marginVertical: theme.spacing.md,
  },
  guestButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  guestButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  footerText: {
    color: theme.colors.darkGray,
    fontSize: theme.typography.body.fontSize,
  },
  footerLink: {
    color: theme.colors.black,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
