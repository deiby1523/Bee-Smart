import { theme } from '@/constants/theme';
import { firebaseConfig } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
require('@/assets/images/icon.png');

export default function LoginScreen() {
  const showError = (message: string) => {
    setErrorMessage(message);

    errorAnim.setValue(0);
    Animated.timing(errorAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const [errorMessage, setErrorMessage] = useState<string>('');
  const errorAnim = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleCreateAccount = () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los espacios');
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Contraseña inválida',
        'La contraseña debe tener al menos 8 caracteres',
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Éxito', 'Cuenta creada correctamente');
        console.log(userCredential.user);
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const handleSignIn = () => {
    setErrorMessage('');

    if (!email || !password) {
      showError('Por favor completa todos los campos');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace('/');
      })
      .catch(() => {
        showError('El usuario o la contraseña son incorrectos');
      });
  };
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Bee- Smart</Text>
          <Text style={styles.subtitle}>Suite de manejo</Text>
          {errorMessage ? (
            <Animated.Text
              style={[
                styles.errorText,
                {
                  opacity: errorAnim,
                  transform: [
                    {
                      translateY: errorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-6, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {errorMessage}
            </Animated.Text>
          ) : null}
          <Text style={styles.index}>Email o Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.colors.mediumGray}
            autoCapitalize="none"
            onChangeText={(Text) => setEmail(Text)}
          />
          <View style={styles.passwordInfo}>
            <Text style={styles.index}>Contraseña</Text>
            <TouchableOpacity>
              <Text style={styles.term}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Insgresa tu Constraseña"
            placeholderTextColor={theme.colors.mediumGray}
            autoCapitalize="none"
            onChangeText={(Text) => setPassword(Text)}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.guestButton} onPress={() => {}}>
            <Text style={styles.guestButtonText}>Iniciar como invitado</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={() => {
              router.replace('/(auth)/register');
            }}
          >
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 320,
    height: 'auto',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.mediumGray,
    borderWidth: 2,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.black,
    elevation: 4,
  },
  passwordInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 70,
    marginBottom: -20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: -5,
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
    marginBottom: theme.spacing.xs,
  },
  index: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.black,
    textAlign: 'left',
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  term: {
    fontSize: theme.typography.term.fontSize,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.black,
    backgroundColor: theme.colors.lightGray,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  buttonRegister: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
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
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.xs,
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
  errorText: {
    color: theme.colors.error,
    fontSize: 10,
    marginTop: 3,
    marginBottom: 3,
    textAlign: 'center',
    marginLeft: 4,
  },
});
