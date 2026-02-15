import { theme } from '@/constants/theme';
import { firebaseConfig } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword
} from 'firebase/auth';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowse from 'expo-web-browser';

WebBrowse.maybeCompleteAuthSession();

import { SafeAreaView } from 'react-native-safe-area-context';
require('@/assets/images/icon.png');

export default function LoginScreen() {
  //Ingreso Gooogle
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '855966967630-g9chns1njmb3uvshe0kra9hvd1689msn.apps.googleusercontent.com',
    clientId:
      '855966967630-iau7vd20tuddbqqi9ul910iuvia9bd2o.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          router.replace('/');
        })
        .catch((error) => {
          console.log(error);
          showError('Error al iniciar sesión con Google');
        });
    }
  }, [response]);

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
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Image
              source={{
                uri: 'https://developers.google.com/identity/images/g-logo.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  googleButtonText: {
    color: '#3C4043',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
});
