import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';

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
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.colors.mediumGray}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
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
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.guestButton, loading && styles.buttonDisabled]}
            onPress={handleGuestLogin}
            disabled={loading}
          >
            <Text style={styles.guestButtonText}>Continuar como Invitado</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
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
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
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
    marginVertical: theme.spacing.lg,
  },
  guestButton: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  guestButtonText: {
    color: theme.colors.black,
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
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
