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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      router.replace('/(app)');
    } catch (err) {
      setError('Error al registrar la cuenta');
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
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a nosotros hoy</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor={theme.colors.mediumGray}
            value={name}
            onChangeText={setName}
            editable={!loading}
            autoCapitalize="words"
          />

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

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor={theme.colors.mediumGray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
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
  backButton: {
    color: theme.colors.darkGray,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.lg,
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
